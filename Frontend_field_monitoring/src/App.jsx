import { BrowserRouter } from 'react-router-dom'
import Index from './Components/Routes'
import AppProviders from './Context/AppProviders'

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Index/>
      </BrowserRouter>
    </AppProviders>
  )
}

export default App
