import { useGym } from '../context/GymContext';
import StatCard from '../components/StatCard';
import { Weight, Calendar, Clock, Target } from 'lucide-react';
import WeightProgressChart from '../components/Charts/WeightProgressChart';
import WorkoutConsistencyChart from '../components/Charts/WorkoutConsistencyChart';

const Dashboard = () => {
  const { profile, settings, workouts, measurements } = useGym();

  const currentWeight = measurements?.length > 0 ? measurements[measurements.length - 1].weight : profile?.startWeight;
  const weightChange = currentWeight - (profile?.startWeight || 0);

  const avgDuration = workouts?.length > 0 
    ? Math.round(workouts.reduce((acc, curr) => acc + curr.duration, 0) / workouts.length) 
    : 0;

  // Calculate current week's workouts
  const now = new Date();
  const currentWeekWorkouts = workouts.filter(w => {
    const d = new Date(w.date);
    const diffTime = Math.abs(now - d);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7;
  }).length;

  const goalProgress = Math.min(Math.round((currentWeekWorkouts / (settings?.weeklyWorkoutGoal || 4)) * 100), 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Overview of your fitness journey.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Current Weight" 
          value={`${currentWeight?.toFixed(1)} ${settings?.units || 'kg'}`}
          trend={weightChange !== 0 ? weightChange.toFixed(1) : undefined}
          icon={Weight} 
        />
        <StatCard 
          title="Total Workouts" 
          value={workouts?.length || 0}
          icon={Calendar} 
        />
        <StatCard 
          title="Avg. Duration" 
          value={`${avgDuration} min`}
          icon={Clock} 
        />
        <StatCard 
          title="Weekly Goal" 
          value={`${currentWeekWorkouts} / ${settings?.weeklyWorkoutGoal}`}
          subtitle={`${goalProgress}% completed`}
          icon={Target} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Weight Progress</h3>
          <WeightProgressChart data={measurements} />
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Workout Consistency</h3>
          <WorkoutConsistencyChart workouts={workouts} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
