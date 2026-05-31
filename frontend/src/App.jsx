// import './App.css'
import Navbar from './components/Navbar'

function App() {

  return (
    <>
      <Navbar />
      <select className='student-category-selection' style={{ display: 'none' }}></select>
      <button className='search-student-category-btn' style={{ display: 'none', marginTop: '10px' }}> Search</button>
      <div className='search-student-category-result' style={{ display: 'none' }}></div>
      <div className="infodisplay"></div>
    </>
  )
}

export default App
