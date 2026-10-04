import * as ss from 'simple-statistics';

export const calculateDescriptiveStats = (dataArray) => {
  if (!dataArray || dataArray.length === 0) return null;
  
  // Filter out invalid numbers
  const validData = dataArray.filter(v => typeof v === 'number' && !isNaN(v));
  if (validData.length === 0) return null;

  try {
    return {
      count: validData.length,
      mean: ss.mean(validData),
      median: ss.median(validData),
      mode: ss.mode(validData),
      min: ss.min(validData),
      max: ss.max(validData),
      range: ss.max(validData) - ss.min(validData),
      variance: validData.length > 1 ? ss.variance(validData) : 0,
      stdDev: validData.length > 1 ? ss.standardDeviation(validData) : 0,
      skewness: validData.length > 2 ? ss.sampleSkewness(validData) : null,
      q1: ss.quantile(validData, 0.25),
      q3: ss.quantile(validData, 0.75),
    };
  } catch (error) {
    console.error("Error calculating stats", error);
    return null;
  }
};

export const getFrequencyDistribution = (dataArray, bins = 5) => {
  if (!dataArray || dataArray.length === 0) return [];
  const min = ss.min(dataArray);
  const max = ss.max(dataArray);
  
  if (min === max) {
    return [{ bin: `${min}`, count: dataArray.length }];
  }

  const binSize = (max - min) / bins;
  const distribution = Array.from({ length: bins }, (_, i) => ({
    min: min + (i * binSize),
    max: min + ((i + 1) * binSize),
    count: 0
  }));

  dataArray.forEach(val => {
    for (let i = 0; i < bins; i++) {
      if (val >= distribution[i].min && (val < distribution[i].max || (i === bins - 1 && val <= distribution[i].max))) {
        distribution[i].count++;
        break;
      }
    }
  });

  return distribution.map(d => ({
    bin: `${d.min.toFixed(1)} - ${d.max.toFixed(1)}`,
    count: d.count
  }));
};
