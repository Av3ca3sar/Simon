import { useState } from "react";
import { useEffect } from "react";
import Button from "./components/Button.jsx";
import "./App.css";
import timeOut from "./utils/TimeOut.jsx";
import getRandomNumber from "./utils/GetRandomNumber.jsx";

function App() {
  const [player, setPlayer] = useState(false);
  const [flashedColors, setFlashedColors] = useState([]);
  const [playOn, setPlayOn] = useState(false);
  const [colorButton, setColorButton] = useState([
    "blue",
    "green",
    "yellow",
    "red",
  ]);


  async function flashButton(color, ind) {
    if (playOn === true && player === true) {
      const colorList = ["blue", "green", "yellow", "red"];
      const newColor = colorButton[ind];
      setFlashedColors([...flashedColors, newColor]);
      const flashedColor = colorList[ind] + " flash";
      colorList[ind] = flashedColor;
      setColorButton([...colorList]);
      await timeOut(300);
      colorList[ind] = color;
      setColorButton([...colorList]);
    }
  }


  // async function flashearButtons() {
  //   if (playOn === true) {
  //     const number = getRandomNumber(3);
  //     const newColor = colorButton[number];
  //     const coloresFlasheados=[...flashedColors]
  //     await setFlashedColors((prevColors) => [...prevColors, newColor]);
  //     console.log("newColor dentro funcion " + newColor);
  //     console.log("flashedColors dentro funcion " + flashedColors);
  //     const colorList = ["blue", "green", "yellow", "red"];
  //     let colorNumber;
  //     for (const color of flashedColors) {
  //       if (color === "blue") colorNumber = 0;
  //       if (color === "green") colorNumber = 1;
  //       if (color === "yellow") colorNumber = 2;
  //       if (color === "red") colorNumber = 3;
  //       const flashedColor = colorList[colorNumber] + " flash";
  //       colorList[colorNumber] = flashedColor;
  //       setColorButton([...colorList]);
  //       await timeOut(700);
  //       colorList[colorNumber] = color;
  //       setColorButton([...colorList]);
  //     }
  //   }
  // }

  const flashearButtons = () => {
    if (playOn) {
      const number = getRandomNumber(3);
      const newColor = colorButton[number];
  
      setFlashedColors(prevColors => {
        const updatedColors = [...prevColors, newColor];
        setTimeout(() => {
          setFlashedColors(updatedColors.slice(0, -1));
        }, 700);
  
        return updatedColors;
      });
  
      setTimeout(() => {
        if (playOn) {
          flashearButtons(); // Continue the sequence
        }
      }, 1400);
    }
  };
  
  
  



  useEffect(() => {
    console.log("flashedColors", flashedColors);
  }, [flashedColors]);

  useEffect(() => {
    if (player === false) {
      flashearButtons();
    }
  }, [player]);

  const SimonButtons = colorButton.map((color, index) => (
    <Button
      btnColor={color}
      key={index}
      index={index}
      flashButton={() => flashButton(color, index)}
    />
  ));

  const ScoreDisplay = () => {
    const handleStartClick = async () => {
      if (flashedColors.length === 0) {
        setPlayOn(true);
        await flashearButtons();
      }
    };

    return (
      <button className="start-button" onClick={handleStartClick}>
        {playOn ? flashedColors.length : "Start"}
      </button>
    );
  };

  return (
    <div className="App">
      <div className="App-header">
        <div className="simon-wrapper">{SimonButtons}</div>
        <ScoreDisplay />
      </div>
    </div>
  );
}

export default App;
