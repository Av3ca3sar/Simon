import React from 'react';
import './Leaderboard.css';

const Leaderboard = ({ scores }) => {
  return (
    <div className="leaderboard-container">
      <h4>Inquer@s</h4>
      <ol className="leaderboard-list">
        {scores.map((score, index) => (
          <li key={index} className="leaderboard-item">
            <span className="leaderboard-name">{score.name}</span>
            <span className="leaderboard-score">{score.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
