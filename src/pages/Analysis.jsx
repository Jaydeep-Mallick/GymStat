import { useGym } from '../context/GymContext';
import { calculateWeeklyWorkoutProbability } from '../utils/probability';
import { calculateCorrelation } from '../utils/correlation';
import { calculateSimpleRegression } from '../utils/regression';
import { performTwoSampleTTest, calculateConfidenceInterval } from '../utils/hypothesisTesting';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';

const Analysis = () => {
  const { workouts, measurements, nutrition, settings } = useGym();

  // 1. Probability Analysis
  const workoutGoalProb = calculateWeeklyWorkoutProbability(workouts, settings?.weeklyWorkoutGoal || 4);

  // 2. Correlation & Regression (Calories vs Weight)
  const getCalsVsWeight = () => {
    // Basic align by date
    const paired = [];
    measurements.forEach(m => {
      const nut = nutrition.find(n => n.date === m.date);
      if (nut && nut.calories && m.weight) {
        paired.push({ calories: nut.calories, weight: m.weight });
      }
    });
    return paired;
  };
  
  const calsVsWeightData = getCalsVsWeight();
  const cals = calsVsWeightData.map(d => d.calories);
  const weights = calsVsWeightData.map(d => d.weight);
  
  const correlationResult = calculateCorrelation(cals, weights);
  const regressionResult = calculateSimpleRegression(cals, weights);
  
  // Scatter Plot Data formatting
  const scatterData = correlationResult?.data.map(p => ({ x: p.x, y: p.y })) || [];
  // For trend line
  const minCal = Math.min(...cals, 0);
  const maxCal = Math.max(...cals, 0);
  const trendLine = regressionResult ? [
    { x: minCal, y: regressionResult.predict(minCal) },
    { x: maxCal, y: regressionResult.predict(maxCal) }
  ] : [];

  // 3. Hypothesis Testing (Is recent weight significantly different from earlier weight?)
  const getHypothesisData = () => {
    if (measurements.length < 4) return null;
    const sorted = [...measurements].sort((a,b) => new Date(a.date) - new Date(b.date));
    const mid = Math.floor(sorted.length / 2);
    const earlier = sorted.slice(0, mid).map(m => m.weight).filter(w => w);
    const recent = sorted.slice(mid).map(m => m.weight).filter(w => w);
    return performTwoSampleTTest(earlier, recent);
  };
  const hypothesisResult = getHypothesisData();

  // 4. Estimation (Confidence Interval for workout duration)
  const durationSamples = workouts.map(w => w.duration).filter(d => d);
  const durationCI = calculateConfidenceInterval(durationSamples);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Progress Analysis</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Advanced insights using probability, correlation, and hypothesis testing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Probability Section */}
        <div className="card p-6 border-t-4 border-purple-500">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Workout Consistency Probability</h3>
          {workoutGoalProb.prob === null ? (
            <p className="text-gray-500 dark:text-gray-400">{workoutGoalProb.message}</p>
          ) : (
            <div>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {(workoutGoalProb.prob * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Probability of meeting your {settings?.weeklyWorkoutGoal}-workout weekly goal based on your historical data.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                {workoutGoalProb.message}
              </p>
            </div>
          )}
        </div>

        {/* Confidence Interval Section */}
        <div className="card p-6 border-t-4 border-blue-500">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Workout Duration Estimation</h3>
          {!durationCI ? (
            <p className="text-gray-500 dark:text-gray-400">Not enough data for estimation.</p>
          ) : (
            <div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {durationCI.mean.toFixed(1)} min
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                95% Confidence Interval: <span className="font-semibold">{durationCI.lower.toFixed(1)} – {durationCI.upper.toFixed(1)} min</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                Based on your recorded workouts, we are 95% confident your true average workout duration falls in this range.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Hypothesis Testing Section */}
      <div className="card p-6 border-t-4 border-orange-500">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Is my weight progress significant?</h3>
        {!hypothesisResult ? (
          <p className="text-gray-500 dark:text-gray-400">Need at least 4 weight measurements over time to perform this test.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Earlier Average: <span className="font-semibold">{hypothesisResult.mean1.toFixed(1)} {settings?.units}</span></p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">Recent Average: <span className="font-semibold">{hypothesisResult.mean2.toFixed(1)} {settings?.units}</span></p>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm"><span className="font-medium text-gray-900 dark:text-gray-200">Null Hypothesis (H₀):</span> There is no significant change.</p>
                <p className="text-sm"><span className="font-medium text-gray-900 dark:text-gray-200">Result (p-value = {hypothesisResult.pValue.toFixed(3)}):</span> <span className={hypothesisResult.significant ? "text-green-600 font-semibold" : "text-gray-600 font-semibold"}>{hypothesisResult.interpretation}</span></p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {hypothesisResult.significant 
                  ? "Your recent weight is significantly different from your earlier weight, indicating real progress beyond random fluctuation." 
                  : "The difference between your recent and earlier weight is not statistically significant yet. Keep training!"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Correlation & Regression Section */}
      <div className="card p-6 border-t-4 border-green-500">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Relationship: Calories vs Body Weight</h3>
        {!correlationResult ? (
          <p className="text-gray-500 dark:text-gray-400">Not enough overlapping data. Record nutrition and body weight on the same days.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                  <XAxis type="number" dataKey="x" name="Calories" domain={['dataMin - 100', 'dataMax + 100']} tick={{ fill: 'var(--text-color)' }} />
                  <YAxis type="number" dataKey="y" name="Weight" domain={['dataMin - 1', 'dataMax + 1']} tick={{ fill: 'var(--text-color)' }} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)' }} />
                  <Scatter name="Days" data={scatterData} fill="#10b981" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Correlation (r)</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{correlationResult.r.toFixed(3)}</p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">{correlationResult.description}</p>
              </div>
              
              {regressionResult && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Prediction Model</p>
                  <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">{regressionResult.equation}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">Statistical estimate based on your historical data. If you eat 2800 kcal, estimated weight trend is {regressionResult.predict(2800).toFixed(1)} {settings?.units}.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;
