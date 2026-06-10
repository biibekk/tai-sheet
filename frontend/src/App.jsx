import { useState } from 'react'
import Home from './components/home'

function App() {
  const token = localStorage.getItem("token");
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [page, setPage] = useState("home");

  return (
    <Home
      isLoggedIn={isLoggedIn}
      setIsLoggedIn={setIsLoggedIn}
      setPage={setPage}
    />
  );
}

export default App
