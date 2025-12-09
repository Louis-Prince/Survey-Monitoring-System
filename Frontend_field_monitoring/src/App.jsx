import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Home from './Pages/home'
import { BrowserRouter } from 'react-router-dom'
import Index from './Components/Routes'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Index/>
    </BrowserRouter>
  )
}

export default App
