import { useState } from 'react';
import { useGym } from '../context/GymContext';
import { Trash2, Plus } from 'lucide-react';
import * as storage from '../utils/storage';
import { format, parseISO } from 'date-fns';

const MeasurementForm = () => {
  const { measurements, refreshData, settings } = useGym();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [chest, setChest] = useState('');
  const [arm, setArm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    storage.addMeasurement({
      date,
      weight: weight ? Number(weight) : null,
      waist: waist ? Number(waist) : null,
      chest: chest ? Number(chest) : null,
      arm: arm ? Number(arm) : null
    });
    setWeight('');
    setWaist('');
    setChest('');
    setArm('');
    refreshData();
  };

  const handleDelete = (id) => {
    storage.deleteMeasurement(id);
    refreshData();
  };

  const sortedM = [...(measurements || [])].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="card p-5">
          <h3 className="text-lg font-medium mb-4 flex items-center text-gray-900 dark:text-white">
            <Plus className="w-5 h-5 mr-2 text-brand-500" />
            Add Record
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input type="date" required value={date} onChange={e => setDate(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Body Weight ({settings?.units})</label>
              <input type="number" step="0.1" required min="1" value={weight} onChange={e => setWeight(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex justify-between">
                <span>Waist (in)</span> <span className="text-gray-400 text-xs">Optional</span>
              </label>
              <input type="number" step="0.1" min="1" value={waist} onChange={e => setWaist(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex justify-between">
                <span>Chest (in)</span> <span className="text-gray-400 text-xs">Optional</span>
              </label>
              <input type="number" step="0.1" min="1" value={chest} onChange={e => setChest(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 flex justify-between">
                <span>Arm (in)</span> <span className="text-gray-400 text-xs">Optional</span>
              </label>
              <input type="number" step="0.1" min="1" value={arm} onChange={e => setArm(e.target.value)} className="input-field" />
            </div>
            <button type="submit" className="w-full btn-primary mt-2">Save Record</button>
          </form>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-[var(--border-color)] bg-gray-50 dark:bg-gray-800/50">
            <h3 className="font-medium text-gray-900 dark:text-white">Measurement History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/30">
                <tr className="text-left text-gray-500 dark:text-gray-400">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Weight</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Waist</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Chest</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">Arm</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {sortedM.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">No measurements recorded yet.</td>
                  </tr>
                ) : (
                  sortedM.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-200">{format(parseISO(m.date), 'dd MMM yyyy')}</td>
                      <td className="px-4 py-3">{m.weight ? `${m.weight} ${settings?.units}` : '-'}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">{m.waist ? `${m.waist} in` : '-'}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">{m.chest ? `${m.chest} in` : '-'}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">{m.arm ? `${m.arm} in` : '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDelete(m.id)} className="text-gray-400 hover:text-red-500 transition-colors">
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

export default MeasurementForm;
