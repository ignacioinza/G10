"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Activity, CalendarDays, Check, Dumbbell, Home, Plus, Trash2, Trophy, UserRound, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Exercise = { id: string; name: string; sets: number; reps: string; rest: number };
type Session = {
  title: string;
  objective: string;
  duration: number;
  load: "Baja" | "Media" | "Alta";
  exercises: Exercise[];
};

const defaultExercises: Exercise[] = [
  { id: "1", name: "Sentadilla trasera", sets: 4, reps: "6", rest: 120 },
  { id: "2", name: "Salto al cajón", sets: 4, reps: "5", rest: 90 },
  { id: "3", name: "Sprint 20 m", sets: 6, reps: "1", rest: 60 },
  { id: "4", name: "Plancha frontal", sets: 3, reps: "40 s", rest: 45 },
];

const starter: Session = {
  title: "Fuerza + Velocidad",
  objective: "Potencia de tren inferior y aceleración",
  duration: 75,
  load: "Alta",
  exercises: defaultExercises,
};

function useLocalSession() {
  const [session, setSession] = useState<Session>(starter);
  useEffect(() => {
    const raw = localStorage.getItem("g10-demo-session");
    if (raw) {
      try { setSession(JSON.parse(raw)); } catch {}
    }
  }, []);
  const save = (next: Session) => {
    setSession(next);
    localStorage.setItem("g10-demo-session", JSON.stringify(next));
  };
  return { session, save };
}

export function G10App() {
  const [role, setRole] = useState<"coach" | "athlete">("coach");
  const { session, save } = useLocalSession();
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <main className="app-shell">
      <div className="phone">
        <header className="topbar">
          <div className="brand">
            <div className="logo">G10</div>
            <div>
              <div style={{fontWeight:800,fontSize:12}}>Alto Rendimiento</div>
              <div className="brand-sub">Modo demo</div>
            </div>
          </div>
          <div className="role-switch" aria-label="Cambiar rol">
            <button className={role==="coach"?"active":""} onClick={()=>setRole("coach")}>Profe</button>
            <button className={role==="athlete"?"active":""} onClick={()=>setRole("athlete")}>Alumno</button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {role === "coach" ? (
            <motion.div key="coach" initial={{opacity:0,x:-18}} animate={{opacity:1,x:0}} exit={{opacity:0,x:18}} transition={{duration:.22}}>
              <CoachView session={session} onSave={save} onDone={()=>showToast("Sesión asignada. Ya aparece en la vista del alumno.")} />
            </motion.div>
          ) : (
            <motion.div key="athlete" initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-18}} transition={{duration:.22}}>
              <AthleteView session={session} onDone={()=>showToast("Entrenamiento completado. Feedback registrado en modo demo.")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav role={role} />
      <AnimatePresence>{toast && <motion.div className="toast" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}>{toast}</motion.div>}</AnimatePresence>
    </main>
  );
}

function CoachView({session,onSave,onDone}:{session:Session;onSave:(s:Session)=>void;onDone:()=>void}) {
  const [draft,setDraft] = useState<Session>(session);
  const [newName,setNewName] = useState("");
  useEffect(()=>setDraft(session),[session]);

  const updateExercise = (id:string, patch:Partial<Exercise>) =>
    setDraft(s=>({...s,exercises:s.exercises.map(e=>e.id===id?{...e,...patch}:e)}));

  const addExercise = () => {
    const name = newName.trim();
    if(!name) return;
    setDraft(s=>({...s,exercises:[...s.exercises,{id:crypto.randomUUID(),name,sets:3,reps:"8",rest:60}]}));
    setNewName("");
  };

  return <>
    <div className="eyebrow">Planificación semanal</div>
    <h1 className="hero-title">Armá la sesión.<br/>El atleta la recibe.</h1>
    <p className="hero-copy">Primer prototipo funcional de G10. Los cambios quedan guardados en este dispositivo para probar el flujo completo.</p>

    <section className="section">
      <div className="section-head"><h2>Deportista</h2><span className="pill"><UserRound size={13}/> Demo</span></div>
      <div className="card">
        <label className="label">Asignar a</label>
        <select className="select" defaultValue="demo"><option value="demo">Deportista Demo</option></select>
      </div>
    </section>

    <section className="section">
      <div className="section-head"><h2>Crear sesión</h2><span className="muted">Hoy</span></div>
      <div className="card">
        <label className="label">Nombre de la sesión</label>
        <input className="input" value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/>
        <div style={{height:10}}/>
        <label className="label">Objetivo</label>
        <textarea className="textarea" value={draft.objective} onChange={e=>setDraft({...draft,objective:e.target.value})}/>
        <div className="grid2" style={{marginTop:10}}>
          <div><label className="label">Duración</label><input className="input" type="number" value={draft.duration} onChange={e=>setDraft({...draft,duration:Number(e.target.value)})}/></div>
          <div><label className="label">Carga</label><select className="select" value={draft.load} onChange={e=>setDraft({...draft,load:e.target.value as Session["load"]})}><option>Baja</option><option>Media</option><option>Alta</option></select></div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-head"><h2>Ejercicios</h2><span className="muted">{draft.exercises.length} cargados</span></div>
      <div className="card">
        {draft.exercises.map((e,i)=><motion.div layout key={e.id} className="exercise-row">
          <div className="exercise-num">{i+1}</div>
          <div>
            <input className="input" value={e.name} onChange={ev=>updateExercise(e.id,{name:ev.target.value})} style={{padding:"9px 10px",fontSize:13}}/>
            <div className="grid2" style={{marginTop:7}}>
              <input className="input" type="number" value={e.sets} onChange={ev=>updateExercise(e.id,{sets:Number(ev.target.value)})} aria-label="Series" style={{padding:"8px 9px",fontSize:12}}/>
              <input className="input" value={e.reps} onChange={ev=>updateExercise(e.id,{reps:ev.target.value})} aria-label="Repeticiones" style={{padding:"8px 9px",fontSize:12}}/>
            </div>
            <div className="exercise-meta">{e.sets} series · {e.reps} reps · {e.rest}s pausa</div>
          </div>
          <button className="icon-btn" onClick={()=>setDraft(s=>({...s,exercises:s.exercises.filter(x=>x.id!==e.id)}))} aria-label="Eliminar"><Trash2 size={15}/></button>
        </motion.div>)}
        <div className="divider"/>
        <div style={{display:"flex",gap:8}}>
          <input className="input" placeholder="Nuevo ejercicio" value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addExercise()}}/>
          <button className="icon-btn" onClick={addExercise} aria-label="Agregar" style={{padding:"0 14px",color:"#b7ff45"}}><Plus/></button>
        </div>
      </div>
    </section>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1.25fr",gap:10,marginTop:16}}>
      <button className="btn btn-secondary" onClick={()=>setDraft(session)}>Restablecer</button>
      <button className="btn btn-primary" onClick={()=>{onSave(draft);onDone()}}>Asignar sesión</button>
    </div>
  </>;
}

function AthleteView({session,onDone}:{session:Session;onDone:()=>void}) {
  const [open,setOpen] = useState(false);
  const [done,setDone] = useState<string[]>([]);
  const [rpe,setRpe] = useState(7);
  const pct = useMemo(()=>session.exercises.length ? Math.round(done.length/session.exercises.length*100) : 0,[done,session.exercises.length]);

  if(open) return <>
    <div className="eyebrow">Entrenamiento de hoy</div>
    <h1 className="hero-title">{session.title}</h1>
    <div style={{margin:"8px 0 16px"}}><span className="mini-chip">{session.duration} min</span><span className="mini-chip">{session.exercises.length} ejercicios</span><span className="mini-chip">Carga {session.load}</span></div>
    <div className="card">
      <div className="section-head"><h2>Progreso</h2><strong style={{color:"#b7ff45"}}>{pct}%</strong></div>
      <div className="progress"><div style={{width:pct+"%"}}/></div>
      <div className="divider"/>
      {session.exercises.map((e,i)=>{
        const checked=done.includes(e.id);
        return <motion.button layout key={e.id} onClick={()=>setDone(d=>checked?d.filter(x=>x!==e.id):[...d,e.id])} className="check-row" style={{width:"100%",background:"none",borderLeft:0,borderRight:0,borderTop:0,color:"inherit",textAlign:"left",cursor:"pointer"}}>
          <div className={"check "+(checked?"done":"")}>{checked&&<Check size={16}/>}</div>
          <div><div className="exercise-name">{i+1}. {e.name}</div><div className="exercise-meta">{e.sets} series · {e.reps} reps · pausa {e.rest}s</div></div>
        </motion.button>
      })}
    </div>
    <section className="section">
      <div className="section-head"><h2>Esfuerzo percibido</h2><span className="pill">RPE {rpe}/10</span></div>
      <div className="card">
        <input type="range" min="1" max="10" value={rpe} onChange={e=>setRpe(Number(e.target.value))} style={{width:"100%"}}/>
      </div>
    </section>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr",gap:10,marginTop:16}}>
      <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Volver</button>
      <button className="btn btn-primary" disabled={done.length!==session.exercises.length} style={{opacity:done.length===session.exercises.length?1:.45}} onClick={()=>{onDone();setOpen(false)}}>Completar sesión</button>
    </div>
  </>;

  return <>
    <div className="eyebrow">Domingo · G10</div>
    <h1 className="hero-title">Hola, Deportista.</h1>
    <p className="hero-copy">Tu equipo ya dejó preparado el trabajo de hoy.</p>

    <section className="section">
      <div className="card today-card">
        <div className="pill"><Dumbbell size={13}/> Entrenamiento de hoy</div>
        <h2 style={{fontSize:24,margin:"14px 0 5px",letterSpacing:"-.6px"}}>{session.title}</h2>
        <p className="hero-copy">{session.objective}</p>
        <div className="grid2" style={{marginTop:18}}>
          <div><div className="big-stat">{session.duration}</div><div className="stat-label">minutos</div></div>
          <div><div className="big-stat">{session.exercises.length}</div><div className="stat-label">ejercicios</div></div>
        </div>
        <button className="btn btn-primary" style={{marginTop:18}} onClick={()=>setOpen(true)}>Ver entrenamiento</button>
      </div>
    </section>

    <section className="section">
      <div className="section-head"><h2>Bienestar</h2><span className="muted">Check-in diario</span></div>
      <div className="wellness">
        <div className="well"><strong>7h30</strong><span>Sueño</span></div>
        <div className="well"><strong>3/10</strong><span>Fatiga</span></div>
        <div className="well"><strong>2/10</strong><span>Dolor</span></div>
        <div className="well"><strong>3/10</strong><span>Estrés</span></div>
      </div>
    </section>

    <section className="section">
      <div className="section-head"><h2>Semana</h2><span className="muted">Objetivo 4 sesiones</span></div>
      <div className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"end"}}><div><div className="big-stat">3/4</div><div className="stat-label">sesiones completadas</div></div><Trophy color="#b7ff45" size={30}/></div>
        <div className="progress"><div style={{width:"75%"}}/></div>
      </div>
    </section>
  </>;
}

function BottomNav({role}:{role:"coach"|"athlete"}) {
  const items = role==="coach"
    ? [[Home,"Inicio"],[UsersRound,"Deportistas"],[CalendarDays,"Planificar"],[Activity,"Carga"]]
    : [[Home,"Inicio"],[Dumbbell,"Entrenar"],[Activity,"Progreso"],[UserRound,"Perfil"]];
  return <nav className="sticky-nav">{items.map(([Icon,label],i)=>{
    const C = Icon as typeof Home;
    return <div className={"nav-item "+(i===0?"active":"")} key={label as string}><C size={18}/><span>{label as string}</span></div>
  })}</nav>
}
