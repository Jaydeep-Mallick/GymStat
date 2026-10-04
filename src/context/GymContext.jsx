import { createContext, useState, useEffect, useContext } from 'react';
import * as storage from '../utils/storage';
import { loadSampleData } from '../data/sampleData';

const GymContext = createContext(null);

export const GymProvider = ({ children }) => {
  const [profile, setProfile] = useState(storage.getProfile());
  const [settings, setSettings] = useState(storage.getSettings());
  const [workouts, setWorkouts] = useState(storage.getWorkouts());
  const [measurements, setMeasurements] = useState(storage.getMeasurements());
  const [nutrition, setNutrition] = useState(storage.getNutrition());

  useEffect(() => {
    // Apply theme
    if (settings?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings?.theme]);

  const refreshData = () => {
    setProfile(storage.getProfile());
    setSettings(storage.getSettings());
    setWorkouts(storage.getWorkouts());
    setMeasurements(storage.getMeasurements());
    setNutrition(storage.getNutrition());
  };

  const handleClearData = () => {
    storage.clearAllData();
    refreshData();
  };

  const handleLoadSample = () => {
    loadSampleData();
    refreshData();
  };

  const updateProfile = (newProfile) => {
    storage.saveProfile(newProfile);
    setProfile(newProfile);
  };

  const updateSettings = (newSettings) => {
    storage.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const value = {
    profile, updateProfile,
    settings, updateSettings,
    workouts, setWorkouts, refreshData,
    measurements, setMeasurements,
    nutrition, setNutrition,
    handleClearData, handleLoadSample
  };

  return (
    <GymContext.Provider value={value}>
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => useContext(GymContext);
