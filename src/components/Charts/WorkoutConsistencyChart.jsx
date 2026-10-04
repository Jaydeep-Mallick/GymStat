import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { parseISO, subDays, format, startOfDay, endOfDay } from 'date-fns';

const WorkoutConsistencyChart = ({ workouts }) => {
  if (!workouts || workouts.length === 0) return <div className="p-4 text-center text-gray-500">No workout data available</div>;

  const data = [];
  const today = new Date();

  // Calculate rolling 7-day sum for the last 14 days
  for (let i = 13; i >= 0; i--) {
    const currentEnd = endOfDay(subDays(today, i));
    const currentStart = startOfDay(subDays(currentEnd, 6)); // 7-day window

    const workoutsInWindow = workouts.filter(w => {
      const d = parseISO(w.date);
      return d >= currentStart && d <= currentEnd;
    }).length;

    data.push({
      name: format(currentEnd, 'EEE, MMM d'), // e.g., Mon, Oct 2
      workouts: workoutsInWindow,
      fullDate: format(currentEnd, 'EEEE, MMMM do, yyyy')
    });
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis 
            dataKey="name" 
            interval={0}
            angle={-45}
            textAnchor="end"
            tick={{ fill: 'var(--text-color)', fontSize: 10 }} 
            axisLine={{ stroke: 'var(--border-color)' }}
            tickLine={false}
          />
          <YAxis 
            allowDecimals={false}
            tick={{ fill: 'var(--text-color)', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            cursor={{ fill: 'var(--border-color)', opacity: 0.4 }}
            contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-color)', borderRadius: '8px' }}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate || label}
          />
          <Bar 
            dataKey="workouts" 
            fill="#aa3bff" 
            radius={[4, 4, 0, 0]}
            name="7-Day Total (Summary)"
            maxBarSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkoutConsistencyChart;
