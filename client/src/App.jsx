import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Searchbar from './Searchbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='MainPage'>
        {/* Searchbar */}
        <div className="Navbar">   
          <h1>[Website name]</h1>
        
          {/* This will hold the search boxes */}
          <Searchbar/>

        </div>

        {/* Display data */}
        <div className="Body">
          
        </div>
      
      </div>
    </>
  )
}

export default App
