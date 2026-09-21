"use client";

import { useMemo, useState } from "react";

type Pilot = {
  id: string;
  name: string;
  number: string;
  country: string;
  specialty: string;
  irating: string;
  wins: number;
  podiums: number;
  points: number;
};

type Championship = {
  id: string;
  name: string;
  category: string;
  car: string;
  organizer: string;
  nextRound: string;
  track: string;
  status: "Abierto" | "En curso" | "Finalizado";
  progress: number;
  standings: { pilot: string; position: number; points: number }[];
};

const pilots: Pilot[] = [
  { id: "emiliano-almiron", name: "Emiliano Almirón", number: "77", country: "ARG", specialty: "GT / GR86", irating: "5.8K", wins: 9, podiums: 21, points: 418 },
  { id: "ariel-maximiliano", name: "Ariel Maximiliano", number: "29", country: "ARG", specialty: "Turismo / GT", irating: "4.9K", wins: 6, podiums: 17, points: 356 },
  { id: "agustin-domingo", name: "Agustín Domingo", number: "64", country: "ARG", specialty: "Endurance", irating: "5.2K", wins: 4, podiums: 14, points: 329 },
  { id: "lautaro-lioni", name: "Lautaro Lioni", number: "12", country: "ARG", specialty: "Formula / GT", irating: "4.6K", wins: 3, podiums: 11, points: 288 },
  { id: "nahuel-mastrosimone", name: "Nahuel Mastrosimone", number: "86", country: "ARG", specialty: "GT", irating: "4.3K", wins: 2, podiums: 9, points: 252 },
];

const championships: Championship[] = [
  {
    id: "narl-gt3",
    name: "North American Racing League",
    category: "GT3",
    car: "GT3",
    organizer: "NARL",
    nextRound: "27 SEP · 21:00",
    track: "Daytona",
    status: "Abierto",
    progress: 58,
    standings: [
      { pilot: "Emiliano Almirón", position: 2, points: 188 },
      { pilot: "Agustín Domingo", position: 5, points: 151 },
      { pilot: "Lautaro Lioni", position: 11, points: 109 },
    ],
  },
  {
    id: "gr86-series",
    name: "GR86 Argentina Series",
    category: "GR86",
    car: "Toyota GR86",
    organizer: "Liga Serruchos",
    nextRound: "01 OCT · 22:00",
    track: "Road Atlanta",
    status: "En curso",
    progress: 72,
    standings: [
      { pilot: "Ariel Maximiliano", position: 1, points: 244 },
      { pilot: "Emiliano Almirón", position: 4, points: 191 },
    ],
  },
  {
    id: "global-endurance",
    name: "Global Endurance Championship",
    category: "Endurance",
    car: "GT3 / LMP",
    organizer: "Global Series",
    nextRound: "11 OCT · 18:00",
    track: "Sebring",
    status: "Abierto",
    progress: 34,
    standings: [
      { pilot: "Agustín Domingo", position: 3, points: 133 },
      { pilot: "Nahuel Mastrosimone", position: 10, points: 88 },
    ],
  },
];

const initialRegistrations: Record<string, string[]> = {
  "narl-gt3": ["Emiliano Almirón", "Agustín Domingo", "Lautaro Lioni"],
  "gr86-series": ["Ariel Maximiliano", "Emiliano Almirón"],
  "global-endurance": ["Agustín Domingo"],
};

export default function PampaSite() {
  const [active, setActive] = useState<"equipo" | "competencias" | "pilotos">("equipo");
  const [selectedPilot, setSelectedPilot] = useState<Pilot>(pilots[0]);
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [myPilot, setMyPilot] = useState("Emiliano Almirón");

  const totalPodiums = useMemo(() => pilots.reduce((sum, pilot) => sum + pilot.podiums, 0), []);

  const toggleRegistration = (championshipId: string) => {
    setRegistrations((current) => {
      const signed = current[championshipId] ?? [];
      const next = signed.includes(myPilot)
        ? signed.filter((name) => name !== myPilot)
        : [...signed, myPilot];
      return { ...current, [championshipId]: next };
    });
  };

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => setActive("equipo")} aria-label="Pampa Racing Team">
          <span className="sunmark">☀</span>
          <span className="brandword">PAMPA</span>
          <small>RACING TEAM</small>
        </button>
        <nav>
          <button className={active === "equipo" ? "active" : ""} onClick={() => setActive("equipo")}>EQUIPO</button>
          <button className={active === "competencias" ? "active" : ""} onClick={() => setActive("competencias")}>COMPETENCIAS</button>
          <button className={active === "pilotos" ? "active" : ""} onClick={() => setActive("pilotos")}>PILOTOS</button>
        </nav>
        <div className="season">TEMPORADA <strong>2026</strong></div>
      </header>

      {active === "equipo" && (
        <>
          <section className="hero">
            <div className="heroGlow" />
            <div className="heroCopy">
              <p className="eyebrow">SIMRACING ARGENTINO · DESDE 2024</p>
              <h1>MISMAS RAÍCES.<br/><span>MAYORES DESAFÍOS.</span></h1>
              <p className="lead">Competimos como equipo. Entrenamos como profesionales. Crecemos como una familia.</p>
              <div className="heroActions">
                <button className="primary" onClick={() => setActive("competencias")}>VER COMPETENCIAS</button>
                <button className="ghost" onClick={() => setActive("pilotos")}>CONOCER PILOTOS</button>
              </div>
            </div>
            <div className="carStage">
              <div className="car">
                <div className="windshield">PAMPA <b>#77</b></div>
                <div className="hoodSun">☀</div>
                <span className="carName">PAMPA</span>
              </div>
            </div>
          </section>

          <section className="stats">
            <article><strong>{pilots.length}</strong><span>PILOTOS ACTIVOS</span></article>
            <article><strong>3</strong><span>CAMPEONATOS EN CURSO</span></article>
            <article><strong>{totalPodiums}</strong><span>PODIOS DEL EQUIPO</span></article>
            <article><strong>5</strong><span>SOCIOS ESTRATÉGICOS</span></article>
          </section>

          <section className="about section">
            <div>
              <p className="eyebrow">INSTITUCIONAL</p>
              <h2>Más que velocidad.</h2>
            </div>
            <div className="aboutText">
              <p>Pampa Racing Team es una estructura argentina de simracing enfocada en competencia, desarrollo de pilotos y trabajo colectivo. El equipo participa en campeonatos de turismo, GT, fórmula y endurance.</p>
              <p>La identidad combina raíces argentinas con una metodología competitiva basada en preparación, telemetría, simulación, estrategia y colaboración.</p>
            </div>
          </section>

          <section className="sponsors section">
            <p className="eyebrow">PARTNERS</p>
            <div className="sponsorRow">
              <span>BIFERNO</span><span>MISIONES MADERAS</span><span>GM HUNGASKI</span><span>CROSSFIT SOMO2</span><span>JRM MOTORSPORT</span>
            </div>
          </section>
        </>
      )}

      {active === "competencias" && (
        <section className="section competitions">
          <div className="sectionHeader">
            <div><p className="eyebrow">CENTRO DE COMPETENCIA</p><h1>Calendario del equipo</h1></div>
            <label className="pilotSelect">VER COMO
              <select value={myPilot} onChange={(e) => setMyPilot(e.target.value)}>
                {pilots.map((pilot) => <option key={pilot.id}>{pilot.name}</option>)}
              </select>
            </label>
          </div>

          <div className="competitionGrid">
            {championships.map((championship) => {
              const signed = registrations[championship.id] ?? [];
              const isSigned = signed.includes(myPilot);
              return (
                <article className="champCard" key={championship.id}>
                  <div className="champTop">
                    <span className={"status " + championship.status.toLowerCase().replace(" ", "-")}>{championship.status}</span>
                    <span>{championship.category}</span>
                  </div>
                  <h3>{championship.name}</h3>
                  <p className="track">{championship.track} <span>·</span> {championship.nextRound}</p>
                  <div className="progress"><i style={{width: championship.progress + "%"}} /></div>
                  <div className="cardColumns">
                    <div>
                      <small>PAMPA INSCRIPTOS</small>
                      <div className="avatars">
                        {signed.map((name) => <span key={name} title={name}>{name.split(" ").map(x=>x[0]).join("").slice(0,2)}</span>)}
                      </div>
                      <p className="signedNames">{signed.join(" · ") || "Todavía sin inscriptos"}</p>
                    </div>
                    <div>
                      <small>MEJOR POSICIÓN PAMPA</small>
                      <strong className="bestPos">P{Math.min(...championship.standings.map((s) => s.position))}</strong>
                    </div>
                  </div>
                  <div className="standing">
                    {championship.standings.map((row) => (
                      <div key={row.pilot}><b>P{row.position}</b><span>{row.pilot}</span><strong>{row.points} pts</strong></div>
                    ))}
                  </div>
                  <button className={isSigned ? "registered" : "primary full"} onClick={() => toggleRegistration(championship.id)}>
                    {isSigned ? "✓ INSCRIPTO · CANCELAR" : "ANOTARME EN ESTE TORNEO"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {active === "pilotos" && (
        <section className="section pilots">
          <div className="sectionHeader"><div><p className="eyebrow">ROSTER 2026</p><h1>Nuestros pilotos</h1></div><p className="muted">Datos de muestra para validar la experiencia.</p></div>
          <div className="pilotLayout">
            <div className="pilotList">
              {pilots.map((pilot) => (
                <button key={pilot.id} className={selectedPilot.id === pilot.id ? "pilotItem selected" : "pilotItem"} onClick={() => setSelectedPilot(pilot)}>
                  <span className="number">#{pilot.number}</span>
                  <span><b>{pilot.name}</b><small>{pilot.specialty}</small></span>
                  <em>{pilot.country}</em>
                </button>
              ))}
            </div>
            <article className="pilotProfile">
              <div className="profileVisual">
                <span className="profileNumber">{selectedPilot.number}</span>
                <div className="helmet">☀</div>
              </div>
              <div className="profileContent">
                <p className="eyebrow">PILOTO PAMPA · {selectedPilot.country}</p>
                <h2>{selectedPilot.name}</h2>
                <p className="role">{selectedPilot.specialty}</p>
                <div className="profileStats">
                  <div><small>iRATING</small><strong>{selectedPilot.irating}</strong></div>
                  <div><small>VICTORIAS</small><strong>{selectedPilot.wins}</strong></div>
                  <div><small>PODIOS</small><strong>{selectedPilot.podiums}</strong></div>
                  <div><small>PTS 2026</small><strong>{selectedPilot.points}</strong></div>
                </div>
                <h4>CAMPEONATOS ACTIVOS</h4>
                {championships.filter(c => (registrations[c.id] ?? []).includes(selectedPilot.name)).map((c) => (
                  <div className="profileChamp" key={c.id}><span>{c.name}</span><b>{c.standings.find(s=>s.pilot===selectedPilot.name) ? "P" + c.standings.find(s=>s.pilot===selectedPilot.name)?.position : "INSCRIPTO"}</b></div>
                ))}
              </div>
            </article>
          </div>
        </section>
      )}

      <footer><span>PAMPA RACING TEAM</span><span>ARGENTINA · 2026</span><span>MÁS QUE UN EQUIPO, UNA FAMILIA.</span></footer>
    </main>
  );
}
