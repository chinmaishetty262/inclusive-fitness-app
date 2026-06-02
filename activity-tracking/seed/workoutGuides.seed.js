const mongoose = require('mongoose');
const config = require('../config.json');
const WorkoutGuide = require('../models/workoutGuide.model');

const GUIDES = [
  // General / No disability
  {
    category: 'general',
    name: 'Full Body HIIT',
    difficulty: 'Intermediate',
    duration: '20–30 min',
    description: 'A high-intensity interval circuit that burns calories and builds cardiovascular fitness with no equipment needed.',
    steps: [
      'Warm up with 3 minutes of jogging on the spot and arm swings.',
      'Perform each exercise for 40 seconds with a 20-second rest: burpees, jump squats, push-ups, mountain climbers, high knees.',
      'Rest 90 seconds after completing all 5 exercises.',
      'Repeat the circuit 3–4 times.',
      'Cool down with 5 minutes of light walking and full-body stretches.',
    ],
  },
  {
    category: 'general',
    name: 'Beginner Running Plan',
    difficulty: 'Beginner',
    duration: '25–30 min',
    description: 'A run/walk interval programme to build aerobic base if you are new to running or returning after a break.',
    steps: [
      'Warm up with 5 minutes of brisk walking.',
      'Run for 1 minute at a comfortable conversational pace.',
      'Walk for 2 minutes to recover.',
      'Repeat the run/walk cycle 6–8 times.',
      'Cool down with 5 minutes of slow walking and calf and quad stretches.',
    ],
  },
  {
    category: 'general',
    name: 'Bodyweight Strength Circuit',
    difficulty: 'Beginner',
    duration: '30 min',
    description: 'A foundational strength workout using only your bodyweight — great for building muscle and improving posture.',
    steps: [
      'Squats: 3 sets of 15 reps.',
      'Push-ups (full or from knees): 3 sets of 10–12 reps.',
      'Reverse lunges: 3 sets of 10 reps per leg.',
      'Glute bridges: 3 sets of 15 reps.',
      'Plank hold: 3 sets of 20–30 seconds. Rest 60 seconds between sets.',
    ],
  },
  {
    category: 'general',
    name: 'Dumbbell Strength Training',
    difficulty: 'Intermediate',
    duration: '40–45 min',
    description: 'A structured upper and lower body session using dumbbells to build overall strength and muscle tone.',
    steps: [
      'Dumbbell goblet squat: 4 sets of 10.',
      'Dumbbell Romanian deadlift: 4 sets of 10.',
      'Dumbbell shoulder press: 3 sets of 10.',
      'Dumbbell bent-over row: 3 sets of 10 per arm.',
      'Dumbbell bicep curl into tricep extension superset: 3 sets of 12. Rest 60–90 seconds between sets.',
    ],
  },
  {
    category: 'general',
    name: 'Core & Stability Session',
    difficulty: 'Beginner',
    duration: '20 min',
    description: 'Targets the deep core muscles to improve stability, posture, and injury resilience.',
    steps: [
      'Dead bug: 3 sets of 10 reps per side.',
      'Bird-dog: 3 sets of 10 reps per side.',
      'Side plank: 3 holds of 20 seconds per side.',
      'Hollow body hold: 3 holds of 15–20 seconds.',
      'Glute bridge with 3-second hold at top: 3 sets of 12.',
    ],
  },
  {
    category: 'general',
    name: 'Advanced Compound Lifts',
    difficulty: 'Advanced',
    duration: '50–60 min',
    description: 'A heavy compound lifting session for those with a solid strength base. Focus on form throughout.',
    steps: [
      'Barbell back squat: 5 sets of 5 reps at 75–85% effort.',
      'Barbell bench press: 4 sets of 6 reps.',
      'Barbell deadlift: 3 sets of 5 reps.',
      'Pull-ups or lat pulldown: 4 sets of 6–8 reps.',
      'Overhead press: 3 sets of 8 reps. Rest 2–3 minutes between heavy sets.',
    ],
  },
  // Wheelchair
  {
    category: 'wheelchair',
    name: 'Seated Arm Circles',
    difficulty: 'Beginner',
    duration: '5–10 min',
    description: 'Gentle shoulder warm-up to improve range of motion and reduce stiffness.',
    steps: [
      'Sit upright with your back supported.',
      'Extend both arms out to the sides at shoulder height.',
      'Make small circles forward for 30 seconds, then reverse.',
      'Gradually increase the circle size.',
      'Rest and repeat 3 times.',
    ],
  },
  {
    category: 'wheelchair',
    name: 'Resistance Band Pull-Aparts',
    difficulty: 'Beginner',
    duration: '10–15 min',
    description: 'Strengthens the upper back and rear shoulders using a resistance band.',
    steps: [
      'Hold a resistance band with both hands, arms extended at chest height.',
      'Pull the band apart by moving both hands outward.',
      'Squeeze your shoulder blades together at the end of the movement.',
      'Slowly return to the start.',
      'Complete 3 sets of 12–15 reps.',
    ],
  },
  {
    category: 'wheelchair',
    name: 'Seated Shoulder Press',
    difficulty: 'Intermediate',
    duration: '15–20 min',
    description: 'Builds overhead pushing strength using light dumbbells or resistance bands.',
    steps: [
      'Sit upright with core engaged.',
      'Hold dumbbells or band handles at shoulder height, palms facing forward.',
      'Press upward until arms are nearly straight.',
      'Lower slowly back to shoulder height.',
      'Complete 3 sets of 10–12 reps.',
    ],
  },
  {
    category: 'wheelchair',
    name: 'Wheelchair Cardio Sprints',
    difficulty: 'Intermediate',
    duration: '20–30 min',
    description: 'Improves cardiovascular fitness through short bursts of fast wheelchair pushing.',
    steps: [
      'Warm up with 5 minutes of steady, easy pushing.',
      'Sprint at maximum effort for 30 seconds.',
      'Rest or slow roll for 60 seconds.',
      'Repeat 8–10 sprint intervals.',
      'Cool down with 5 minutes of slow pushing and gentle arm stretches.',
    ],
  },
  {
    category: 'wheelchair',
    name: 'Seated Core Twists',
    difficulty: 'Beginner',
    duration: '10 min',
    description: 'Strengthens the obliques and improves rotational mobility from a seated position.',
    steps: [
      'Sit upright without leaning against the back support.',
      'Hold a light medicine ball or clasp your hands together at chest level.',
      'Rotate your torso slowly to the right, then to the left.',
      'Keep hips as still as possible throughout.',
      'Complete 3 sets of 15 twists per side.',
    ],
  },
  {
    category: 'wheelchair',
    name: 'Chest Press with Resistance Band',
    difficulty: 'Intermediate',
    duration: '15 min',
    description: 'Builds chest and tricep strength using an anchored resistance band.',
    steps: [
      'Anchor a resistance band behind your seat at chest height.',
      'Hold the handles at chest height with elbows bent.',
      'Press forward until arms are extended.',
      'Slowly return to the start, keeping control.',
      'Complete 3 sets of 12 reps.',
    ],
  },
  // Crutches
  {
    category: 'crutches',
    name: 'Seated Upper Body Circuit',
    difficulty: 'Beginner',
    duration: '15–20 min',
    description: 'A full upper body workout done entirely seated — safe for those using crutches.',
    steps: [
      'Perform 15 seated arm raises.',
      'Follow with 15 resistance band rows.',
      'Add 15 bicep curls with light dumbbells.',
      'Finish with 15 tricep extensions.',
      'Rest 60 seconds and repeat the circuit 2–3 times.',
    ],
  },
  {
    category: 'crutches',
    name: 'Supported Standing Balance',
    difficulty: 'Beginner',
    duration: '10 min',
    description: 'Builds leg stability and balance using a wall or sturdy chair for safety.',
    steps: [
      'Stand next to a wall or the back of a sturdy chair.',
      'Slowly shift weight onto your stronger leg.',
      'Hold for 10–30 seconds, breathing steadily.',
      'Return to both feet.',
      'Repeat 5 times per side, resting between sets.',
    ],
  },
  {
    category: 'crutches',
    name: 'Seated Leg Raises',
    difficulty: 'Beginner',
    duration: '10–15 min',
    description: 'Strengthens the quadriceps and hip flexors without loading a healing lower limb.',
    steps: [
      'Sit in a sturdy chair with your back straight.',
      'Extend one leg out straight and hold for 3 seconds.',
      'Lower slowly without letting the foot touch the floor.',
      'Complete 12–15 reps per leg.',
      'Perform 3 sets.',
    ],
  },
  {
    category: 'crutches',
    name: 'Crutch-Supported Calf Raises',
    difficulty: 'Intermediate',
    duration: '10 min',
    description: 'Gentle calf strengthening for those partially weight-bearing, using crutches for balance.',
    steps: [
      'Stand upright using crutches for support.',
      'Slowly rise onto the toes of your weight-bearing foot.',
      'Hold at the top for 2 seconds.',
      'Lower back down with control.',
      'Complete 3 sets of 12 reps.',
    ],
  },
  {
    category: 'crutches',
    name: 'Gentle Chair Yoga',
    difficulty: 'Beginner',
    duration: '20 min',
    description: 'Improves flexibility and reduces tension with seated yoga poses, suitable for limited lower limb mobility.',
    steps: [
      'Begin with seated deep breathing for 2 minutes.',
      'Gentle neck rolls: 5 each direction.',
      'Seated cat-cow: arch and round your back 10 times.',
      'Seated spinal twist: hold each side for 30 seconds.',
      'Finish with 2 minutes of relaxed, slow breathing.',
    ],
  },
  {
    category: 'crutches',
    name: 'Upper Body Resistance Circuit',
    difficulty: 'Intermediate',
    duration: '20–25 min',
    description: 'Maintains upper body strength during lower limb recovery using resistance bands.',
    steps: [
      '15 resistance band chest presses.',
      '15 resistance band rows.',
      '12 overhead tricep extensions.',
      '12 bicep curls per arm.',
      'Rest 90 seconds between rounds. Complete 3 rounds.',
    ],
  },
  // Other disabilities
  {
    category: 'other',
    name: 'Gentle Yoga Flow',
    difficulty: 'Beginner',
    duration: '20–30 min',
    description: 'A slow, accessible yoga routine focusing on breathing and gentle movement — suitable for chronic conditions, fatigue, or visual impairment.',
    steps: [
      'Begin lying down with slow, deep breaths for 3 minutes.',
      'Gentle knee-to-chest stretches: hold 30 seconds each side.',
      'Seated forward fold: hold 30 seconds.',
      "Child's pose: hold 60 seconds.",
      'End with 3 minutes of relaxed, body-scan breathing.',
    ],
  },
  {
    category: 'other',
    name: 'Low Impact Walking Programme',
    difficulty: 'Beginner',
    duration: '20–30 min',
    description: 'A structured walk-rest programme for those managing fatigue, chronic pain, or limited energy.',
    steps: [
      'Start with 5 minutes of gentle walking at a comfortable pace.',
      'Rest for 2 minutes if needed.',
      'Continue with 10 minutes of steady walking.',
      'Rest for 2 minutes.',
      'Finish with a 5-minute cool-down walk and gentle stretches.',
    ],
  },
  {
    category: 'other',
    name: 'Seated Pilates Core',
    difficulty: 'Beginner',
    duration: '15–20 min',
    description: 'Core strengthening exercises adapted for seated or mat-based positions, suitable for a wide range of conditions.',
    steps: [
      'Seated pelvic tilts: 15 reps, focus on the lower back.',
      'Seated march: alternate raising knees slowly, 20 reps total.',
      'Leg lowering from lying: 12 reps, keep lower back pressed down.',
      'Dead bug: extend opposite arm and leg, 10 reps per side.',
      'Rest and repeat twice.',
    ],
  },
  {
    category: 'other',
    name: 'Adapted Strength Training',
    difficulty: 'Intermediate',
    duration: '25–35 min',
    description: 'Compound strength moves adapted for chronic illness, sensory impairments, or prosthetic users. Focus on controlled, steady movements.',
    steps: [
      'Seated or supported squat: 3 sets of 10.',
      'Resistance band row: 3 sets of 12.',
      'Modified push-up (from knees or wall): 3 sets of 10.',
      'Dumbbell deadlift (light weight): 3 sets of 10.',
      'Rest 90 seconds between sets and focus on steady breathing throughout.',
    ],
  },
  {
    category: 'other',
    name: 'Water-Based Exercise',
    difficulty: 'Beginner',
    duration: '30–45 min',
    description: 'Pool exercises that reduce joint load — ideal for arthritis, chronic pain, fibromyalgia, or lower limb conditions.',
    steps: [
      'Warm up with 5 minutes of slow walking in chest-deep water.',
      'Water marching: high knees for 2 minutes.',
      'Side steps: move laterally across the pool, 4 lengths.',
      'Arm sweeps: push water forward and back while walking for 5 minutes.',
      'Cool down with gentle floating and deep breathing.',
    ],
  },
  {
    category: 'other',
    name: 'Mindful Movement & Stretching',
    difficulty: 'Beginner',
    duration: '15–20 min',
    description: 'Combines gentle stretching with mindfulness — great for mental health support alongside physical disability.',
    steps: [
      'Begin with 3 minutes of slow, focused breathing.',
      'Gentle shoulder rolls and neck stretches: 2 minutes.',
      'Seated or lying hip stretches: hold 30 seconds each side.',
      'Progressive muscle relaxation: tense and release each muscle group from feet upward.',
      'Finish with 3 minutes of eyes-closed, body-scan breathing.',
    ],
  },
];

// Called from server.js on startup (connection already open)
async function seedWorkoutGuides() {
  await WorkoutGuide.insertMany(GUIDES);
  console.log(`Seeded ${GUIDES.length} workout guides.`);
}

// Also runnable standalone: node seed/workoutGuides.seed.js
if (require.main === module) {
  (async () => {
    await mongoose.connect(config.mongoUri, { useNewUrlParser: true });
    const existing = await WorkoutGuide.countDocuments();
    if (existing > 0) {
      console.log(`Already seeded (${existing} docs). Skipping.`);
    } else {
      await seedWorkoutGuides();
    }
    await mongoose.disconnect();
  })().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
}

module.exports = seedWorkoutGuides;
