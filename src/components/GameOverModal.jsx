import React, { useState } from "react";
import "./GameOverModal.css";

const GameOverModal = ({ score, onSave, onRetry }) => {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (name.trim()) {
      onSave(name, score);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Vamooos!!</h2>
        <p>Puntos: {score}</p>
        <input
          type="text"
          placeholder="nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="modal-buttons">
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onRetry}>Reintentar</button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
