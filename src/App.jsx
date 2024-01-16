import { useState } from 'react'
import { useEffect } from 'react'
import Button from './components/Button.jsx'
import viteLogo from '/vite.svg'
import './App.css'
import timeOut from './utils/TimeOut.jsx'

function App() {

  // const colorList= ["blue", "green", "yellow", "red"];
  const [colorButton, setColorButton]= useState(["blue", "green", "yellow", "red"])

  // useEffect(() => {
  //   console.log("color en posicion 0 " + colorList[0])
  // }
  // ,[])
  

  //  // Example of using the delay utility function
  //  async function example() {
  //   console.log('Start of the code');
  
  //   // Introduce a delay of 2000 milliseconds (2 seconds)
  //   await delay(2000);
  
  //   console.log('After 2 seconds');
  
  //   // Introduce another delay of 3000 milliseconds (3 seconds)
  //   await delay(3000);
  
  //   console.log('After another 3 seconds');
  // }
  
  // // Call the example function to see the delays in action
  // example();
  
  
  
  async function flashButton(color,ind) {
    const colorList=["blue", "green", "yellow", "red"]
    const flashedColor=colorList[ind]+" flash"
    colorList[ind]= flashedColor;
    
    setColorButton([...colorList])
    await timeOut(1000)
    colorList[ind]= color;
    setColorButton([...colorList])
    
  }
  // const diceElements = dice.map(die => (
  //   <Die 
  //       key={die.id} 
  //       value={die.value} 
  //       isHeld={die.isHeld} 
  //       holdDice={() => holdDice(die.id)}
  //   />


  const simonButtons = colorButton.map((color,index) => (
    <Button
      btnColor={color}
      key={index}
      index={index}
      // key={color.id}
      // flash="flash"
      // key={die.id} 
      // value={die.value} 
      // isHeld={die.isHeld} 
      flashButton={() => flashButton(color,index)}
    />
  ))


  {/* {colorList.map((color,index) => {
    return(
      <Button 
      btnColor={color} 
      flash="flash"
      key={index}
      index={index}
      onClick={() => handleClick(index)}
      />)}
      )
  } */}

  return (
    <div className='App'>
      <div className='App-header'>
        <div className='simon-wrapper'>
          {simonButtons}
        </div>
      </div>
    </div>
  )
}

export default App
