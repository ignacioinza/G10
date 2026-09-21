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

function HeroCar() {
  return (
    <svg className="heroCarSvg" viewBox="0 0 1100 560" role="img" aria-label="Auto Pampa Racing Team">
      <defs>
        <linearGradient id="bodyBlue" x1="0" x2="1">
          <stop offset="0" stopColor="#031827"/>
          <stop offset=".35" stopColor="#09aee8"/>
          <stop offset=".7" stopColor="#04629a"/>
          <stop offset="1" stopColor="#02070b"/>
        </linearGradient>
        <linearGradient id="gold" x1="0" x2="1">
          <stop offset="0" stopColor="#f7d16b"/>
          <stop offset=".5" stopColor="#e0a91d"/>
          <stop offset="1" stopColor="#8b5b00"/>
        </linearGradient>
        <radialGradient id="headlight">
          <stop offset="0" stopColor="#ffffff"/>
          <stop offset=".35" stopColor="#aeefff"/>
          <stop offset="1" stopColor="#0bbff0" stopOpacity="0"/>
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="14"/>
        </filter>
      </defs>
      <ellipse cx="575" cy="485" rx="420" ry="48" fill="#000" opacity=".72"/>
      <ellipse cx="790" cy="402" rx="180" ry="90" fill="#0ab8ea" opacity=".12" filter="url(#glow)"/>
      <g transform="translate(30 0)">
        <circle cx="280" cy="430" r="95" fill="#020304"/>
        <circle cx="280" cy="430" r="63" fill="#15232b"/>
        <circle cx="280" cy="430" r="31" fill="#d9a626"/>
        <circle cx="850" cy="430" r="95" fill="#020304"/>
        <circle cx="850" cy="430" r="63" fill="#15232b"/>
        <circle cx="850" cy="430" r="31" fill="#d9a626"/>
        <path d="M145 408 C170 310 255 243 389 221 L680 198 C792 190 865 227 926 294 L987 354 C1012 380 993 419 952 425 L854 438 C828 359 779 328 702 331 L404 335 C338 340 305 373 286 438 L188 434 C153 431 131 425 145 408Z" fill="url(#bodyBlue)" stroke="#36c7f1" strokeWidth="4"/>
        <path d="M388 222 L471 125 L687 123 L777 203 Z" fill="#07121c" stroke="#2b647c" strokeWidth="4"/>
        <path d="M486 145 L669 142 L733 202 L425 215Z" fill="#03070b"/>
        <path d="M170 370 L292 350 L384 334 L761 331 L930 353 L969 386 L877 400 L724 378 L368 378 L228 410 L153 409Z" fill="#0b1b25" opacity=".88"/>
        <path d="M182 326 L338 257 L392 223 L514 209 L432 329 L286 360Z" fill="#ffffff" opacity=".86"/>
        <path d="M432 329 L515 210 L632 204 L548 334Z" fill="#0fb5e8"/>
        <path d="M548 334 L632 204 L742 208 L683 335Z" fill="url(#gold)"/>
        <path d="M683 335 L742 208 L867 252 L820 344Z" fill="#f3f6f8" opacity=".88"/>
        <path d="M875 276 L970 348 L932 359 L836 335Z" fill="#0ab8ea"/>
        <rect x="412" y="367" width="148" height="72" rx="8" fill="#071018" stroke="#e7edf1" strokeWidth="3"/>
        <text x="486" y="416" textAnchor="middle" fill="#fff" fontSize="56" fontWeight="900" fontFamily="Arial">77</text>
        <text x="525" y="302" fill="#ffffff" fontSize="68" fontWeight="900" fontStyle="italic" fontFamily="Arial">PAMPA</text>
        <g transform="translate(735 290)">
          <circle r="58" fill="url(#gold)"/>
          {Array.from({length:16}).map((_,i)=><rect key={i} x="-4" y="-88" width="8" height="38" rx="4" fill="#f0b929" transform={`rotate(${i*22.5})`}/>)}
        </g>
        <text x="493" y="170" fill="#dfe7eb" fontSize="30" fontWeight="800" letterSpacing="4" fontFamily="Arial">PAMPA</text>
        <text x="689" y="171" fill="#e2ae27" fontSize="28" fontWeight="900" fontFamily="Arial">#77</text>
        <ellipse cx="906" cy="331" rx="88" ry="50" fill="url(#headlight)" opacity=".88"/>
        <ellipse cx="217" cy="340" rx="45" ry="24" fill="#ffffff" opacity=".55"/>
        <path d="M210 225 L145 183 L102 188 L132 223Z" fill="#08141c" stroke="#14bde9" strokeWidth="4"/>
        <path d="M824 199 L982 182 L1005 197 L848 218Z" fill="#071018" stroke="#13bce9" strokeWidth="4"/>
      </g>
    </svg>
  );
}

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
    <main className={active === "equipo" ? "homeMode" : ""}>
      <header className="topbar">
        <button className="brand" onClick={() => setActive("equipo")} aria-label="Pampa Racing Team">
          <span className="sunLogo" aria-hidden="true">☀</span>
          <span className="brandBlock"><b>PAMPA</b><small>RACING TEAM</small></span>
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
          <section className="approvedIndex">
            <img src="/pampa-index.webp" alt="Pampa Racing Team — inicio" />
            <button className="hotspot hsCompetencias" aria-label="Ver competencias" onClick={() => setActive("competencias")} />
            <button className="hotspot hsPilotos" aria-label="Ver pilotos" onClick={() => setActive("pilotos")} />
          </section>

          <section className="homeCards">
            <article className="featureCard nextFeature">
              <div className="featureTop"><span>PRÓXIMA FECHA</span><b>01</b></div>
              <div className="dateBig">27 <small>SEP</small></div>
              <h3>DAYTONA</h3>
              <p>NORTH AMERICAN RACING LEAGUE · GT3</p>
              <div className="featurePilots"><span>EA</span><span>AD</span><span>LL</span><b>3 PILOTOS PAMPA</b></div>
              <button onClick={() => setActive("competencias")}>VER FECHA E INSCRIBIRME →</button>
            </article>

            <article className="featureCard teamFeature">
              <div className="featureTop"><span>ESTADO DEL EQUIPO</span><b>02</b></div>
              <div className="metric"><strong>{pilots.length}</strong><span>PILOTOS ACTIVOS</span></div>
              <div className="metric"><strong>3</strong><span>CAMPEONATOS EN CURSO</span></div>
              <div className="metric"><strong>{totalPodiums}</strong><span>PODIOS ACUMULADOS</span></div>
              <div className="progressBrand"><i style={{width:"72%"}}/></div>
              <small>OBJETIVO TEMPORADA 2026 · 72%</small>
            </article>

            <article className="featureCard pilotFeature">
              <div className="featureTop"><span>PILOTO DESTACADO</span><b>03</b></div>
              <div className="pilotNumber">#77</div>
              <div className="pilotSun">☀</div>
              <h3>EMILIANO<br/><span>ALMIRÓN</span></h3>
              <p>GT / GR86 · {pilots[0].irating} iRating · {pilots[0].podiums} podios</p>
              <button onClick={() => {setSelectedPilot(pilots[0]); setActive("pilotos")}}>VER PERFIL →</button>
            </article>
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
