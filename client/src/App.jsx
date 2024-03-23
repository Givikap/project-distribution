import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Searchbar from './Searchbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex flex-col bg-blue-200'>
        {/* Searchbar */}
        <div className="flex justify-between h-1/3 px-8">   
          <h1 className='text-6xl font-bold'>[Website name]</h1>
        
          {/* This will hold the search boxes */}
          <Searchbar/>

        </div>

        {/* Display data */}
        {/* <div className="h-1/2 w-full bg-red-500">
          <p>Hello</p>
        </div> */}
      
      </div>
    </>
  )
}

export default App
