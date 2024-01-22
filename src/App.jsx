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
      const coloresFlasheados = [...flashedColors]
      setFlashedColors([...coloresFlasheados, newColor]);
      const flashedColor = colorList[ind] + " flash";
      colorList[ind] = flashedColor;
      setColorButton([...colorList]);
      await timeOut(300);
      colorList[ind] = color;
      setColorButton([...colorList]);
      console.log("colores flasheados " + [flashedColors])
    }
  }

  async function flashearButtons() {
    console.log("lanzado " + flashedColors.length)
    if (playOn === true) {
      console.log("lanzado nuevo color " + flashedColors)
      const number = getRandomNumber(3);
      const newColor = colorButton[number];
      console.log("este es el nuevo color " + newColor)
      const coloresFlasheados = [...flashedColors, newColor]
      console.log("colores flasheados  " + [coloresFlasheados])


      const colorList = ["blue", "green", "yellow", "red"];
      let colorNumber;
      for (const color of coloresFlasheados) {
        if (color === "blue") colorNumber = 0;
        if (color === "green") colorNumber = 1;
        if (color === "yellow") colorNumber = 2;
        if (color === "red") colorNumber = 3;
        const flashedColor = colorList[colorNumber] + " flash";
        colorList[colorNumber] = flashedColor;
        console.log("color a flashear..." + flashedColor)
        setColorButton([...colorList]);
        await timeOut(700);
        colorList[colorNumber] = color;
        setColorButton([...colorList]);
      }
      console.log("colores Flasehados " + coloresFlasheados)
      setFlashedColors([coloresFlasheados]);
      console.log("este es el nuevo array al final flashedColors " + flashedColors)


    }
  }

  useEffect(() => {
    console.log("lanzado useEffect, el player es " + player)
    if (player === false) {
      flashearButtons();
      console.log("lanzado2")
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

      setPlayOn(true);
      await flashearButtons(); // Ensure that flashearButtons is awaited before checking length
      await flashearButtons(); // Ensure that flashearButtons is awaited before checking length
      await flashearButtons(); // Ensure that flashearButtons is awaited before checking length

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
        <div className="simon-wrapper">
          {SimonButtons}
        </div>
        <ScoreDisplay />
      </div>
    </div>
  );
}

export default App;
