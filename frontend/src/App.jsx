// import './App.css'
import { useState } from 'react'
import AuthPage from './components/authentication'
import Navbar from './components/Navbar'
import Home from './components/home'
function App() {
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [page, setPage] = useState("home");
  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setPage={setPage}
      />
      <select className='student-category-selection' style={{ display: 'none' }}></select>
      <button className='search-student-category-btn' style={{ display: 'none', marginTop: '10px' }}> Search</button>
      <div className='search-student-category-result' style={{ display: 'none' }}></div>
      <div className="infodisplay"></div>

      {/* {!isLoggedIn && (
        <AuthPage
          setIsLoggedIn={setIsLoggedIn}
        />
      )} */}

      {page === "home" && (
        <Home
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setPage={setPage}
        />
      )}
    </>
  )
}

export default App
