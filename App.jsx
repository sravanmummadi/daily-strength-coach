import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";

// Helpers
const titleCase = (s) => s.replace(/(^|\s)\w/g, (m) => m.toUpperCase());
const todayDow = () => new Date().toLocaleDateString(undefined, { weekday: "long" });

// --- Static PROGRAM simplified (images kept)
const PROGRAM = [
  {
    "day": "Monday",
    "focus": "Upper Push (Chest/Shoulders/Triceps)",
    "exercises": [
      {
        "id": "bench_press",
        "name": "Dumbbell Bench Press",
        "equipment": [
          "dumbbells",
          "bench"
        ],
        "primary": "Chest",
        "cues": [
          "Wrists stacked over elbows; slight arch, no bounce",
          "2\u20133 sec lower, 1 sec up; stop 1\u20132 reps before failure"
        ],
        "media": [
          {
            "type": "img",
            "src": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Dumbbell-bench-press-2.png",
            "alt": "DB Bench Press"
          },
          {
            "type": "gif",
            "src": "https://upload.wikimedia.org/wikipedia/commons/4/4d/Dumbbell_Bench_Press.gif",
            "alt": "DB Bench Press GIF"
          }
        ]
      },
      {
        "id": "incline_pushup",
        "name": "Incline Push-Up",
        "equipment": [
          "bench"
        ],
        "primary": "Chest",
        "cues": [
          "Body straight; hands under shoulders",
          "Lower under control; avoid elbow flare"
        ],
        "media": [
          {
            "type": "img",
            "src": "https://upload.wikimedia.org/wikipedia/commons/4/43/Pushups_-_Incline.jpg",
            "alt": "Incline Push-Up"
          }
        ]
      },
      {
        "id": "ohp",
        "name": "Overhead Shoulder Press",
        "equipment": [
          "dumbbells"
        ],
        "primary": "Shoulders",
        "cues": [
          "Ribs down; avoid overarching lower back",
          "Press slightly forward then up"
        ],
        "media": [
          {
            "type": "img",
            "src": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Dumbbell_shoulder_press_2.png",
            "alt": "DB OHP"
          }
        ]
      },
      {
        "id": "lateral_raise",
        "name": "Lateral Raise",
        "equipment": [
          "dumbbells"
        ],
        "primary": "Shoulders",
        "cues": [
          "Soft elbows; raise to just below shoulder height",
          "Tempo: 2 up, 3 down"
        ],
        "media": [
          {
            "type": "gif",
            "src": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Dumbbell_Lateral_Raise.gif",
            "alt": "Lateral Raise"
          }
        ]
      },
      {
        "id": "tricep_press",
        "name": "Overhead Triceps Extension",
        "equipment": [
          "dumbbells"
        ],
        "primary": "Triceps",
        "cues": [
          "Elbows narrow; avoid flaring",
          "Only go as deep as shoulders allow"
        ],
        "media": [
          {
            "type": "img",
            "src": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Triceps-Extension-2.png",
            "alt": "Triceps Extension"
          }
        ]
      }
    ]
  },
  {
    "day": "Tuesday",
    "focus": "Lower (Quads/Hamstrings/Glutes)",
    "exercises": [
      {
        "id": "goblet_squat",
        "name": "Goblet Squat",
        "equipment": [
          "dumbbells"
        ],
        "primary": "Quads",
        "cues": [
          "Heels down; knees track over toes",
          "Brace core; chest tall"
        ],
        "media": [
          {
            "type": "gif",
            "src": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Goblet_Squat.gif",
            "alt": "Goblet Squat"
          }
        ]
      },
      {
        "id": "rdl",
        "name": "Romanian Deadlift",
        "equipment": [
          "dumbbells"
        ],
        "primary": "Hamstrings",
        "cues": [
          "Hinge at hips; shins vertical",
          "Stop at mid-shin when hamstrings loaded"
        ],
        "media": [
          {
            "type": "img",
            "src": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Dumbbell_romanian_deadlift.png",
            "alt": "DB RDL"
          }
        ]
      },
      {
        "id": "split_squat",
        "name": "Rear-Foot Elevated Split Squat",
        "equipment": [
          "bench",
          "dumbbells"
        ],
        "primary": "Quads/Glutes",
        "cues": [
          "Front knee forward; torso upright",
          "Light hold on bench for balance if needed"
        ]
      },
      {
        "id": "glute_bridge",
        "name": "Glute Bridge",
        "equipment": [
          "none"
        ],
        "primary": "Glutes",
        "cues": [
          "Posterior pelvic tilt; squeeze at top 1 sec",
          "No lower back arching"
        ]
      },
      {
        "id": "calf_raise",
        "name": "Standing Calf Raise",
        "equipment": [
          "dumbbells"
        ],
        "primary": "Calves",
        "cues": [
          "Full range; slow lower (3 sec)",
          "Hold stable surface if needed"
        ]
      }
    ]
  },
  {
    "day": "Wednesday",
    "focus": "Upper Pull (Back/Biceps)",
    "exercises": [
      {
        "id": "one_arm_row",
        "name": "One-Arm Dumbbell Row",
        "equipment": [
          "dumbbells",
          "bench"
        ],
        "primary": "Back",
        "cues": [
          "Neutral spine; pull elbow to hip",
          "Pause 1 sec at top"
        ],
        "media": [
          {
            "type": "img",
            "src": "https://upload.wikimedia.org/wikipedia/commons/e/e2/One-arm-dumbbell-row-2.png",
            "alt": "1-Arm Row"
          }
        ]
      },
      {
        "id": "lat_pulldown_band",
        "name": "Band Lat Pulldown",
        "equipment": [
          "resistance band"
        ],
        "primary": "Lats",
        "cues": [
          "Down and back into back pockets",
          "Avoid shrugging"
        ]
      },
      {
        "id": "rear_delt_fly",
        "name": "Rear Delt Fly",
        "equipment": [
          "dumbbells"
        ],
        "primary": "Rear Delts",
        "cues": [
          "Hinge; thumbs slightly in; slow negatives"
        ]
      },
      {
        "id": "curl",
        "name": "Dumbbell Curl",
        "equipment": [
          "dumbbells"
        ],
        "primary": "Biceps",
        "cues": [
          "Elbows pinned; no swinging",
          "Squeeze at top 1 sec"
        ]
      },
      {
        "id": "hammer_curl",
        "name": "Hammer Curl",
        "equipment": [
          "dumbbells"
        ],
        "primary": "Brachialis/Forearm",
        "cues": [
          "Neutral grip; slow down-phase"
        ]
      }
    ]
  },
  {
    "day": "Thursday",
    "focus": "Lower (Glutes/Hamstrings emphasis)",
    "exercises": [
      {
        "id": "hip_hinge_band",
        "name": "Banded Hip Hinge",
        "equipment": [
          "resistance band"
        ],
        "primary": "Posterior Chain",
        "cues": [
          "Push hips back; keep shins vertical",
          "Brace core; neutral neck"
        ]
      },
      {
        "id": "stepup",
        "name": "Step-Up",
        "equipment": [
          "bench",
          "dumbbells"
        ],
        "primary": "Quads/Glutes",
        "cues": [
          "Drive through whole foot; control down",
          "Use low height if knees ache"
        ]
      },
      {
        "id": "ham_curl_band",
        "name": "Banded Hamstring Curl",
        "equipment": [
          "resistance band"
        ],
        "primary": "Hamstrings",
        "cues": [
          "Pin hips; squeeze 1 sec; slow return"
        ]
      },
      {
        "id": "side_plank",
        "name": "Side Plank (Hip Abductors)",
        "equipment": [
          "none"
        ],
        "primary": "Core/Glute Med",
        "cues": [
          "Straight line; keep ribs down",
          "If wrist bothers, use forearm"
        ]
      },
      {
        "id": "single_leg_rdl",
        "name": "Single-Leg RDL (Assisted)",
        "equipment": [
          "dumbbells"
        ],
        "primary": "Hamstrings/Glutes",
        "cues": [
          "Light support with free hand; square hips",
          "Short range if balance is hard"
        ]
      }
    ]
  },
  {
    "day": "Friday",
    "focus": "Upper Push/Pull Mix",
    "exercises": [
      {
        "id": "incline_db_press",
        "name": "Incline DB Press",
        "equipment": [
          "dumbbells",
          "bench"
        ],
        "primary": "Chest/Shoulders",
        "cues": [
          "Shoulder blades set; no bouncing",
          "Lower to upper chest"
        ]
      },
      {
        "id": "chest_supported_row",
        "name": "Chest-Supported Row",
        "equipment": [
          "dumbbells",
          "bench"
        ],
        "primary": "Back",
        "cues": [
          "Bench ~30\u201345\u00b0; pull elbow to hip",
          "Pause at top 1 sec"
        ]
      },
      {
        "id": "face_pull_band",
        "name": "Band Face Pull",
        "equipment": [
          "resistance band"
        ],
        "primary": "Rear Delts/Upper Back",
        "cues": [
          "Elbows high; rotate thumbs back",
          "No lower back arch"
        ]
      },
      {
        "id": "curl_alt",
        "name": "Alternating Curl",
        "equipment": [
          "dumbbells"
        ],
        "primary": "Biceps",
        "cues": [
          "Slow eccentric 3 sec",
          "No torso swing"
        ]
      },
      {
        "id": "tricep_pushdown_band",
        "name": "Band Triceps Pushdown",
        "equipment": [
          "resistance band"
        ],
        "primary": "Triceps",
        "cues": [
          "Elbows glued to sides; full lockout",
          "Control back up"
        ]
      }
    ]
  },
  {
    "day": "Saturday",
    "focus": "Full Body (Short)",
    "exercises": [
      {
        "id": "db_clean_press",
        "name": "DB Clean to Press (Light)",
        "equipment": [
          "dumbbells"
        ],
        "primary": "Total Body",
        "cues": [
          "Smooth; not explosive; prioritize control",
          "Stop if form degrades"
        ]
      },
      {
        "id": "front_foot_elev_split",
        "name": "Front-Foot Elevated Split Squat",
        "equipment": [
          "dumbbells",
          "plate"
        ],
        "primary": "Quads/Glutes",
        "cues": [
          "Small elevation; knee tracks over toes",
          "Use bodyweight if needed"
        ]
      },
      {
        "id": "one_arm_row_2",
        "name": "One-Arm Row (Light)",
        "equipment": [
          "dumbbells",
          "bench"
        ],
        "primary": "Back",
        "cues": [
          "Neutral spine; no torso twist"
        ]
      },
      {
        "id": "pushup_knees",
        "name": "Push-Up (Knees or Full)",
        "equipment": [
          "none"
        ],
        "primary": "Chest/Triceps",
        "cues": [
          "Body line; control down; full range"
        ]
      },
      {
        "id": "plank",
        "name": "Plank",
        "equipment": [
          "none"
        ],
        "primary": "Core",
        "cues": [
          "Glutes tight; ribs down; breathe",
          "Stop before shaking compromises form"
        ]
      }
    ]
  },
  {
    "day": "Sunday",
    "focus": "Core + Mobility (Optional Strength)",
    "exercises": [
      {
        "id": "dead_bug",
        "name": "Dead Bug",
        "equipment": [
          "none"
        ],
        "primary": "Core",
        "cues": [
          "Lower back gently pressed to floor",
          "Slow exhale as leg/arm extend"
        ]
      },
      {
        "id": "pallof_press_band",
        "name": "Pallof Press (Band)",
        "equipment": [
          "resistance band"
        ],
        "primary": "Anti-Rotation Core",
        "cues": [
          "Square hips; don\u2019t let torso rotate",
          "Short sets of quality reps"
        ]
      },
      {
        "id": "bird_dog",
        "name": "Bird Dog",
        "equipment": [
          "none"
        ],
        "primary": "Core/Back",
        "cues": [
          "Reach long; keep hips level",
          "Pause 1 sec; slow return"
        ]
      },
      {
        "id": "hip_flexor_mob",
        "name": "Half-Kneeling Hip Flexor Stretch",
        "equipment": [
          "none"
        ],
        "primary": "Mobility",
        "cues": [
          "Tuck pelvis; gentle stretch, no pain",
          "30\u201345 sec each side"
        ]
      },
      {
        "id": "thoracic_opener",
        "name": "Thoracic Opener (Bench/Wall)",
        "equipment": [
          "bench"
        ],
        "primary": "Mobility",
        "cues": [
          "No pinching; breathe into ribs",
          "Move within comfort"
        ]
      }
    ]
  }
];

export default function App(){
  const [currentDay, setCurrentDay] = useState(todayDow());
  const dayPlan = useMemo(()=> PROGRAM.find(d=>d.day===currentDay) ?? PROGRAM[0], [currentDay]);

  const initialEquipment = useMemo(()=>{
    const set = new Set();
    PROGRAM.forEach(d=>d.exercises.forEach(e=>e.equipment.forEach(eq=>set.add(eq))));
    return Array.from(set);
  },[]);

  const [equipment, setEquipment] = useState(initialEquipment);
  const [active, setActive] = useState(() => Object.fromEntries(initialEquipment.map((e) => [e, true])));
  const [newEq, setNewEq] = useState("");

  useEffect(()=>{
    setActive(prev=>{
      const next = {...prev};
      equipment.forEach(e=> next[e] = e in next ? next[e] : true);
      Object.keys(next).forEach(k=>{ if(!equipment.includes(k)) delete next[k];});
      return next;
    });
  }, [equipment]);

  const toggle = (eq)=> setActive(m=>({...m, [eq]: !m[eq]}));
  const remove = (eq)=> setEquipment(arr => arr.filter(x=>x!==eq));
  const add = ()=>{
    const k = newEq.trim().toLowerCase();
    if(!k) return;
    if(!equipment.includes(k)) setEquipment(arr=>[...arr,k]);
    setNewEq("");
  };

  const visibleExercises = dayPlan.exercises.filter(ex =>
    ex.equipment.every(eq => active[eq] ?? (equipment.includes(eq) ? false : true))
  );

  const dayNames = PROGRAM.map(d=>d.day);

  return (
    <div className="container">
      <header className="header">
        <h1>Daily Strength Coach</h1>
        <p className="small">Mobile-friendly. Tap equipment you have; exercises update instantly.</p>

        <div className="day-selector" role="tablist">
          {dayNames.map(d => (
            <button key={d} className={`day-btn ${currentDay===d?'active':''}`} onClick={()=>setCurrentDay(d)}>{d}</button>
          ))}
        </div>

        <div className="small" style={{marginTop:8}}><strong>Today:</strong> {dayPlan.focus}</div>
      </header>

      <section style={{marginTop:12}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
          <h3>Equipment I Have</h3>
          <div className="small">Tap to toggle · remove with trash</div>
        </div>

        <div className="tags" style={{marginTop:8}}>
          {equipment.map(eq => (
            <div key={eq} className="tag">
              <button onClick={()=>toggle(eq)} style={{background:"transparent",border:"none",padding:0,cursor:"pointer"}}>{titleCase(eq)}</button>
              <button onClick={()=>remove(eq)} style={{background:"transparent",border:"none",padding:0,cursor:"pointer"}} aria-label={`remove ${eq}`}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>

        <div className="input-row">
          <input value={newEq} onChange={(e)=>setNewEq(e.target.value)} placeholder="Add equipment (e.g., kettlebell)" />
          <button className="button" onClick={add}><Plus size={14}/> Add</button>
        </div>
      </section>

      <main style={{marginTop:16}}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
          <h3>Exercises ({visibleExercises.length})</h3>
          <div className="small">5+ exercises/day · 2–3 sets · 8–12 reps</div>
        </div>

        {visibleExercises.length === 0 ? (
          <div className="small">No exercises match your current equipment. Add or re-enable a tag above.</div>
        ) : (
          <div>
            {visibleExercises.map(ex => (
              <article key={ex.id} className="card">
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
                  <div>
                    <h4 style={{margin:0}}>{ex.name}</h4>
                    <div className="small">{ex.primary}</div>
                  </div>
                  <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
                    {ex.equipment.map(eq => <span key={eq} className="small" style={{padding:"4px 8px",borderRadius:999,background:"#f1f5f9"}}>{titleCase(eq)}</span>)}
                  </div>
                </div>

                {ex.media && ex.media.length>0 && (
                  <div className="media-grid">
                    {ex.media.slice(0,2).map((m,i) => (
                      <div key={i} style={{overflow:"hidden",borderRadius:10}}>
                        {m.type==="mp4" ? (
                          <video src={m.src} autoPlay muted loop playsInline style={{width:"100%",height:120,objectFit:"cover"}} />
                        ) : (
                          <img src={m.src} alt={m.alt||ex.name} style={{width:"100%",height:120,objectFit:"cover"}} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <ul style={{marginTop:10,paddingLeft:18}}>
                  {ex.cues.map((c,idx)=> <li key={idx} className="small">{c}</li>)}
                </ul>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer style={{marginTop:12}} className="small">
        <p><strong>Safety:</strong> Warm up 5–8 min. Pick loads that keep 1–3 reps in reserve. Stop if a movement causes pain.</p>
      </footer>
    </div>
  );
}
