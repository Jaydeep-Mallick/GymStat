import { useState, useEffect } from 'react';
import { useGym } from '../context/GymContext';

const Settings = () => {
  const { profile, updateProfile, settings, updateSettings, handleClearData, handleLoadSample } = useGym();
  
  const [profileData, setProfileData] = useState(profile || { name: '', age: '', height: '', startWeight: '', goal: '' });
  const [settingsData, setSettingsData] = useState(settings || { weeklyWorkoutGoal: 4, units: 'kg', theme: 'light' });

  useEffect(() => {
    if (profile) setProfileData(profile);
    if (settings) setSettingsData(settings);
  }, [profile, settings]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile(profileData);
    alert('Profile saved!');
  };

  const handleSettingsSave = (e) => {
    e.preventDefault();
    updateSettings(settingsData);
    alert('Settings saved!');
  };

  const confirmClearData = () => {
    if (window.confirm("Are you sure you want to delete all data? This cannot be undone.")) {
      handleClearData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your profile, preferences, and data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Profile</h3>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input type="text" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Age</label>
                <input type="number" value={profileData.age} onChange={e => setProfileData({...profileData, age: Number(e.target.value)})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Height (cm)</label>
                <input type="number" value={profileData.height} onChange={e => setProfileData({...profileData, height: Number(e.target.value)})} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fitness Goal</label>
              <select value={profileData.goal} onChange={e => setProfileData({...profileData, goal: e.target.value})} className="input-field">
                <option value="Weight Gain">Weight Gain</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Strength">Strength</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full mt-2">Save Profile</button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Preferences</h3>
            <form onSubmit={handleSettingsSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Weekly Workout Goal</label>
                <input type="number" min="1" max="7" value={settingsData.weeklyWorkoutGoal} onChange={e => setSettingsData({...settingsData, weeklyWorkoutGoal: Number(e.target.value)})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Units</label>
                <select value={settingsData.units} onChange={e => setSettingsData({...settingsData, units: e.target.value})} className="input-field">
                  <option value="kg">Metric (kg / cm)</option>
                  <option value="lb">Imperial (lb / in)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Theme</label>
                <select value={settingsData.theme} onChange={e => setSettingsData({...settingsData, theme: e.target.value})} className="input-field">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <button type="submit" className="btn-primary w-full mt-2">Save Preferences</button>
            </form>
          </div>

          <div className="card p-6 border-red-500 border-t-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Data Management</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Manage your local storage data.</p>
            <div className="space-y-3">
              <button onClick={handleLoadSample} className="btn-secondary w-full">
                Load Sample Data
              </button>
              <button onClick={confirmClearData} className="btn-danger w-full">
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
