import type { G10Exercise, G10Session } from "@/lib/use-g10-workspace";

export type PlanBlock = {
  id: string;
  title: string;
  content: string;
  duration: number;
  category: "Preparación" | "Principal" | "Complementario" | "Desplazamientos";
};

export type PlanDay = {
  id: string;
  label: string;
  focus: string;
  load: "Baja" | "Media" | "Alta";
  blocks: PlanBlock[];
};

export type PlanWeek = {
  id: string;
  number: number;
  title: string;
  objective: string;
  color: string;
  days: PlanDay[];
};

const images = [
  "/images/exercise-1.jpg",
  "/images/exercise-2.jpg",
  "/images/exercise-3.jpg",
  "/images/exercise-4.jpg",
  "/images/exercise-5.jpg",
  "/images/exercise-6.jpg",
];

const makeDay = (
  week: number,
  day: number,
  focus: string,
  main: string,
  movement: string,
  load: PlanDay["load"],
): PlanDay => ({
  id: `w${week}d${day}`,
  label: `Día ${day}`,
  focus,
  load,
  blocks: [
    { id: `w${week}d${day}b1`, title: "Preventivos y movilidad", content: day % 2 ? "Movilidad de hombros y caderas · estabilidad articular" : "Movilidad de columna · estabilidad de rotadores", duration: 6, category: "Preparación" },
    { id: `w${week}d${day}b2`, title: "Zona media", content: day === 3 ? "Rotacionales, antirotacionales y espinales" : "Isometrías, anti extensión y preparación del movimiento", duration: 5, category: "Preparación" },
    { id: `w${week}d${day}b3`, title: "Bloque principal", content: main, duration: 15, category: "Principal" },
    { id: `w${week}d${day}b4`, title: "Bloque complementario", content: day % 2 ? "Cintura escapular, cadera y trabajo unilateral" : "Trabajo total body y estabilizadores", duration: 10, category: "Complementario" },
    { id: `w${week}d${day}b5`, title: "Desplazamientos", content: movement, duration: day === 5 ? 10 : 15, category: "Desplazamientos" },
  ],
});

export const initialMesocycle: PlanWeek[] = [
  {
    id: "week-1", number: 1, title: "Fuerza resistencia", objective: "Sostener calidad de movimiento y tolerancia al esfuerzo", color: "#72d6ff",
    days: [
      makeDay(1, 1, "Tren inferior unilateral", "Empujes unipodales + desplazamientos a velocidad media", "Apoyos y cambios de dirección", "Media"),
      makeDay(1, 2, "Tren superior", "Tracciones a un brazo + apoyos y lanzamientos", "Fraccionado de intensidad media", "Media"),
      makeDay(1, 3, "Cadena posterior", "Tracciones del tren inferior + aceleraciones y desaceleraciones", "Velocidad lineal de 10 a 30 metros", "Media"),
      makeDay(1, 4, "Empujes y agilidad", "Empujes del tren superior + trabajo de agilidad", "Cambios de ritmo de 50 a 200 metros", "Media"),
      makeDay(1, 5, "Integración total", "Ejercicio poliarticular total body + trabajo piramidal", "Coordinación general y específica", "Media"),
    ],
  },
  {
    id: "week-2", number: 2, title: "Fuerza submáxima", objective: "Desarrollar fuerza isométrica y transferencia explosiva", color: "#9d8cff",
    days: [
      makeDay(2, 1, "Empuje inferior", "Empujes isométricos + derivados de la halterofilia", "Progresiones de 30 a 100 metros", "Alta"),
      makeDay(2, 2, "Tracción superior", "Tracciones isométricas y rápidas + halterofilia", "Coordinación específica de alta intensidad", "Alta"),
      makeDay(2, 3, "Tracción inferior", "Tracciones isométricas y rápidas a un brazo", "Aeróbico de baja intensidad", "Media"),
      makeDay(2, 4, "Empuje superior", "Empujes isométricos y rápidos + saltabilidad", "Velocidad de reacción general", "Alta"),
      makeDay(2, 5, "Contraste global", "Empujes inferiores y superiores + halterofilia", "Coordinación específica de intensidad media", "Alta"),
    ],
  },
  {
    id: "week-3", number: 3, title: "Fuerza potencia", objective: "Convertir fuerza alta en acciones rápidas específicas", color: "#57ee98",
    days: [
      makeDay(3, 1, "Potencia inferior", "Empujes con cargas altas + saltabilidad vertical", "Progresiones con pausas completas", "Alta"),
      makeDay(3, 2, "Potencia superior", "Tracciones con cargas altas + halterofilia", "Coordinación específica de alta intensidad", "Alta"),
      makeDay(3, 3, "Cadena posterior", "Tracciones con cargas altas + saltabilidad horizontal", "Circuito aeróbico de baja intensidad", "Media"),
      makeDay(3, 4, "Potencia de empuje", "Empujes con cargas altas + halterofilia a un brazo", "Velocidad de reacción y partidas", "Alta"),
      makeDay(3, 5, "Transferencia", "Empujes inferiores y superiores + lanzamientos", "Coordinación multidireccional", "Alta"),
    ],
  },
  {
    id: "week-4", number: 4, title: "Fuerza explosiva", objective: "Maximizar velocidad, reacción y gestos específicos", color: "#ffb45d",
    days: [
      makeDay(4, 1, "Explosividad inferior", "Empujes ligeros + saltabilidad vertical", "Gestos específicos y sprints cortos", "Alta"),
      makeDay(4, 2, "Explosividad superior", "Tracciones explosivas + halterofilia rotacional", "Cambios de dirección multidireccionales", "Alta"),
      makeDay(4, 3, "Explosividad posterior", "Tracciones ligeras + saltabilidad horizontal", "Intermitente específico en bloques cortos", "Alta"),
      makeDay(4, 4, "Empuje reactivo", "Empujes explosivos + halterofilia rotacional", "Velocidad específica en pista", "Alta"),
      makeDay(4, 5, "Integración específica", "Empujes y saltabilidad multidireccional", "Juegos de reacción hasta 10 metros", "Media"),
    ],
  },
];

export const exerciseLibrary: G10Exercise[] = [
  { id: "lib-1", name: "Sentadilla trasera", sets: 4, reps: "6", rest: 120, detail: "Fuerza de tren inferior · 70% 1RM", image: images[0] },
  { id: "lib-2", name: "Salto al cajón", sets: 4, reps: "5", rest: 90, detail: "Pliometría vertical · altura ajustable", image: images[1] },
  { id: "lib-3", name: "Sprint 20 m", sets: 6, reps: "1", rest: 60, detail: "Aceleración · pausa completa", image: images[2] },
  { id: "lib-4", name: "Zancada búlgara", sets: 3, reps: "8 por pierna", rest: 90, detail: "Fuerza unilateral · mancuernas", image: images[3] },
  { id: "lib-5", name: "Plancha frontal", sets: 3, reps: "45 segundos", rest: 45, detail: "Zona media · anti extensión", image: images[4] },
  { id: "lib-6", name: "Movilidad integrada", sets: 1, reps: "10 min", rest: 0, detail: "Movilidad y vuelta a la calma", image: images[5] },
];

export function dayToSession(day: PlanDay): G10Session {
  return {
    title: `${day.focus} · ${day.label}`,
    objective: day.blocks.map((block) => block.title).join(" · "),
    duration: day.blocks.reduce((total, block) => total + block.duration, 0),
    load: day.load,
    exercises: day.blocks.map((block, index) => ({
      id: crypto.randomUUID(),
      name: block.content,
      sets: block.category === "Principal" ? 4 : 3,
      reps: block.category === "Desplazamientos" ? `${block.duration} min` : "6-10",
      rest: block.category === "Principal" ? 120 : 60,
      detail: `${block.title} · ${block.duration} min`,
      image: images[index % images.length],
    })),
  };
}
