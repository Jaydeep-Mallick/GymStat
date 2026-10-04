import * as ss from 'simple-statistics';

export const calculateCorrelation = (x, y) => {
    if (!x || !y || x.length !== y.length || x.length < 2) return null;
    
    // Filter out pairs with invalid data
    const validPairs = x.map((xv, i) => [xv, y[i]]).filter(pair => 
        typeof pair[0] === 'number' && !isNaN(pair[0]) &&
        typeof pair[1] === 'number' && !isNaN(pair[1])
    );
    
    if (validPairs.length < 2) return null;
    
    const validX = validPairs.map(p => p[0]);
    const validY = validPairs.map(p => p[1]);

    const r = ss.sampleCorrelation(validX, validY);
    const cov = ss.sampleCovariance(validX, validY);
    
    let strength = "No relationship";
    const absR = Math.abs(r);
    if (absR >= 0.7) strength = "Strong";
    else if (absR >= 0.3) strength = "Moderate";
    else if (absR > 0) strength = "Weak";
    
    const direction = r > 0 ? "positive" : (r < 0 ? "negative" : "");
    
    return {
        r,
        covariance: cov,
        description: `${strength} ${direction} relationship`,
        data: validPairs.map(p => ({ x: p[0], y: p[1] }))
    };
};
