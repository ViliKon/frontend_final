import './App.css'
import { Link, Outlet } from 'react-router-dom';

function App() {

  return (
    <div className="App">
      <nav>
        <Link to={"/"}> HOME </Link>
      
        <Link to={"/Customerlist"}> Customers </Link>

        <Link to={"/Traininglist"}> Trainings </Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default App
