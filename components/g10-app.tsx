"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowLeft, ArrowRight, Bell, CalendarDays, Check, ChevronDown,
  ChevronLeft, ChevronRight, Clock, Dumbbell, GripVertical, Home,
  LogOut, MessageCircle, MoreHorizontal, Plus, Share2, Trash2, UsersRound, X,
} from "lucide-react";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

import {
  useG10Workspace,
  type AthleteOption,
  type G10Exercise as Exercise,
  type G10Session as Session,
} from "@/lib/use-g10-workspace";

type Role = "coach" | "athlete";
type Screen = "home" | "training";

const photos = [
  "/images/exercise-1.jpg",
  "/images/exercise-2.jpg",
  "/images/exercise-3.jpg",
  "/images/exercise-4.jpg",
  "/images/exercise-5.jpg",
  "/images/exercise-6.jpg",
];

const defaultExercises: Exercise[] = [
  { id: "1", name: "Sentadilla trasera", sets: 4, reps: "6", rest: 120, detail: "Carga: 70% 1RM", image: photos[0] },
  { id: "2", name: "Salto al cajón", sets: 4, reps: "5", rest: 90, detail: "Altura: 60 cm", image: photos[1] },
  { id: "3", name: "Sprint 20 m", sets: 6, reps: "1", rest: 60, detail: "Recuperación completa", image: photos[2] },
  { id: "4", name: "Zancada búlgara", sets: 3, reps: "8 por pierna", rest: 90, detail: "Carga: mancuernas", image: photos[3] },
  { id: "5", name: "Plancha frontal", sets: 3, reps: "45 segundos", rest: 45, detail: "Core estable", image: photos[4] },
  { id: "6", name: "Movilidad y vuelta a la calma", sets: 1, reps: "10 min", rest: 0, detail: "Respiración y descarga", image: photos[5] },
];

const starter: Session = {
  title: "Fuerza + Velocidad",
  objective: "Desarrollo de fuerza y potencia",
  duration: 75,
  load: "Alta",
  exercises: defaultExercises,
};

const avatar = "/images/avatar.jpg";

function normalizeSession(value: Partial<Session>): Session {
  const source = Array.isArray(value.exercises) ? value.exercises : defaultExercises;
  return {
    ...starter,
    ...value,
    exercises: source.map((exercise, index) => ({
      ...defaultExercises[index % defaultExercises.length],
      ...exercise,
      id: exercise.id || String(index + 1),
      image: exercise.image || photos[index % photos.length],
      detail: exercise.detail || "Trabajo técnico",
    })),
  };
}

function useLocalSession() {
  const [session, setSession] = useState<Session>(starter);
  useEffect(() => {
    const raw = localStorage.getItem("g10-demo-session");
    if (!raw) return;
    try { setSession(normalizeSession(JSON.parse(raw))); } catch {}
  }, []);
  const save = (next: Session) => {
    const normalized = normalizeSession(next);
    setSession(normalized);
    localStorage.setItem("g10-demo-session", JSON.stringify(normalized));
  };
  return { session, save };
}

function Brand({ role }: { role: Role }) {
  return (
    <div className="brand-lockup">
      <Image className="brand-logo" src="/images/g10-logo.png" alt="G10" width={94} height={32} priority />
      <div className="brand-role">{role === "coach" ? "Profesor" : "Deportista"}</div>
    </div>
  );
}

function Header({ role, onAccount, connected }: { role: Role; onAccount: () => void; connected: boolean }) {
  return (
    <header className="app-header">
      <Brand role={role} />
      <div className="header-actions">
        {role === "athlete" && <button className="bare-icon" aria-label="Notificaciones"><Bell size={21} /></button>}
        <button
          className="avatar-button"
          aria-label="Abrir cuenta"
          onClick={onAccount}
        >
          <Image src={avatar} alt="" width={38} height={38} />
          <i className={connected ? "online" : ""} />
        </button>
      </div>
    </header>
  );
}

function BottomNav({ role }: { role: Role }) {
  const coach = [
    [Home, "Inicio"], [UsersRound, "Deportistas"], [CalendarDays, "Planificar"],
    [MessageCircle, "Mensajes"], [MoreHorizontal, "Más"],
  ] as const;
  const athlete = [
    [Home, "Inicio"], [Dumbbell, "Entrenamiento"], [CalendarDays, "Progreso"],
    [MessageCircle, "Mensajes"], [MoreHorizontal, "Más"],
  ] as const;
  return (
    <nav className="bottom-nav">
      {(role === "coach" ? coach : athlete).map(([Icon, label], index) => (
        <button key={label} className={index === (role === "coach" ? 2 : 0) ? "active" : ""}>
          <Icon size={20} strokeWidth={1.8} /><span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function CoachView({
  session,
  save,
  athletes,
  selectedAthleteId,
  onSelectAthlete,
  syncing,
}: {
  session: Session;
  save: (session: Session) => Promise<{ ok: boolean; message: string }>;
  athletes: AthleteOption[];
  selectedAthleteId: string;
  onSelectAthlete: (id: string) => void;
  syncing: boolean;
}) {
  const [draft, setDraft] = useState(session);
  const [toast, setToast] = useState("");
  useEffect(() => setDraft(session), [session]);
  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };
  const updateExercise = (id: string, name: string) => setDraft({
    ...draft,
    exercises: draft.exercises.map((exercise) => exercise.id === id ? { ...exercise, name } : exercise),
  });
  const removeExercise = (id: string) => setDraft({
    ...draft, exercises: draft.exercises.filter((exercise) => exercise.id !== id),
  });
  const addExercise = () => {
    const index = draft.exercises.length;
    setDraft({
      ...draft,
      exercises: [...draft.exercises, {
        id: crypto.randomUUID(), name: "Nuevo ejercicio", sets: 3, reps: "10",
        rest: 60, detail: "Trabajo técnico", image: photos[index % photos.length],
      }],
    });
  };
  const selectedAthlete = athletes.find((athlete) => athlete.id === selectedAthleteId);
  const persist = async () => {
    const result = await save(draft);
    flash(result.message);
  };
  return (
    <>
      <main className="screen-content coach-content">
        <div className="top-tabs">
          <button className="active">Planificación</button><button>Deportistas</button><button>Evaluaciones</button>
        </div>

        <div className="week-title">
          <button className="square-button"><ChevronLeft size={20} /></button>
          <strong>Semana 16 – 22 Sep</strong>
          <button className="square-button"><ChevronRight size={20} /></button>
        </div>
        <div className="date-strip">
          {["Lun|16", "Mar|17", "Mié|18", "Jue|19", "Vie|20", "Sáb|21", "Dom|22"].map((day, index) => {
            const [name, date] = day.split("|");
            return <button key={day} className={index === 1 ? "selected" : ""}><span>{name}</span><strong>{date}</strong></button>;
          })}
        </div>

        <label className="field-label">Seleccioná deportista</label>
        <div className="athlete-select">
          <Image src={avatar} alt="" width={44} height={44} />
          <span>
            <strong>{selectedAthlete?.fullName ?? "Julián Bordón"}</strong>
            <small>{selectedAthlete ? [selectedAthlete.sport, selectedAthlete.position].filter(Boolean).join(" · ") : "Delantero · 19 años"}</small>
          </span>
          <ChevronDown size={20} />
          {athletes.length > 0 && (
            <select aria-label="Seleccionar deportista" value={selectedAthleteId} onChange={(event) => onSelectAthlete(event.target.value)}>
              {athletes.map((athlete) => <option key={athlete.id} value={athlete.id}>{athlete.fullName}</option>)}
            </select>
          )}
        </div>

        <div className="section-title"><h2>Crear sesión</h2><button>Plantillas</button></div>
        <section className="panel form-panel">
          <label>
            <span>Nombre de la sesión</span>
            <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
          </label>
          <label>
            <span>Objetivo</span>
            <input value={draft.objective} onChange={(event) => setDraft({ ...draft, objective: event.target.value })} />
          </label>
          <div className="form-grid">
            <label><span>Duración estimada</span><div className="input-with-unit"><input type="number" value={draft.duration} onChange={(event) => setDraft({ ...draft, duration: Number(event.target.value) })} /><em>min</em></div></label>
            <label><span>Carga objetivo</span><select value={draft.load} onChange={(event) => setDraft({ ...draft, load: event.target.value as Session["load"] })}><option>Baja</option><option>Media</option><option>Alta</option></select></label>
          </div>
        </section>

        <div className="section-title exercise-heading"><h2>Ejercicios</h2><button onClick={addExercise}><Plus size={16} /> Agregar</button></div>
        <section className="exercise-editor">
          {draft.exercises.slice(0, 6).map((exercise) => (
            <motion.div layout key={exercise.id} className="editor-row">
              <GripVertical className="drag" size={19} />
              <Image className="thumb" src={exercise.image} alt="" width={48} height={48} />
              <div className="editor-copy">
                <input aria-label={"Nombre de " + exercise.name} value={exercise.name} onChange={(event) => updateExercise(exercise.id, event.target.value)} />
                <span>{exercise.sets} series · {exercise.reps} repeticiones</span>
              </div>
              <button className="row-menu" onClick={() => removeExercise(exercise.id)} aria-label={"Eliminar " + exercise.name}><Trash2 size={16} /></button>
            </motion.div>
          ))}
        </section>
        <div className="dual-actions">
          <button className="secondary-action" disabled={syncing} onClick={() => flash("Borrador guardado en este dispositivo")}>Guardar borrador</button>
          <button className="primary-action" disabled={syncing} onClick={persist}>{syncing ? "Sincronizando…" : "Asignar sesión"}</button>
        </div>
      </main>
      <BottomNav role="coach" />
      <AnimatePresence>{toast && <motion.div className="toast" initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>{toast}</motion.div>}</AnimatePresence>
    </>
  );
}

function ProgressRing({ value, label }: { value: string; label: string }) {
  const numeric = parseInt(value, 10);
  return (
    <div className="ring-stat">
      <div className="ring" style={{ "--progress": Number.isFinite(numeric) ? numeric : 80 } as CSSProperties}><strong>{value}</strong></div>
      <span>{label}</span>
    </div>
  );
}

function AthleteView({ session, openTraining }: { session: Session; openTraining: () => void }) {
  return (
    <>
      <main className="screen-content athlete-content">
        <h1>¡Hola, Julián!</h1>
        <p className="subtitle">Disciplina hoy, resultados mañana.</p>
        <section className="daily-progress panel">
          <div><strong>Hoy</strong><span>Mar 17 Sep</span></div>
          <div className="small-ring">72%</div>
          <div><span>Semana 3/4</span><strong>72%</strong></div>
        </section>

        <motion.section className="session-card" whileTap={{ scale: 0.992 }}>
          <div className="session-card-top"><span className="today-label">Sesión de hoy</span><span className="intensity-label">Alta intensidad</span></div>
          <h2>{session.title}</h2>
          <div className="session-meta"><span><Clock size={17} /> {session.duration} minutos</span><span><Dumbbell size={17} /> {session.exercises.length} ejercicios</span></div>
          <p><i className="load-dot" /> Carga objetivo: {session.load}</p>
          <button className="session-cta" onClick={openTraining}>Ver entrenamiento <ArrowRight size={20} /></button>
        </motion.section>

        <div className="section-title"><h2>Mi estado de hoy</h2><button>Completar ›</button></div>
        <div className="wellness-grid">
          <div className="metric-card"><b className="metric-icon purple">☾</b><span>Sueño</span><strong>7h 30m</strong></div>
          <div className="metric-card"><b className="metric-icon yellow">ϟ</b><span>Fatiga</span><strong>3/10</strong></div>
          <div className="metric-card"><b className="metric-icon red">♥</b><span>Dolor</span><strong>2/10</strong></div>
          <div className="metric-card"><b className="metric-icon green">◉</b><span>Estrés</span><strong>3/10</strong></div>
        </div>

        <div className="section-title"><h2>Progreso semanal</h2><button>Ver más ›</button></div>
        <section className="panel ring-panel">
          <ProgressRing value="4/5" label="Sesiones" /><ProgressRing value="82%" label="Carga objetivo" /><ProgressRing value="92%" label="Adherencia" />
        </section>
        <section className="panel coach-message">
          <Image src={avatar} alt="" width={42} height={42} />
          <div><strong>Mensaje del profe</strong><p>Dale Julián! Buenas sensaciones esta semana. Enfocados en la técnica 🔥</p><small>Hace 2 horas</small></div>
        </section>
      </main>
      <BottomNav role="athlete" />
    </>
  );
}

function TrainingView({
  session,
  onBack,
  onComplete,
}: {
  session: Session;
  onBack: () => void;
  onComplete: (session: Session) => Promise<{ ok: boolean; message: string }>;
}) {
  const [done, setDone] = useState<string[]>([]);
  const [completionMessage, setCompletionMessage] = useState("");
  const progress = useMemo(() => Math.round((done.length / Math.max(session.exercises.length, 1)) * 100), [done, session.exercises.length]);
  return (
    <main className="training-screen">
      <header className="training-header">
        <button onClick={onBack}><ArrowLeft size={23} /></button><strong>Entrenamiento</strong><button><Share2 size={21} /></button>
      </header>
      <section className="training-hero">
        <Image src={photos[0]} alt="Entrenamiento de fuerza" fill priority sizes="430px" />
        <div className="hero-overlay">
          <h1>{session.title}</h1>
          <div><span><Clock size={16} /> {session.duration} minutos</span><span><Dumbbell size={16} /> {session.exercises.length} ejercicios</span><b>Alta intensidad</b></div>
        </div>
      </section>
      <div className="training-body">
        <div className="training-tabs"><button className="active">Ejercicios</button><button>Indicaciones</button><button>Material</button></div>
        <section className="training-list">
          {session.exercises.map((exercise, index) => {
            const checked = done.includes(exercise.id);
            return (
              <motion.button
                whileTap={{ scale: 0.99 }}
                className={"training-row " + (checked ? "done" : "")}
                key={exercise.id}
                onClick={() => setDone(checked ? done.filter((id) => id !== exercise.id) : [...done, exercise.id])}
              >
                <span className="number-dot">{index + 1}</span>
                <Image src={exercise.image} alt="" width={68} height={60} />
                <span className="training-copy">
                  <strong>{exercise.name}</strong><small>{exercise.sets} × {exercise.reps}</small><small>{exercise.detail}</small>{exercise.rest > 0 && <small>Descanso: {exercise.rest} seg</small>}
                </span>
                <span className="checkbox">{checked && <Check size={16} />}</span>
              </motion.button>
            );
          })}
        </section>
        <div className="completion-copy"><span>Progreso de la sesión</span><strong>{done.length}/{session.exercises.length}</strong></div>
        <div className="completion-track"><motion.div animate={{ width: progress + "%" }} /></div>
        <button
          className="complete-button"
          disabled={progress < 100}
          onClick={async () => {
            const result = await onComplete(session);
            setCompletionMessage(result.message);
          }}
        >
          {progress === 100 ? "Registrar sesión completada" : "Marcá todos los ejercicios"}
        </button>
        {completionMessage && <p className="completion-message">{completionMessage}</p>}
      </div>
    </main>
  );
}

function AccountPanel({
  open,
  onClose,
  role,
  setDemoRole,
  configured,
  userEmail,
  workspaceRole,
  message,
  syncing,
  signIn,
  signUp,
  signOut,
}: {
  open: boolean;
  onClose: () => void;
  role: Role;
  setDemoRole: (role: Role) => void;
  configured: boolean;
  userEmail?: string;
  workspaceRole: string | null;
  message: string;
  syncing: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  signUp: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  signOut: () => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  if (!open) return null;
  const submit = async (mode: "signin" | "signup") => {
    if (!email || password.length < 6) {
      setFeedback("Ingresá un email y una contraseña de al menos 6 caracteres.");
      return;
    }
    const result = mode === "signin" ? await signIn(email, password) : await signUp(email, password);
    setFeedback(result.message);
    if (result.ok && mode === "signin") window.setTimeout(onClose, 700);
  };
  return (
    <motion.div className="account-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.section className="account-sheet" initial={{ y: 45 }} animate={{ y: 0 }}>
        <button className="account-close" onClick={onClose} aria-label="Cerrar cuenta"><X size={20} /></button>
        <Image className="account-logo" src="/images/g10-logo.png" alt="G10" width={130} height={44} />
        <h2>{userEmail ? "Tu cuenta G10" : "Ingresá a G10"}</h2>
        <p className="account-subtitle">Entrenamiento, seguimiento y rendimiento en un mismo equipo.</p>

        {userEmail ? (
          <div className="connected-account">
            <span>Conectado como</span><strong>{userEmail}</strong>
            <small>Rol: {workspaceRole ?? "pendiente de asignación"}</small>
            <button onClick={async () => { await signOut(); onClose(); }}><LogOut size={17} /> Cerrar sesión</button>
          </div>
        ) : (
          <>
            <div className="auth-fields">
              <label><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tu@email.com" /></label>
              <label><span>Contraseña</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Mínimo 6 caracteres" /></label>
            </div>
            <button className="auth-primary" disabled={!configured || syncing} onClick={() => submit("signin")}>{syncing ? "Conectando…" : "Iniciar sesión"}</button>
            <button className="auth-secondary" disabled={!configured || syncing} onClick={() => submit("signup")}>Crear cuenta</button>
          </>
        )}

        <div className="connection-state"><i className={userEmail ? "online" : ""} /> {feedback || message}</div>
        {!userEmail && (
          <div className="demo-switch">
            <span>Explorar sin cuenta</span>
            <div>
              <button className={role === "athlete" ? "active" : ""} onClick={() => { setDemoRole("athlete"); onClose(); }}>Vista alumno</button>
              <button className={role === "coach" ? "active" : ""} onClick={() => { setDemoRole("coach"); onClose(); }}>Vista profesor</button>
            </div>
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}

export function G10App() {
  const [role, setRole] = useState<Role>("athlete");
  const [screen, setScreen] = useState<Screen>("home");
  const [accountOpen, setAccountOpen] = useState(false);
  const { session: localSession, save: saveLocal } = useLocalSession();
  const workspace = useG10Workspace();
  const session = workspace.remoteSession ?? localSession;
  useEffect(() => {
    if (!workspace.role) return;
    setRole(["admin", "coach", "trainer"].includes(workspace.role) ? "coach" : "athlete");
  }, [workspace.role]);
  const switchRole = (nextRole: Role) => { setRole(nextRole); setScreen("home"); };
  const saveSession = async (nextSession: Session) => {
    saveLocal(nextSession);
    return workspace.saveRemoteSession(nextSession);
  };
  return (
    <div className="app-shell">
      <div className="phone-frame">
        <div className="phone-screen">
          <AnimatePresence mode="wait">
            {screen === "training" ? (
              <motion.div key="training" initial={{ x: 35, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 35, opacity: 0 }}>
                <TrainingView session={session} onBack={() => setScreen("home")} onComplete={workspace.completeRemoteSession} />
              </motion.div>
            ) : (
              <motion.div key={role} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Header role={role} onAccount={() => setAccountOpen(true)} connected={Boolean(workspace.user)} />
                {role === "coach" ? (
                  <CoachView
                    session={session}
                    save={saveSession}
                    athletes={workspace.athletes}
                    selectedAthleteId={workspace.selectedAthleteId}
                    onSelectAthlete={workspace.setSelectedAthleteId}
                    syncing={workspace.syncing}
                  />
                ) : <AthleteView session={session} openTraining={() => setScreen("training")} />}
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            <AccountPanel
              open={accountOpen}
              onClose={() => setAccountOpen(false)}
              role={role}
              setDemoRole={switchRole}
              configured={workspace.configured}
              userEmail={workspace.user?.email}
              workspaceRole={workspace.role}
              message={workspace.connectionMessage}
              syncing={workspace.syncing}
              signIn={workspace.signIn}
              signUp={workspace.signUp}
              signOut={workspace.signOut}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default G10App;
