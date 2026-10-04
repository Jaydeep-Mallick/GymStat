import { useState } from 'react';
import WorkoutHistory from '../components/WorkoutHistory';
import MeasurementForm from '../components/MeasurementForm';
import NutritionForm from '../components/NutritionForm';
import clsx from 'clsx';

const Progress = () => {
  const [activeTab, setActiveTab] = useState('workouts');

  const tabs = [
    { id: 'workouts', label: 'Workouts' },
    { id: 'measurements', label: 'Body Measurements' },
    { id: 'nutrition', label: 'Nutrition' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Progress</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage and track your fitness data.</p>
      </div>

      <div className="border-b border-[var(--border-color)]">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                activeTab === tab.id
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'workouts' && <WorkoutHistory />}
        {activeTab === 'measurements' && <MeasurementForm />}
        {activeTab === 'nutrition' && <NutritionForm />}
      </div>
    </div>
  );
};

export default Progress;
