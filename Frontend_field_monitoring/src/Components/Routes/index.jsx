import { Routes, Route } from 'react-router-dom'
import Home from '../../Pages/home'

export default function Index() {
  return (
    <Routes>
        <Route path='/' Component={Home}/>
    </Routes>
  )
}
