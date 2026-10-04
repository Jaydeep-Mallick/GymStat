import { saveProfile, saveSettings, saveWorkouts, saveMeasurements, saveNutrition } from '../utils/storage';

export const loadSampleData = () => {
  // 1. Profile
  const profile = {
    name: 'Jaydeep',
    age: 19,
    height: 166,
    startWeight: 52,
    goal: 'Weight Gain'
  };
  saveProfile(profile);

  // 2. Settings
  const settings = {
    weeklyWorkoutGoal: 4,
    units: 'kg',
    theme: 'dark'
  };
  saveSettings(settings);

  // Utility to generate dates backwards
  const generateDates = (weeks, daysPerWeek) => {
    const dates = [];
    const now = new Date();
    for (let i = 0; i < weeks; i++) {
      for (let j = 0; j < daysPerWeek; j++) {
        const d = new Date(now);
        // spread days out roughly every 2 days
        d.setDate(now.getDate() - (i * 7) - (j * 2) - 1);
        dates.push(d.toISOString().split('T')[0]);
      }
    }
    return dates.sort(); // Oldest to newest
  };

  const workoutDates = generateDates(10, 3); // 10 weeks, ~3-4 workouts/week = 30 workouts

  // 3. Workouts (realistic progression)
  let benchWeight = 20;
  let latWeight = 35;
  let squatWeight = 40;
  let durationBase = 50;
  
  const workouts = workoutDates.map((date, index) => {
    // Increase weight slightly over time
    if (index % 5 === 0) {
      benchWeight += 2.5;
      latWeight += 2.5;
      squatWeight += 5;
    }
    
    // Vary duration
    const duration = durationBase + Math.floor(Math.random() * 20); 

    const exercises = [
      { id: 'e1', name: 'Bench Press', weight: benchWeight, sets: 3, reps: 10 },
      { id: 'e2', name: 'Lat Pulldown', weight: latWeight, sets: 3, reps: 10 },
      { id: 'e3', name: 'Squat', weight: squatWeight, sets: 3, reps: 8 },
      { id: 'e4', name: 'Bicep Curls', weight: 10 + (index % 10 === 0 ? 2.5 : 0), sets: 3, reps: 12 }
    ];

    return {
      id: `w_${index}`,
      date,
      duration,
      exercises
    };
  });
  saveWorkouts(workouts);

  // 4. Measurements (1 per week)
  const measurementDates = generateDates(10, 1);
  let weight = 52.0;
  
  const measurements = measurementDates.map((date, index) => {
    // Random fluctuation but general upward trend
    weight += (Math.random() * 0.4) - 0.1;
    return {
      id: `m_${index}`,
      date,
      weight: parseFloat(weight.toFixed(1)),
      waist: parseFloat((26.0 + (index * 0.05)).toFixed(1)),
      chest: parseFloat((34.0 + (index * 0.1)).toFixed(1)),
      arm: parseFloat((11.5 + (index * 0.05)).toFixed(1))
    };
  });
  saveMeasurements(measurements);

  // 5. Nutrition (Daily, realistic variation correlated with weight slightly)
  const nutritionDates = generateDates(10, 5); // 5 days a week tracked
  const nutrition = nutritionDates.map((date, index) => {
    const cals = 2400 + Math.floor(Math.random() * 400); // 2400-2800 kcal
    const prot = 100 + Math.floor(Math.random() * 30); // 100-130g protein
    return {
      id: `n_${index}`,
      date,
      calories: cals,
      protein: prot
    };
  });
  saveNutrition(nutrition);
};
