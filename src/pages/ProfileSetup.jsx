import { useState } from 'react';
import { useGym } from '../context/GymContext';
import { Dumbbell } from 'lucide-react';

const ProfileSetup = () => {
  const { updateProfile, handleLoadSample } = useGym();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    startWeight: '',
    goal: 'Weight Gain'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name: formData.name,
      age: Number(formData.age),
      height: Number(formData.height),
      startWeight: Number(formData.startWeight),
      goal: formData.goal
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f1117] px-4">
      <div className="max-w-md w-full card p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-brand-100 dark:bg-brand-900/50 rounded-full flex items-center justify-center mb-4">
            <Dumbbell className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to GymStat</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Let's set up your profile to start tracking your progress.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="Jaydeep" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <input required type="number" name="age" value={formData.age} onChange={handleChange} className="input-field" placeholder="19" min="1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Height (cm)</label>
              <input required type="number" name="height" value={formData.height} onChange={handleChange} className="input-field" placeholder="166" min="1" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Starting Weight (kg)</label>
            <input required type="number" step="0.1" name="startWeight" value={formData.startWeight} onChange={handleChange} className="input-field" placeholder="52" min="1" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fitness Goal</label>
            <select name="goal" value={formData.goal} onChange={handleChange} className="input-field">
              <option value="Weight Gain">Weight Gain</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Strength">Strength</option>
            </select>
          </div>
          
          <button type="submit" className="w-full btn-primary mt-6 py-2.5 text-base">
            Create Profile
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[var(--border-color)] text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Or explore with sample data</p>
          <button onClick={handleLoadSample} className="w-full btn-secondary">
            Load Sample Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
