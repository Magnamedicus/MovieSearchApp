
import './css/App.css'
import { Route, Routes } from 'react-router-dom'
import MovieCard from "./components/MovieCard"
import NavBar from "./components/NavBar"
import Favorites from "./pages/Favorites"
import Home from "./pages/Home"
import { MovieProvider } from './contexts/MovieContext'
import { useState, useEffect} from 'react'

function App() {
  
  
  return (
  
  <MovieProvider>

    <NavBar />

    <div>

    <main className="main-content">
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/Favorites" element={<Favorites/>}/>
      </Routes>

    </main>
      

    </div>

  </MovieProvider>
    
  )
}




export default App
