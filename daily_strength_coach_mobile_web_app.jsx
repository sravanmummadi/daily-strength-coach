import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Dumbbell, Filter, Info } from "lucide-react";

// --- Helpers
const titleCase = (s: string) => s.replace(/(^|\s)\w/g, (m) => m.toUpperCase());
const todayDow = () => new Date().toLocaleDateString(undefined, { weekday: "long" });

// --- Types
type Exercise = {
  id: string;
  name: string;
  equipment: string[]; // minimal list of required gear
  primary: string; // primary muscle group
  cues: string[]; // safety & form cues
  media?: { type: "img" | "gif" | "mp4"; src: string; alt?: string }[]; // 0–2 items
};

type DayPlan = {
  day: string; // Monday ... Sunday
  focus: string;
  exercises: Exercise[];
};

// --- Static program (5+ exercises per day, beginner-friendly hypertrophy)
// Media sources are optional; if they fail, the card still renders fine.
const PROGRAM: DayPlan[] = [
  {
    day: "Monday",
    focus: "Upper Push (Chest/Shoulders/Triceps)",
    exercises: [
      {
        id: "bench_press",
        name: "Dumbbell Bench Press",
        equipment: ["dumbbells", "bench"],
        primary: "Chest",
        cues: [
          "Wrists stacked over elbows; slight arch, no bounce",
          "2–3 sec lower, 1 sec up; stop 1–2 reps before failure",
        ],
        media: [
          { type: "img", src: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Dumbbell-bench-press-2.png", alt: "DB Bench Press" },
          { type: "gif", src: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Dumbbell_Bench_Press.gif", alt: "DB Bench Press GIF" },
        ],
      },
      {
        id: "incline_pushup",
        name: "Incline Push-Up",
        equipment: ["bench"],
        primary: "Chest",
        cues: ["Body straight; hands under shoulders", "Lower under control; avoid elbow flare"],
        media: [
          { type: "img", src: "https://upload.wikimedia.org/wikipedia/commons/4/43/Pushups_-_Incline.jpg", alt: "Incline Push-Up" },
        ],
      },
      {
        id: "ohp",
        name: "Overhead Shoulder Press",
        equipment: ["dumbbells"],
        primary: "Shoulders",
        cues: ["Ribs down; avoid overarching lower back", "Press slightly forward then up"],
        media: [
          { type: "img", src: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Dumbbell_shoulder_press_2.png", alt: "DB OHP" },
        ],
      },
      {
        id: "lateral_raise",
        name: "Lateral Raise",
        equipment: ["dumbbells"],
        primary: "Shoulders",
        cues: ["Soft elbows; raise to just below shoulder height", "Tempo: 2 up, 3 down"],
        media: [
          { type: "gif", src: "https://upload.wikimedia.org/wikipedia/commons/2/2e/Dumbbell_Lateral_Raise.gif", alt: "Lateral Raise" },
        ],
      },
      {
        id: "tricep_press",
        name: "Overhead Triceps Extension",
        equipment: ["dumbbells"],
        primary: "Triceps",
        cues: ["Elbows narrow; avoid flaring", "Only go as deep as shoulders allow"],
        media: [
          { type: "img", src: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Triceps-Extension-2.png", alt: "Triceps Extension" },
        ],
      },
    ],
  },
  {
    day: "Tuesday",
    focus: "Lower (Quads/Hamstrings/Glutes)",
    exercises: [
      {
        id: "goblet_squat",
        name: "Goblet Squat",
        equipment: ["dumbbells"],
        primary: "Quads",
        cues: ["Heels down; knees track over toes", "Brace core; chest tall"],
        media: [
          { type: "gif", src: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Goblet_Squat.gif", alt: "Goblet Squat" },
        ],
      },
      {
        id: "rdl",
        name: "Romanian Deadlift",
        equipment: ["dumbbells"],
        primary: "Hamstrings",
        cues: ["Hinge at hips; shins vertical", "Stop at mid-shin when hamstrings loaded"],
        media: [
          { type: "img", src: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Dumbbell_romanian_deadlift.png", alt: "DB RDL" },
        ],
      },
      {
        id: "split_squat",
        name: "Rear-Foot Elevated Split Squat",
        equipment: ["bench", "dumbbells"],
        primary: "Quads/Glutes",
        cues: ["Front knee forward; torso upright", "Light hold on bench for balance if needed"],
      },
      {
        id: "glute_bridge",
        name: "Glute Bridge",
        equipment: ["none"],
        primary: "Glutes",
        cues: ["Posterior pelvic tilt; squeeze at top 1 sec", "No lower back arching"],
      },
      {
        id: "calf_raise",
        name: "Standing Calf Raise",
        equipment: ["dumbbells"],
        primary: "Calves",
        cues: ["Full range; slow lower (3 sec)", "Hold stable surface if needed"],
      },
    ],
  },
  {
    day: "Wednesday",
    focus: "Upper Pull (Back/Biceps)",
    exercises: [
      {
        id: "one_arm_row",
        name: "One-Arm Dumbbell Row",
        equipment: ["dumbbells", "bench"],
        primary: "Back",
        cues: ["Neutral spine; pull elbow to hip", "Pause 1 sec at top"],
        media: [
          { type: "img", src: "https://upload.wikimedia.org/wikipedia/commons/e/e2/One-arm-dumbbell-row-2.png", alt: "1-Arm Row" },
        ],
      },
      {
        id: "lat_pulldown_band",
        name: "Band Lat Pulldown",
        equipment: ["resistance band"],
        primary: "Lats",
        cues: ["Down and back into back pockets", "Avoid shrugging"],
      },
      {
        id: "rear_delt_fly",
        name: "Rear Delt Fly",
        equipment: ["dumbbells"],
        primary: "Rear Delts",
        cues: ["Hinge; thumbs slightly in; slow negatives"],
      },
      {
        id: "curl",
        name: "Dumbbell Curl",
        equipment: ["dumbbells"],
        primary: "Biceps",
        cues: ["Elbows pinned; no swinging", "Squeeze at top 1 sec"],
      },
      {
        id: "hammer_curl",
        name: "Hammer Curl",
        equipment: ["dumbbells"],
        primary: "Brachialis/Forearm",
        cues: ["Neutral grip; slow down-phase"],
      },
    ],
  },
  {
    day: "Thursday",
    focus: "Lower (Glutes/Hamstrings emphasis)",
    exercises: [
      {
        id: "hip_hinge_band",
        name: "Banded Hip Hinge",
        equipment: ["resistance band"],
        primary: "Posterior Chain",
        cues: ["Push hips back; keep shins vertical", "Brace core; neutral neck"],
      },
      {
        id: "stepup",
        name: "Step-Up",
        equipment: ["bench", "dumbbells"],
        primary: "Quads/Glutes",
        cues: ["Drive through whole foot; control down", "Use low height if knees ache"],
      },
      {
        id: "ham_curl_band",
        name: "Banded Hamstring Curl",
        equipment: ["resistance band"],
        primary: "Hamstrings",
        cues: ["Pin hips; squeeze 1 sec; slow return"],
      },
      {
        id: "side_plank",
        name: "Side Plank (Hip Abductors)",
        equipment: ["none"],
        primary: "Core/Glute Med",
        cues: ["Straight line; keep ribs down", "If wrist bothers, use forearm"],
      },
      {
        id: "single_leg_rdl",
        name: "Single-Leg RDL (Assisted)",
        equipment: ["dumbbells"],
        primary: "Hamstrings/Glutes",
        cues: ["Light support with free hand; square hips", "Short range if balance is hard"],
      },
    ],
  },
  {
    day: "Friday",
    focus: "Upper Push/Pull Mix",
    exercises: [
      {
        id: "incline_db_press",
        name: "Incline DB Press",
        equipment: ["dumbbells", "bench"],
        primary: "Chest/Shoulders",
        cues: ["Shoulder blades set; no bouncing", "Lower to upper chest"],
      },
      {
        id: "chest_supported_row",
        name: "Chest-Supported Row",
        equipment: ["dumbbells", "bench"],
        primary: "Back",
        cues: ["Bench ~30–45°; pull elbow to hip", "Pause at top 1 sec"],
      },
      {
        id: "face_pull_band",
        name: "Band Face Pull",
        equipment: ["resistance band"],
        primary: "Rear Delts/Upper Back",
        cues: ["Elbows high; rotate thumbs back", "No lower back arch"],
      },
      {
        id: "curl_alt",
        name: "Alternating Curl",
        equipment: ["dumbbells"],
        primary: "Biceps",
        cues: ["Slow eccentric 3 sec", "No torso swing"],
      },
      {
        id: "tricep_pushdown_band",
        name: "Band Triceps Pushdown",
        equipment: ["resistance band"],
        primary: "Triceps",
        cues: ["Elbows glued to sides; full lockout", "Control back up"],
      },
    ],
  },
  {
    day: "Saturday",
    focus: "Full Body (Short)",
    exercises: [
      {
        id: "db_clean_press",
        name: "DB Clean to Press (Light)",
        equipment: ["dumbbells"],
        primary: "Total Body",
        cues: ["Smooth; not explosive; prioritize control", "Stop if form degrades"],
      },
      {
        id: "front_foot_elev_split",
        name: "Front-Foot Elevated Split Squat",
        equipment: ["dumbbells", "plate"],
        primary: "Quads/Glutes",
        cues: ["Small elevation; knee tracks over toes", "Use bodyweight if needed"],
      },
      {
        id: "one_arm_row_2",
        name: "One-Arm Row (Light)",
        equipment: ["dumbbells", "bench"],
        primary: "Back",
        cues: ["Neutral spine; no torso twist"],
      },
      {
        id: "pushup_knees",
        name: "Push-Up (Knees or Full)",
        equipment: ["none"],
        primary: "Chest/Triceps",
        cues: ["Body line; control down; full range"],
      },
      {
        id: "plank",
        name: "Plank",
        equipment: ["none"],
        primary: "Core",
        cues: ["Glutes tight; ribs down; breathe", "Stop before shaking compromises form"],
      },
    ],
  },
  {
    day: "Sunday",
    focus: "Core + Mobility (Optional Strength)",
    exercises: [
      {
        id: "dead_bug",
        name: "Dead Bug",
        equipment: ["none"],
        primary: "Core",
        cues: ["Lower back gently pressed to floor", "Slow exhale as leg/arm extend"],
      },
      {
        id: "pallof_press_band",
        name: "Pallof Press (Band)",
        equipment: ["resistance band"],
        primary: "Anti-Rotation Core",
        cues: ["Square hips; don’t let torso rotate", "Short sets of quality reps"],
      },
      {
        id: "bird_dog",
        name: "Bird Dog",
        equipment: ["none"],
        primary: "Core/Back",
        cues: ["Reach long; keep hips level", "Pause 1 sec; slow return"],
      },
      {
        id: "hip_flexor_mob",
        name: "Half-Kneeling Hip Flexor Stretch",
        equipment: ["none"],
        primary: "Mobility",
        cues: ["Tuck pelvis; gentle stretch, no pain", "30–45 sec each side"],
      },
      {
        id: "thoracic_opener",
        name: "Thoracic Opener (Bench/Wall)",
        equipment: ["bench"],
        primary: "Mobility",
        cues: ["No pinching; breathe into ribs", "Move within comfort"],
      },
    ],
  },
];

// --- Component
export default function DailyStrengthCoach() {
  const [currentDay, setCurrentDay] = useState<string>(todayDow());
  const dayPlan = useMemo(() => PROGRAM.find((d) => d.day === currentDay) ?? PROGRAM[0], [currentDay]);

  // Build equipment universe from program
  const initialEquipment = useMemo(() => {
    const set = new Set<string>();
    PROGRAM.forEach((d) => d.exercises.forEach((e) => e.equipment.forEach((eq) => set.add(eq))));
    // normalize simple names
    return Array.from(set);
  }, []);

  const [equipment, setEquipment] = useState<string[]>(initialEquipment);
  const [active, setActive] = useState<Record<string, boolean>>(() => Object.fromEntries(initialEquipment.map((e) => [e, true])));
  const [newEq, setNewEq] = useState("");

  useEffect(() => {
    // Sync active flags if equipment list changes
    setActive((prev) => {
      const next = { ...prev } as Record<string, boolean>;
      equipment.forEach((e) => (next[e] = e in next ? next[e] : true));
      // remove flags for deleted entries
      Object.keys(next).forEach((k) => {
        if (!equipment.includes(k)) delete next[k];
      });
      return next;
    });
  }, [equipment]);

  const toggle = (eq: string) => setActive((m) => ({ ...m, [eq]: !m[eq] }));
  const remove = (eq: string) => setEquipment((arr) => arr.filter((x) => x !== eq));
  const add = () => {
    const k = newEq.trim().toLowerCase();
    if (!k) return;
    if (!equipment.includes(k)) setEquipment((arr) => [...arr, k]);
    setNewEq("");
  };

  // Filtering logic: show only exercises whose required equipment are all currently ACTIVE (user says they have them)
  const visibleExercises = dayPlan.exercises.filter((ex) =>
    ex.equipment.every((eq) => active[eq] ?? (equipment.includes(eq) ? false : true))
  );

  const dayNames = PROGRAM.map((d) => d.day);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white text-slate-900 p-4 pb-24">
      <header className="max-w-xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <Dumbbell className="w-6 h-6" />
          <h1 className="text-xl font-semibold">Daily Strength Coach</h1>
        </div>
        <p className="text-sm text-slate-600 mb-3">
          Mobile-friendly, injury-averse programming. Select your equipment; exercises update instantly.
        </p>

        {/* Day selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-1 px-1">
          {dayNames.map((d) => (
            <button
              key={d}
              onClick={() => setCurrentDay(d)}
              className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap ${
                currentDay === d ? "bg-slate-900 text-white" : "bg-white border-slate-300"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Focus */}
        <div className="mt-3 text-sm flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span className="font-medium">Today:</span>
          <span className="text-slate-700">{dayPlan.focus}</span>
        </div>
      </header>

      {/* Equipment tags */}
      <section className="max-w-xl mx-auto mt-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold">Equipment I Have</h2>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Tap a tag to toggle. Remove with the trash icon.
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {equipment.map((eq) => (
            <motion.div layout key={eq}>
              <div
                className={`group inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm ${
                  active[eq] ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-slate-100 border-slate-300 text-slate-500"
                }`}
              >
                <button onClick={() => toggle(eq)} className="focus:outline-none">
                  {titleCase(eq)}
                </button>
                <button
                  onClick={() => remove(eq)}
                  className="opacity-60 hover:opacity-100 ml-1"
                  aria-label={`remove ${eq}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add equipment */}
        <div className="mt-3 flex gap-2">
          <input
            value={newEq}
            onChange={(e) => setNewEq(e.target.value)}
            inputMode="text"
            placeholder="Add equipment (e.g., kettlebell)"
            className="flex-1 rounded-xl border px-3 py-2 text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <button
            onClick={add}
            className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm bg-slate-900 text-white"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </section>

      {/* Exercise list */}
      <main className="max-w-xl mx-auto mt-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold">Exercises ({visibleExercises.length})</h2>
          <div className="text-[11px] text-slate-500">5–6 exercises/day · 2–3 sets · 8–12 reps</div>
        </div>

        <AnimatePresence>
          {visibleExercises.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-sm text-slate-600"
            >
              No exercises match your current equipment. Add or re-enable a tag above.
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {visibleExercises.map((ex) => (
                <motion.div key={ex.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <article className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-base leading-snug">{ex.name}</h3>
                        <div className="text-[12px] text-slate-500">{ex.primary}</div>
                      </div>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {ex.equipment.map((eq) => (
                          <span key={eq} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
                            {titleCase(eq)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Media */}
                    {ex.media && ex.media.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {ex.media.slice(0, 2).map((m, i) => (
                          <div key={i} className="overflow-hidden rounded-xl border border-slate-200">
                            {m.type === "mp4" ? (
                              <video src={m.src} autoPlay muted loop playsInline className="w-full h-32 object-cover" />
                            ) : (
                              <img src={m.src} alt={m.alt || ex.name} className="w-full h-32 object-cover" loading="lazy" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Cues */}
                    <ul className="mt-3 text-sm text-slate-700 list-disc pl-5 space-y-1">
                      {ex.cues.map((c, idx) => (
                        <li key={idx}>{c}</li>
                      ))}
                    </ul>
                  </article>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer safety / guidance */}
      <footer className="max-w-xl mx-auto mt-6 text-[12px] text-slate-500 pb-8">
        <p className="mb-2"><strong>Safety:</strong> Warm up 5–8 min (easy cardio + light sets). Pick loads that keep 1–3 reps in reserve (RIR) and zero pain. If any movement hurts, stop and swap for a similar pattern that feels good.</p>
        <p>
          Tip: Long-term gains come from consistency, good sleep, and progressive overload (add reps, sets, or small load over weeks).
        </p>
      </footer>
    </div>
  );
}
