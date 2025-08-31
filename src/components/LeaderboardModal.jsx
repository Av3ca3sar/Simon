import React from 'react';
import './LeaderboardModal.css';

const LeaderboardModal = ({ scores, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content leaderboard-modal">
        <h2>Inquer@s</h2>
        <ol>
          {scores.map((score, index) => (
            <li key={index}>
              <span>{score.name}</span>
              <span>{score.score}</span>
            </li>
          ))}
        </ol>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default LeaderboardModal;
