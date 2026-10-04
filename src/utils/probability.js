import * as ss from 'simple-statistics';
import jStat from 'jstat';
import { parseISO, subDays, startOfDay, endOfDay, differenceInDays } from 'date-fns';

export const calculateWeeklyWorkoutProbability = (workouts, goal) => {
  if (!workouts || workouts.length === 0) return { prob: null, message: "Not enough data yet." };

  const sortedDates = workouts.map(w => parseISO(w.date)).sort((a, b) => a - b);
  const firstWorkoutDate = startOfDay(sortedDates[0]);
  const today = endOfDay(new Date());
  
  const totalDays = differenceInDays(today, firstWorkoutDate) + 1;
  
  if (totalDays < 7) return { prob: null, message: "Need at least 7 days of data." };

  let daysMeetingGoal = 0;
  let totalEvaluatedDays = 0;

  // For every day from the 7th day of their journey up to today
  for (let i = 0; i <= totalDays; i++) {
    const currentEnd = endOfDay(subDays(today, i));
    const currentStart = startOfDay(subDays(currentEnd, 6));

    if (currentEnd < firstWorkoutDate) break;

    const workoutsInWindow = workouts.filter(w => {
      const d = parseISO(w.date);
      return d >= currentStart && d <= currentEnd;
    }).length;

    if (workoutsInWindow >= goal) {
      daysMeetingGoal++;
    }
    totalEvaluatedDays++;
  }

  const probability = daysMeetingGoal / totalEvaluatedDays;

  return {
    prob: probability,
    totalWeeks: totalEvaluatedDays,
    successWeeks: daysMeetingGoal,
    message: `Based on your ${totalEvaluatedDays} rolling 7-day windows, you met your goal of ${goal} workouts ${daysMeetingGoal} times.`
  };
};

// Calculate probability from Normal Distribution (Z-score)
export const calculateNormalProbability = (dataArray, targetValue, type = 'greater') => {
    if (dataArray.length < 2) return null;
    
    const mean = ss.mean(dataArray);
    const stdDev = ss.standardDeviation(dataArray);
    
    if (stdDev === 0) return null;

    const zScore = (targetValue - mean) / stdDev;
    
    // jStat.normal.cdf gives probability P(X < x)
    const pLess = jStat.normal.cdf(targetValue, mean, stdDev);
    
    if (type === 'less') {
        return { prob: pLess, zScore, mean, stdDev };
    } else {
        return { prob: 1 - pLess, zScore, mean, stdDev };
    }
};

// Conditional Probability
// P(A | B) = P(A and B) / P(B)
// Example: Probability of weight gain given met workout goal
export const calculateConditionalProbability = (workouts, measurements, workoutGoal) => {
    // We need week-by-week pairing of workouts and weight changes
    if (workouts.length === 0 || measurements.length < 2) return null;
    
    const weeks = {}; // { 'YYYY-W': { workoutCount: 0, startWeight: null, endWeight: null } }
    
    // ... logic for more complex probability if needed, kept simple for now
    return null; 
};
