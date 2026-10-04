import { useState } from 'react';
import { useGym } from '../context/GymContext';
import { Trash2, Plus } from 'lucide-react';
import * as storage from '../utils/storage';
import { format, parseISO } from 'date-fns';

const NutritionForm = () => {
  const { nutrition, refreshData } = useGym();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    storage.addNutrition({
      date,
      calories: calories ? Number(calories) : null,
      protein: protein ? Number(protein) : null
    });
    setCalories('');
    setProtein('');
    refreshData();
  };

  const handleDelete = (id) => {
    storage.deleteNutrition(id);
    refreshData();
  };

  const sortedN = [...(nutrition || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="card p-5">
          <h3 className="text-lg font-medium mb-4 flex items-center text-gray-900 dark:text-white">
            <Plus className="w-5 h-5 mr-2 text-brand-500" />
            Add Nutrition
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex justify-between">
                <span>Calories (kcal)</span> <span className="text-gray-400 text-xs">Optional</span>
              </label>
              <input type="number" min="0" value={calories} onChange={e => setCalories(e.target.value)} className="input-field" placeholder="e.g. 2500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex justify-between">
                <span>Protein (g)</span> <span className="text-gray-400 text-xs">Optional</span>
              </label>
              <input type="number" min="0" value={protein} onChange={e => setProtein(e.target.value)} className="input-field" placeholder="e.g. 120" />
            </div>
            <button type="submit" className="w-full btn-primary mt-2">Save Record</button>
          </form>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)] bg-gray-50 dark:bg-gray-800/50">
            <h3 className="font-medium text-gray-900 dark:text-white">Nutrition History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/30">
                <tr className="text-left text-gray-500 dark:text-gray-400">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Calories</th>
                  <th className="px-4 py-3 font-medium">Protein</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {sortedN.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">No nutrition recorded yet.</td>
                  </tr>
                ) : (
                  sortedN.map((n) => (
                    <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-200">{format(parseISO(n.date), 'dd MMM yyyy')}</td>
                      <td className="px-4 py-3">{n.calories ? `${n.calories} kcal` : '-'}</td>
                      <td className="px-4 py-3">{n.protein ? `${n.protein} g` : '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDelete(n.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionForm;
