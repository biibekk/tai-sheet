// import './App.css'
import AuthPage from './components/login'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
      <Navbar />
      <select className='student-category-selection' style={{ display: 'none' }}></select>
      <button className='search-student-category-btn' style={{ display: 'none', marginTop: '10px' }}> Search</button>
      <div className='search-student-category-result' style={{ display: 'none' }}></div>
      <div className="infodisplay"></div>
      <AuthPage />
    </>
  )
}

export default App
