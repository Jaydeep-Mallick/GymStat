import * as ss from 'simple-statistics';

export const calculateSimpleRegression = (x, y) => {
    if (!x || !y || x.length !== y.length || x.length < 2) return null;

    const validPairs = x.map((xv, i) => [xv, y[i]]).filter(pair => 
        typeof pair[0] === 'number' && !isNaN(pair[0]) &&
        typeof pair[1] === 'number' && !isNaN(pair[1])
    );
    
    if (validPairs.length < 2) return null;

    const regressionLine = ss.linearRegression(validPairs);
    const regressionLineFunc = ss.linearRegressionLine(regressionLine);
    
    // Calculate R-squared
    const rSquared = ss.rSquared(validPairs, regressionLineFunc);

    return {
        m: regressionLine.m,
        b: regressionLine.b,
        rSquared,
        predict: (newX) => regressionLineFunc(newX),
        equation: `y = ${regressionLine.m.toFixed(3)}x + ${regressionLine.b.toFixed(3)}`
    };
};
