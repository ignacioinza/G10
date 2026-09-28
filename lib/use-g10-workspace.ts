"use client";

import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useMemo, useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { PlanWeek } from "@/lib/g10-planning";

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

export type WellnessValues = {
  sleep: number;
  fatigue: number;
  pain: number;
  stress: number;
};

export type MediaUploadResult = AuthResult & {
  url?: string;
};

export type TestDefinition = {
  id: string;
  name: string;
  unit: string;
};

export type TestResult = {
  id: string;
  name: string;
  value: string;
  measuredAt: string;
};

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
  const [remoteWeeks, setRemoteWeeks] = useState<PlanWeek[] | null>(null);
  const [testDefinitions, setTestDefinitions] = useState<TestDefinition[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
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

  const loadPlanning = useCallback(async (athleteId: string) => {
    if (!supabase || !athleteId) return;
    const { data, error } = await supabase
      .from("planning_cycles")
      .select("plan_data")
      .eq("athlete_id", athleteId)
      .order("starts_on", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      setConnectionMessage("La sesión cargó, pero no pudimos recuperar el mesociclo");
      return;
    }
    const plan = data?.plan_data;
    setRemoteWeeks(Array.isArray(plan) && plan.length ? plan as PlanWeek[] : null);
  }, [supabase]);

  const loadEvaluations = useCallback(async (athleteId: string, organizationId: string) => {
    if (!supabase || !athleteId || !organizationId) return;
    const [definitionsResponse, resultsResponse] = await Promise.all([
      supabase.from("physical_test_definitions").select("id, name, unit").eq("organization_id", organizationId).order("name"),
      supabase.from("physical_test_results").select("id, numeric_value, text_value, measured_at, physical_test_definitions(name, unit)").eq("athlete_id", athleteId).order("measured_at", { ascending: false }).limit(12),
    ]);
    setTestDefinitions((definitionsResponse.data ?? []).map((item) => ({ id: item.id, name: item.name, unit: item.unit ?? "" })));
    setTestResults((resultsResponse.data ?? []).map((item) => {
      const definition = item.physical_test_definitions;
      const rawValue = item.numeric_value ?? item.text_value ?? "—";
      return {
        id: item.id,
        name: definition?.name ?? "Evaluación",
        value: `${rawValue}${definition?.unit ? ` ${definition.unit}` : ""}`,
        measuredAt: item.measured_at,
      };
    }));
  }, [supabase]);

  const loadWorkspace = useCallback(async (activeUser: User | null) => {
    setUser(activeUser);
    if (!supabase || !activeUser) {
      setRole(null);
      setAthletes([]);
      setRemoteSession(null);
      setRemoteWeeks(null);
      setTestDefinitions([]);
      setTestResults([]);
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
    if (user && selectedAthleteId) {
      const athlete = athletes.find((item) => item.id === selectedAthleteId);
      void Promise.all([
        loadSession(selectedAthleteId),
        loadPlanning(selectedAthleteId),
        athlete ? loadEvaluations(selectedAthleteId, athlete.organizationId) : Promise.resolve(),
      ]);
    }
  }, [athletes, loadEvaluations, loadPlanning, loadSession, selectedAthleteId, user]);

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

  const saveWellness = async (values: WellnessValues, notes: string): Promise<AuthResult> => {
    localStorage.setItem("g10-wellness", JSON.stringify({ ...values, notes, savedAt: new Date().toISOString() }));
    if (!supabase || !user || !selectedAthleteId) {
      return { ok: true, message: "Estado guardado en modo demostración." };
    }
    if (role !== "athlete") {
      return { ok: false, message: "El estado diario debe registrarlo el deportista." };
    }
    setSyncing(true);
    const { error } = await supabase.from("wellness_checkins").upsert({
      athlete_id: selectedAthleteId,
      checkin_date: new Date().toISOString().slice(0, 10),
      sleep_hours: values.sleep,
      fatigue: values.fatigue,
      stress: values.stress,
      pain: values.pain,
      notes: notes.trim() || null,
    }, { onConflict: "athlete_id,checkin_date" });
    setSyncing(false);
    return error
      ? { ok: false, message: "No pudimos sincronizar tu estado. Quedó guardado en este dispositivo." }
      : { ok: true, message: "Estado diario sincronizado." };
  };

  const savePlanning = async (weeks: PlanWeek[]): Promise<AuthResult> => {
    localStorage.setItem("g10-mesocycle", JSON.stringify(weeks));
    if (!supabase || !user) return { ok: true, message: "Mesociclo guardado en modo demostración." };
    const athlete = athletes.find((item) => item.id === selectedAthleteId);
    if (!athlete) return { ok: false, message: "Seleccioná un deportista para guardar el mesociclo." };
    if (!role || !["admin", "coach", "trainer"].includes(role)) {
      return { ok: false, message: "Tu rol no puede modificar la planificación." };
    }
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 27);
    setSyncing(true);
    const { error } = await supabase.from("planning_cycles").upsert({
      organization_id: athlete.organizationId,
      athlete_id: athlete.id,
      title: `Mesociclo ${start.toLocaleDateString("es-AR", { month: "long", year: "numeric", timeZone: "UTC" })}`,
      starts_on: start.toISOString().slice(0, 10),
      ends_on: end.toISOString().slice(0, 10),
      status: "active",
      plan_data: weeks,
      created_by: user.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: "organization_id,athlete_id,starts_on" });
    setSyncing(false);
    if (!error) setRemoteWeeks(weeks);
    return error
      ? { ok: false, message: "No pudimos sincronizar el mesociclo." }
      : { ok: true, message: "Mesociclo sincronizado con Supabase." };
  };

  const uploadMedia = async (file: File): Promise<MediaUploadResult> => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"];
    if (!allowed.includes(file.type)) return { ok: false, message: "Formato no admitido." };
    if (file.size > 50 * 1024 * 1024) return { ok: false, message: "El archivo supera el límite de 50 MB." };
    if (!supabase || !user) return { ok: true, message: "Vista previa local lista.", url: URL.createObjectURL(file) };
    const athlete = athletes.find((item) => item.id === selectedAthleteId);
    if (!athlete) return { ok: false, message: "Seleccioná un deportista antes de cargar material." };
    const safeName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${athlete.organizationId}/${user.id}/${crypto.randomUUID()}-${safeName}`;
    setSyncing(true);
    const { error: uploadError } = await supabase.storage.from("g10-media").upload(path, file, { upsert: false });
    if (uploadError) {
      setSyncing(false);
      return { ok: false, message: "No pudimos cargar el archivo." };
    }
    const { error: recordError } = await supabase.from("media_assets").insert({
      organization_id: athlete.organizationId,
      athlete_id: athlete.id,
      bucket_path: path,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      created_by: user.id,
    });
    if (recordError) {
      await supabase.storage.from("g10-media").remove([path]);
      setSyncing(false);
      return { ok: false, message: "El archivo no pudo registrarse de forma segura." };
    }
    const { data } = await supabase.storage.from("g10-media").createSignedUrl(path, 3600);
    setSyncing(false);
    return { ok: true, message: "Archivo sincronizado.", url: data?.signedUrl };
  };

  const saveTestResult = async (testId: string, numericValue: number): Promise<AuthResult> => {
    if (!Number.isFinite(numericValue)) return { ok: false, message: "Ingresá un resultado válido." };
    if (!supabase || !user) return { ok: true, message: "Evaluación guardada en modo demostración." };
    const athlete = athletes.find((item) => item.id === selectedAthleteId);
    if (!athlete) return { ok: false, message: "Seleccioná un deportista." };
    if (!role || !["admin", "coach", "trainer"].includes(role)) return { ok: false, message: "Tu rol no puede cargar evaluaciones." };
    setSyncing(true);
    const { error } = await supabase.from("physical_test_results").insert({
      athlete_id: athlete.id,
      test_id: testId,
      measured_at: new Date().toISOString().slice(0, 10),
      numeric_value: numericValue,
      recorded_by: user.id,
    });
    if (!error) await loadEvaluations(athlete.id, athlete.organizationId);
    setSyncing(false);
    return error
      ? { ok: false, message: "No pudimos guardar la evaluación." }
      : { ok: true, message: "Evaluación sincronizada." };
  };

  return {
    configured: isSupabaseConfigured,
    user,
    role,
    athletes,
    selectedAthleteId,
    setSelectedAthleteId,
    remoteSession,
    remoteWeeks,
    testDefinitions,
    testResults,
    syncing,
    connectionMessage,
    signIn,
    signUp,
    signOut,
    saveRemoteSession,
    completeRemoteSession,
    saveWellness,
    savePlanning,
    uploadMedia,
    saveTestResult,
  };
}

