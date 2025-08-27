import { useState, useEffect } from "react";
import Button from "./components/Button.jsx";
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
            console.error("Web Audio API is not supported in this browser");
        }
    }
    
    playStartSound();

    setIsGameOver(false);
    setIsGameRunning(true);
    setScore(0);
    setSequence([]);
    setPlayerSequence([]);
    setTimeout(() => addNewColorToSequence(), 100);
  };

  const addNewColorToSequence = () => {
    const newColor = colorButtons[getRandomNumber(3)];
    setSequence((prevSequence) => [...prevSequence, newColor]);
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
      setTimeout(() => {
        setIsGameOver(false);
      }, 2000);
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
      await timeOut(300);
      const color = sequence[i];
      playSound(color);
      const originalColors = [...colorButtons];
      const colorIndex = originalColors.indexOf(color);
      originalColors[colorIndex] = color + " flash";
      setColorButtons(originalColors);
      await timeOut(500);
      setColorButtons(["blue", "green", "yellow", "red"]);
    }
    setIsPlayerTurn(true);
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
      <div className="App-header">
        <div className="simon-wrapper">{SimonButtons}</div>
        <div className="game-controls">
          <button className="start-button" onClick={handleStart}>
            <div className="score">
              <div className="lcd-line">
                <span className="lcd-label">
                  {isGameOver ? "SYSTEM" : isGameRunning ? "SCORE" : "SIMON"}
                </span>
              </div>
              <div className="lcd-line">
                {isGameOver ? (
                  <span className="lcd-main-text failed">FAILED</span>
                ) : isGameRunning ? (
                  <span className="lcd-main-text score-digits">{String(score).padStart(3, '0')}</span>
                ) : (
                  <span className="lcd-main-text">START</span>
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
