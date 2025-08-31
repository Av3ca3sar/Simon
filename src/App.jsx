import { useState, useEffect } from "react";
import Button from "./components/Button.jsx";
import GameOverModal from "./components/GameOverModal.jsx";
import "./App.css";
import timeOut from "./utils/TimeOut.jsx";
import getRandomNumber from "./utils/GetRandomNumber.jsx";

// --- Sound Generation ---
let audioContext = null;

const playSound = (color) => {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  const frequencies = {
    blue: 261.63, // C4
    green: 329.63, // E4
    yellow: 392.00, // G4
    red: 523.25, // C5
  };

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(frequencies[color] || 440, audioContext.currentTime);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.4);
};

const playErrorSound = () => {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(98, audioContext.currentTime); // Lower pitch (G2)
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.2); // Longer duration

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 1.2); // Longer duration
};

const playStartSound = () => {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime); // G5
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
};


function App() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [flashSpeed, setFlashSpeed] = useState(800); // Initial speed for flashing
  const [colorButtons, setColorButtons] = useState([
    "blue",
    "green",
    "yellow",
    "red",
  ]);

  const handleStart = () => {
    if (isGameRunning && isPlayerTurn) return;
    
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error("La API de Web Audio no es compatible con este navegador");
        }
    }
    
    playStartSound();

    setIsGameOver(false);
    setIsGameRunning(true);
    setIsPlayerTurn(false); // Reset player turn state
    setScore(0);
    setSequence([]);
    setPlayerSequence([]);
    setFlashSpeed(800); // Reset speed on new game
    setColorButtons(["blue", "green", "yellow", "red"]); // Ensure buttons are reset
    setTimeout(() => addNewColorToSequence(), 1000); // Increased delay
  };

  const addNewColorToSequence = () => {
    const newColor = colorButtons[getRandomNumber(3)];
    setSequence((prevSequence) => {
      const updatedSequence = [...prevSequence, newColor];
      // Decrease flash speed as sequence length increases, but not below a minimum
      setFlashSpeed(prevSpeed => Math.max(150, prevSpeed - 60)); // Adjust speed decrement as needed
      return updatedSequence;
    });
  };

  const flashPlayerButton = async (color) => {
    playSound(color);
    const originalColors = [...colorButtons];
    const colorIndex = originalColors.indexOf(color);
    if (colorIndex === -1) return;

    originalColors[colorIndex] = color + " flash";
    setColorButtons(originalColors);
    await timeOut(300);
    setColorButtons(["blue", "green", "yellow", "red"]);
  };

  const handlePlayerInput = async (color) => {
    if (!isPlayerTurn || isGameOver) return;

    const newPlayerSequence = [...playerSequence, color];
    
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      playErrorSound();
      await flashPlayerButton(color);
      setPlayerSequence([]);
      setIsGameOver(true);
      setIsGameRunning(false);
      return;
    }
    
    await flashPlayerButton(color);
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence.length === sequence.length) {
      setScore(score + 1);
      setIsPlayerTurn(false);
      setPlayerSequence([]);
      await timeOut(1000);
      addNewColorToSequence();
    }
  };

  const flashColors = async () => {
    setIsPlayerTurn(false);
    for (let i = 0; i < sequence.length; i++) {
      await timeOut(flashSpeed / 2); // Delay before flashing, half of flashSpeed
      const colorToFlash = sequence[i];
      playSound(colorToFlash);

      // Apply flash class
      setColorButtons(prevColors => prevColors.map(c => c === colorToFlash ? c + " flash" : c));

      await timeOut(flashSpeed); // Duration of flash

      // Remove flash class
      setColorButtons(["blue", "green", "yellow", "red"]);
    }
    setIsPlayerTurn(true);
  };

  const handleSaveScore = async (name, score) => {
    const soundSequence = ["yellow", "green", "red"];
    for (const color of soundSequence) {
      playSound(color);
      await timeOut(400);
    }
    console.log("Guardando puntuación:", { name, score });
    setIsGameOver(false); // Close the modal
  };

  useEffect(() => {
    if (isGameRunning && !isPlayerTurn && sequence.length > 0) {
      flashColors();
    }
  }, [sequence, isGameRunning]);


  const SimonButtons = colorButtons.map((color, index) => (
    <Button
      btnColor={color}
      key={index}
      flashButton={() => handlePlayerInput(color)}
    />
  ));

  return (
    <div className="App">
      {isGameOver && <GameOverModal score={score} onSave={handleSaveScore} onRetry={handleStart} />}
      <div className="App-header">
        <div className="simon-wrapper">{SimonButtons}</div>
        <div className="game-controls">
          <button className="start-button" onClick={handleStart}>
            <div className="score">
              <div className="lcd-line">
                <span className="lcd-label">
                  {isGameRunning ? "PUNTOS" : "SIMON"}
                </span>
              </div>
              <div className="lcd-line">
                {isGameRunning ? (
                  <span className="lcd-main-text score-digits">{String(score).padStart(3, '0')}</span>
                ) : (
                  <span className="lcd-main-text">INICIAR</span>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
