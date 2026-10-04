import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const WeightProgressChart = ({ data }) => {
  if (!data || data.length === 0) return <div className="p-4 text-center text-gray-500">No data available</div>;

  const formattedData = data.map(d => ({
    ...d,
    displayDate: format(parseISO(d.date), 'MMM d')
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
          <XAxis 
            dataKey="displayDate" 
            tick={{ fill: 'var(--text-color)', fontSize: 12 }} 
            axisLine={{ stroke: 'var(--border-color)' }}
            tickLine={false}
          />
          <YAxis 
            domain={['dataMin - 1', 'dataMax + 1']} 
            tick={{ fill: 'var(--text-color)', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.toFixed(1)}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-color)', borderRadius: '8px' }}
            itemStyle={{ color: 'var(--text-color)' }}
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
            name="Weight (kg)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightProgressChart;
