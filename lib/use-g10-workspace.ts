"use client";

import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type G10Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: string;
  rest: number;
  detail: string;
  image: string;
};

export type G10Session = {
  id?: string;
  athleteId?: string;
  organizationId?: string;
  title: string;
  objective: string;
  duration: number;
  load: "Baja" | "Media" | "Alta";
  exercises: G10Exercise[];
};

export type AthleteOption = {
  id: string;
  organizationId: string;
  fullName: string;
  sport: string;
  position: string | null;
};

type WorkspaceRole = "admin" | "coach" | "athlete" | "trainer" | "nutritionist" | "physio";
type AuthResult = { ok: boolean; message: string };

const exercisePhotos = [
  "/images/exercise-1.jpg",
  "/images/exercise-2.jpg",
  "/images/exercise-3.jpg",
  "/images/exercise-4.jpg",
  "/images/exercise-5.jpg",
  "/images/exercise-6.jpg",
];

function mapSession(row: Record<string, unknown>): G10Session {
  const exercises = Array.isArray(row.session_exercises)
    ? [...row.session_exercises]
        .sort((a, b) => Number(a.sort_order) - Number(b.sort_order))
        .map((exercise, index) => ({
          id: String(exercise.id),
          name: String(exercise.exercise_name),
          sets: Number(exercise.sets ?? 1),
          reps: String(exercise.reps ?? exercise.duration_sec ?? "1"),
          rest: Number(exercise.rest_sec ?? 0),
          detail: exercise.notes ? String(exercise.notes) : "Trabajo técnico",
          image: exercisePhotos[index % exercisePhotos.length],
        }))
    : [];
  const targetRpe = Number(row.target_rpe ?? 6);
  return {
    id: String(row.id),
    athleteId: String(row.athlete_id),
    organizationId: String(row.organization_id),
    title: String(row.title),
    objective: String(row.session_type ?? row.notes ?? "Entrenamiento"),
    duration: Number(row.target_duration_min ?? 60),
    load: targetRpe >= 8 ? "Alta" : targetRpe >= 6 ? "Media" : "Baja",
    exercises,
  };
}

export function useG10Workspace() {
  const supabase = useMemo(
    () => (isSupabaseConfigured ? createSupabaseBrowserClient() : null),
    [],
  );
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<WorkspaceRole | null>(null);
  const [athletes, setAthletes] = useState<AthleteOption[]>([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState("");
  const [remoteSession, setRemoteSession] = useState<G10Session | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState(
    isSupabaseConfigured ? "Modo demostración" : "Supabase pendiente de configuración",
  );

  const loadSession = useCallback(async (athleteId: string) => {
    if (!supabase || !athleteId) return;
    const { data, error } = await supabase
      .from("training_sessions")
      .select("id, organization_id, athlete_id, title, session_type, target_duration_min, target_rpe, notes, scheduled_for, session_exercises(*)")
      .eq("athlete_id", athleteId)
      .order("scheduled_for", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      setConnectionMessage("No se pudo cargar la sesión");
      return;
    }
    setRemoteSession(data ? mapSession(data as Record<string, unknown>) : null);
  }, [supabase]);

  const loadWorkspace = useCallback(async (activeUser: User | null) => {
    setUser(activeUser);
    if (!supabase || !activeUser) {
      setRole(null);
      setAthletes([]);
      setRemoteSession(null);
      setConnectionMessage(isSupabaseConfigured ? "Modo demostración" : "Supabase pendiente de configuración");
      return;
    }

    setSyncing(true);
    await supabase.from("profiles").upsert({
      user_id: activeUser.id,
      full_name: activeUser.email?.split("@")[0] ?? "Usuario G10",
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    const { data: membership } = await supabase
      .from("memberships")
      .select("organization_id, role")
      .eq("user_id", activeUser.id)
      .maybeSingle();

    if (membership) {
      const workspaceRole = membership.role as WorkspaceRole;
      setRole(workspaceRole);
      const { data: athleteRows } = await supabase
        .from("athletes")
        .select("id, organization_id, user_id, full_name, sport, position")
        .eq("organization_id", membership.organization_id)
        .eq("status", "active")
        .order("full_name");
      const options = (athleteRows ?? []).map((athlete) => ({
        id: athlete.id,
        organizationId: athlete.organization_id,
        fullName: athlete.full_name,
        sport: athlete.sport ?? "Deporte",
        position: athlete.position,
      }));
      setAthletes(options);
      const athleteForUser = workspaceRole === "athlete"
        ? options.find((athlete) => athleteRows?.find((row) => row.id === athlete.id && row.user_id === activeUser.id))
        : options[0];
      const nextId = athleteForUser?.id ?? options[0]?.id ?? "";
      setSelectedAthleteId(nextId);
      setConnectionMessage(nextId ? "Datos sincronizados" : "Tu cuenta todavía no tiene deportistas asignados");
    } else {
      const { data: athlete } = await supabase
        .from("athletes")
        .select("id, organization_id, full_name, sport, position")
        .eq("user_id", activeUser.id)
        .maybeSingle();
      if (athlete) {
        const option = {
          id: athlete.id,
          organizationId: athlete.organization_id,
          fullName: athlete.full_name,
          sport: athlete.sport ?? "Deporte",
          position: athlete.position,
        };
        setRole("athlete");
        setAthletes([option]);
        setSelectedAthleteId(option.id);
        setConnectionMessage("Datos sincronizados");
      } else {
        setRole(null);
        setAthletes([]);
        setConnectionMessage("Cuenta creada. Falta asignarle un rol en G10.");
      }
    }
    setSyncing(false);
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => loadWorkspace(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      void loadWorkspace(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, [loadWorkspace, supabase]);

  useEffect(() => {
    if (user && selectedAthleteId) void loadSession(selectedAthleteId);
  }, [loadSession, selectedAthleteId, user]);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { ok: false, message: "Supabase todavía no está configurado." };
    setSyncing(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSyncing(false);
    return error
      ? { ok: false, message: "No pudimos iniciar sesión. Revisá el email y la contraseña." }
      : { ok: true, message: "Sesión iniciada." };
  };

  const signUp = async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { ok: false, message: "Supabase todavía no está configurado." };
    setSyncing(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (!error && data.user) {
      await supabase.from("profiles").upsert({
        user_id: data.user.id,
        full_name: email.split("@")[0],
      });
    }
    setSyncing(false);
    return error
      ? { ok: false, message: error.message }
      : { ok: true, message: data.session ? "Cuenta creada." : "Revisá tu email para confirmar la cuenta." };
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    await loadWorkspace(null);
  };

  const saveRemoteSession = async (session: G10Session): Promise<AuthResult> => {
    if (!supabase || !user) return { ok: true, message: "Sesión guardada en modo demostración." };
    const athlete = athletes.find((item) => item.id === selectedAthleteId);
    if (!athlete) return { ok: false, message: "Seleccioná un deportista." };
    if (!role || !["admin", "coach", "trainer"].includes(role)) {
      return { ok: false, message: "Tu rol no puede crear sesiones." };
    }
    setSyncing(true);
    const { data: created, error } = await supabase
      .from("training_sessions")
      .insert({
        organization_id: athlete.organizationId,
        athlete_id: athlete.id,
        coach_user_id: user.id,
        scheduled_for: new Date().toISOString().slice(0, 10),
        title: session.title,
        session_type: session.objective,
        target_duration_min: session.duration,
        target_rpe: session.load === "Alta" ? 8 : session.load === "Media" ? 6 : 4,
        status: "planned",
      })
      .select("id")
      .single();
    if (error || !created) {
      setSyncing(false);
      return { ok: false, message: "No se pudo guardar la sesión." };
    }
    const { error: exerciseError } = await supabase.from("session_exercises").insert(
      session.exercises.map((exercise, index) => ({
        session_id: created.id,
        exercise_name: exercise.name,
        sort_order: index,
        sets: exercise.sets,
        reps: exercise.reps,
        rest_sec: exercise.rest,
        notes: exercise.detail,
      })),
    );
    setSyncing(false);
    if (exerciseError) {
      await supabase.from("training_sessions").delete().eq("id", created.id);
      return { ok: false, message: "No se pudieron guardar los ejercicios." };
    }
    await loadSession(athlete.id);
    return { ok: true, message: "Sesión asignada y sincronizada." };
  };

  const completeRemoteSession = async (session: G10Session): Promise<AuthResult> => {
    if (!supabase || !user || !session.id || !session.athleteId) {
      return { ok: true, message: "Sesión completada en modo demostración." };
    }
    const { error } = await supabase.from("session_feedback").upsert({
      session_id: session.id,
      athlete_id: session.athleteId,
      actual_duration_min: session.duration,
      actual_rpe: session.load === "Alta" ? 8 : session.load === "Media" ? 6 : 4,
      completed_at: new Date().toISOString(),
    }, { onConflict: "session_id" });
    return error
      ? { ok: false, message: "No pudimos registrar la sesión." }
      : { ok: true, message: "Entrenamiento registrado." };
  };

  return {
    configured: isSupabaseConfigured,
    user,
    role,
    athletes,
    selectedAthleteId,
    setSelectedAthleteId,
    remoteSession,
    syncing,
    connectionMessage,
    signIn,
    signUp,
    signOut,
    saveRemoteSession,
    completeRemoteSession,
  };
}
