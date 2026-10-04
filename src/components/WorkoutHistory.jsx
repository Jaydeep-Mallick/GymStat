import { useState } from 'react';
import { useGym } from '../context/GymContext';
import { format, parseISO } from 'date-fns';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import * as storage from '../utils/storage';
import WorkoutForm from './WorkoutForm';

const WorkoutHistory = () => {
  const { workouts, refreshData } = useGym();
  const [expandedId, setExpandedId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = (id) => {
    storage.deleteWorkout(id);
    refreshData();
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const sortedWorkouts = [...(workouts || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (showForm) {
    return <WorkoutForm onCancel={() => setShowForm(false)} onSuccess={() => { setShowForm(false); refreshData(); }} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Workouts</h3>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm">
          <Plus className="w-4 h-4 mr-1" /> Add Workout
        </button>
      </div>

      {sortedWorkouts.length === 0 ? (
        <div className="text-center py-12 card bg-gray-50 dark:bg-gray-800/50">
          <p className="text-gray-500 dark:text-gray-400">No workout data yet.<br/>Add your first workout to start tracking your progress.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedWorkouts.map((workout) => (
            <div key={workout.id} className="card overflow-hidden">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                onClick={() => toggleExpand(workout.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-brand-600 dark:text-brand-400 font-semibold w-24">
                    {format(parseISO(workout.date), 'dd MMM yyyy')}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm">
                    {workout.duration} min • {workout.exercises?.length || 0} exercises
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(workout.id); }}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expandedId === workout.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </div>
              
              {expandedId === workout.id && (
                <div className="p-4 border-t border-[var(--border-color)] bg-gray-50 dark:bg-gray-900/50">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400">
                        <th className="pb-2 font-medium">Exercise</th>
                        <th className="pb-2 font-medium">Weight</th>
                        <th className="pb-2 font-medium">Sets</th>
                        <th className="pb-2 font-medium">Reps</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {workout.exercises?.map((ex, idx) => (
                        <tr key={idx} className="text-gray-900 dark:text-gray-300">
                          <td className="py-2">{ex.name}</td>
                          <td className="py-2">{ex.weight}</td>
                          <td className="py-2">{ex.sets}</td>
                          <td className="py-2">{ex.reps}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
