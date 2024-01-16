import { useState } from 'react'
import Button from './components/Button.jsx'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const colorList= ["blue", "green", "yellow", "red"]

  
  
  function handleClick(color) {
    console.log(`Clicked on ${color}`);
  }


  return (
    <div className='App'>
      <div className='App-header'>
        <div className='simon-wrapper'>
          {colorList.map((color,index) => {
            return(
              <Button 
              btnColor={color} 
              key={index}
              flash="flash"
              index={index}
              onClick={(event) => handleClick(color)}
              />)}
              )
          }
        </div>
      </div>
    </div>
  )
}

export default App
