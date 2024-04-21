import logo from './logo.svg';
import './App.css';
import MapComponent from './components/Map_component';
import NavBar from './components/Navbar'
import { useState } from 'react';
function App() {
  const [pathCoords, setPathCoords]=useState({
      start:{
        lat:26.862,
        lng:75.810
      },
      dest:{
         lat:26.9855, 
         lng:75.8513
      }
  });

  return (
    <div className="App">
      <NavBar  pathCoords={pathCoords} setPathCoords={setPathCoords}/>
      <div className="map">
        <MapComponent   pathCoords={pathCoords}/>
      </div>
    </div>
  );
}

export default App;