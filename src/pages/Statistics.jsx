import { useState, useMemo } from 'react';
import { useGym } from '../context/GymContext';
import { calculateDescriptiveStats, getFrequencyDistribution } from '../utils/statistics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../components/StatCard';

const Statistics = () => {
  const { workouts, measurements, nutrition } = useGym();
  const [variable, setVariable] = useState('bodyWeight');

  const data = useMemo(() => {
    switch (variable) {
      case 'bodyWeight':
        return measurements.map(m => m.weight).filter(w => w != null);
      case 'waist':
        return measurements.map(m => m.waist).filter(w => w != null);
      case 'calories':
        return nutrition.map(n => n.calories).filter(c => c != null);
      case 'protein':
        return nutrition.map(n => n.protein).filter(p => p != null);
      case 'workoutDuration':
        return workouts.map(w => w.duration).filter(d => d != null);
      case 'weightLifted':
        return workouts.flatMap(w => w.exercises.map(e => e.weight)).filter(w => w != null);
      case 'repetitions':
        return workouts.flatMap(w => w.exercises.map(e => e.reps)).filter(r => r != null);
      default:
        return [];
    }
  }, [variable, workouts, measurements, nutrition]);

  const stats = useMemo(() => calculateDescriptiveStats(data), [data]);
  const distribution = useMemo(() => getFrequencyDistribution(data, 8), [data]);

  const variableNames = {
    bodyWeight: 'Body Weight',
    waist: 'Waist Size',
    calories: 'Calories',
    protein: 'Protein',
    workoutDuration: 'Workout Duration',
    weightLifted: 'Weight Lifted',
    repetitions: 'Repetitions'
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Statistics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Descriptive statistics for your fitness data.</p>
      </div>

      <div className="card p-6 border-l-4 border-brand-500">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Select Fitness Variable to Analyze:</label>
        <select 
          value={variable} 
          onChange={e => setVariable(e.target.value)} 
          className="input-field max-w-md"
        >
          {Object.entries(variableNames).map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
      </div>

      {!stats ? (
        <div className="text-center py-12 card bg-gray-50 dark:bg-gray-800/50">
          <p className="text-gray-500 dark:text-gray-400">Not enough data to calculate statistics for this variable.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Count" value={stats.count} />
            <StatCard title="Mean (Avg)" value={stats.mean.toFixed(2)} />
            <StatCard title="Median" value={stats.median.toFixed(2)} />
            <StatCard title="Mode" value={stats.mode.toFixed(2)} />
            <StatCard title="Minimum" value={stats.min.toFixed(2)} />
            <StatCard title="Maximum" value={stats.max.toFixed(2)} />
            <StatCard title="Range" value={stats.range.toFixed(2)} />
            <StatCard title="Std Deviation" value={stats.stdDev.toFixed(2)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 card p-6 flex flex-col">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{variableNames[variable]} Analyzer</h3>
              <div className="flex-1 min-h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distribution} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis 
                      dataKey="bin" 
                      tick={{ fill: 'var(--text-color)', fontSize: 11 }} 
                      axisLine={{ stroke: 'var(--border-color)' }}
                    />
                    <YAxis 
                      tick={{ fill: 'var(--text-color)', fontSize: 12 }} 
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      cursor={{ fill: 'var(--border-color)', opacity: 0.4 }}
                      contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-color)', borderRadius: '8px' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Occurrences" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-right mt-3 italic">
                Frequency Distribution (Histogram)
              </p>
            </div>

            <div className="card p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Detailed Stats</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                    <span className="text-gray-500 dark:text-gray-400">Variance</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">{stats.variance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                    <span className="text-gray-500 dark:text-gray-400">Skewness</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">{stats.skewness ? stats.skewness.toFixed(2) : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                    <span className="text-gray-500 dark:text-gray-400">25th Percentile (Q1)</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">{stats.q1.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-gray-500 dark:text-gray-400">75th Percentile (Q3)</span>
                    <span className="font-medium text-gray-900 dark:text-gray-200">{stats.q3.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-lg mt-4">
                <p className="text-sm text-brand-700 dark:text-brand-300">
                  {stats.skewness && Math.abs(stats.skewness) > 1 
                    ? "The data is highly skewed, so the median might be a better measure of central tendency than the mean." 
                    : "The data is relatively symmetric, meaning the mean and median are close to each other."}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;
