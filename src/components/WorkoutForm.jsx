import { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import * as storage from '../utils/storage';

const WorkoutForm = ({ onCancel, onSuccess }) => {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(60);
  const [exercises, setExercises] = useState([
    { id: '1', name: '', weight: '', sets: '', reps: '' }
  ]);

  const handleAddExercise = () => {
    setExercises([...exercises, { id: Date.now().toString(), name: '', weight: '', sets: '', reps: '' }]);
  };

  const handleRemoveExercise = (id) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const handleExerciseChange = (id, field, value) => {
    setExercises(exercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanExercises = exercises.filter(ex => ex.name.trim() !== '').map(ex => ({
      name: ex.name,
      weight: Number(ex.weight),
      sets: Number(ex.sets),
      reps: Number(ex.reps)
    }));

    if (cleanExercises.length === 0) {
      alert("Please add at least one exercise");
      return;
    }

    storage.addWorkout({
      date,
      duration: Number(duration),
      exercises: cleanExercises
    });
    
    onSuccess();
  };

  return (
    <div className="card p-6 border-brand-500 border-t-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Record Workout</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total Duration (min)</label>
            <input type="number" required min="1" value={duration} onChange={e => setDuration(e.target.value)} className="input-field" />
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-[var(--border-color)] pb-2">Exercises</h3>
          {exercises.map((ex, index) => (
            <div key={ex.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <input type="text" placeholder="Exercise Name" required value={ex.name} onChange={e => handleExerciseChange(ex.id, 'name', e.target.value)} className="input-field text-sm" />
              </div>
              <div className="w-20">
                <input type="number" placeholder="Wt" required min="0" step="0.5" value={ex.weight} onChange={e => handleExerciseChange(ex.id, 'weight', e.target.value)} className="input-field text-sm" />
              </div>
              <div className="w-16">
                <input type="number" placeholder="Sets" required min="1" value={ex.sets} onChange={e => handleExerciseChange(ex.id, 'sets', e.target.value)} className="input-field text-sm" />
              </div>
              <div className="w-16">
                <input type="number" placeholder="Reps" required min="1" value={ex.reps} onChange={e => handleExerciseChange(ex.id, 'reps', e.target.value)} className="input-field text-sm" />
              </div>
              {exercises.length > 1 && (
                <button type="button" onClick={() => handleRemoveExercise(ex.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded mt-1 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddExercise} className="text-brand-600 dark:text-brand-400 text-sm font-medium flex items-center mt-2 hover:underline">
            <Plus className="w-4 h-4 mr-1" /> Add Exercise
          </button>
        </div>

        <div className="flex justify-end gap-3 mt-6 border-t border-[var(--border-color)] pt-4">
          <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
          <button type="submit" className="btn-primary">Save Workout</button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;
