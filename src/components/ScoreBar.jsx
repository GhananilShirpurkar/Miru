import React from 'react';

export function ScoreBar({ score }) {
  const displayScore = score ? Number(score).toFixed(1) : 'N/A';
  const fillPercentage = score ? Math.min(Math.max((Number(score) / 10) * 100, 0), 100) : 0;

  return (
    <div className="score-bar-container">
      <div className="score-bar-track" aria-label={`Score: ${displayScore} out of 10`}>
        <div 
          className="score-bar-fill" 
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
      <div className="score-bar-value">{displayScore}</div>
    </div>
  );
}

export default ScoreBar;
