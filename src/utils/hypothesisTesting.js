import jStat from 'jstat';
import * as ss from 'simple-statistics';

export const performTwoSampleTTest = (sample1, sample2, alpha = 0.05) => {
    if (!sample1 || !sample2 || sample1.length < 2 || sample2.length < 2) return null;

    const n1 = sample1.length;
    const n2 = sample2.length;
    
    const mean1 = ss.mean(sample1);
    const mean2 = ss.mean(sample2);
    
    const var1 = ss.variance(sample1);
    const var2 = ss.variance(sample2);
    
    // Welch's t-test (unequal variances)
    const tStat = (mean1 - mean2) / Math.sqrt((var1/n1) + (var2/n2));
    
    // Degrees of freedom for Welch's
    const dfNum = Math.pow((var1/n1) + (var2/n2), 2);
    const dfDen = (Math.pow(var1/n1, 2) / (n1 - 1)) + (Math.pow(var2/n2, 2) / (n2 - 1));
    const df = dfNum / dfDen;
    
    // Two-tailed p-value
    // jStat.studentt.cdf(x, dof) gives cumulative probability up to x
    const pValue = 2 * (1 - jStat.studentt.cdf(Math.abs(tStat), df));
    
    const significant = pValue < alpha;

    return {
        mean1,
        mean2,
        tStat,
        df,
        pValue,
        alpha,
        significant,
        interpretation: significant ? 'Statistically significant change' : 'No significant change'
    };
};

export const calculateConfidenceInterval = (sample, confidenceLevel = 0.95) => {
    if (!sample || sample.length < 2) return null;
    
    const mean = ss.mean(sample);
    const stdErr = ss.standardDeviation(sample) / Math.sqrt(sample.length);
    
    // For 95%, alpha is 0.05, so 0.975 percentile
    const alpha = 1 - confidenceLevel;
    const tValue = jStat.studentt.inv(1 - alpha/2, sample.length - 1);
    
    const margin = tValue * stdErr;
    
    return {
        mean,
        lower: mean - margin,
        upper: mean + margin,
        confidenceLevel
    };
};
