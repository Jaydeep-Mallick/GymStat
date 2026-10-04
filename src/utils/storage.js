export const getStorageItem = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage', error);
  }
};

// Profile
export const getProfile = () => getStorageItem('gymstat_profile', null);
export const saveProfile = (profile) => setStorageItem('gymstat_profile', profile);

// Settings
export const getSettings = () => getStorageItem('gymstat_settings', {
  weeklyWorkoutGoal: 4,
  units: 'kg',
  theme: 'dark'
});
export const saveSettings = (settings) => setStorageItem('gymstat_settings', settings);

// Workouts
export const getWorkouts = () => getStorageItem('gymstat_workouts', []);
export const saveWorkouts = (workouts) => setStorageItem('gymstat_workouts', workouts);

export const addWorkout = (workout) => {
  const workouts = getWorkouts();
  workouts.push({
    id: Date.now().toString(),
    ...workout
  });
  saveWorkouts(workouts);
};

export const deleteWorkout = (id) => {
  const workouts = getWorkouts().filter(w => w.id !== id);
  saveWorkouts(workouts);
};

// Measurements
export const getMeasurements = () => getStorageItem('gymstat_measurements', []);
export const saveMeasurements = (measurements) => setStorageItem('gymstat_measurements', measurements);

export const addMeasurement = (measurement) => {
  const measurements = getMeasurements();
  measurements.push({
    id: Date.now().toString(),
    ...measurement
  });
  saveMeasurements(measurements);
};

export const deleteMeasurement = (id) => {
  const measurements = getMeasurements().filter(m => m.id !== id);
  saveMeasurements(measurements);
};

// Nutrition
export const getNutrition = () => getStorageItem('gymstat_nutrition', []);
export const saveNutrition = (nutrition) => setStorageItem('gymstat_nutrition', nutrition);

export const addNutrition = (record) => {
  const nutrition = getNutrition();
  nutrition.push({
    id: Date.now().toString(),
    ...record
  });
  saveNutrition(nutrition);
};

export const deleteNutrition = (id) => {
  const nutrition = getNutrition().filter(n => n.id !== id);
  saveNutrition(nutrition);
};

export const clearAllData = () => {
  window.localStorage.removeItem('gymstat_profile');
  window.localStorage.removeItem('gymstat_settings');
  window.localStorage.removeItem('gymstat_workouts');
  window.localStorage.removeItem('gymstat_measurements');
  window.localStorage.removeItem('gymstat_nutrition');
};
