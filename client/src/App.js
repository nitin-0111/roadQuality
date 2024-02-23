import logo from './logo.svg';
import './App.css';
import MapComponent from './components/Map_component';
import NavBar from './components/Navbar'
function App() {
  return (
    <div className="App">
      <NavBar />
      <div className="map">
        <MapComponent />
      </div>
    </div>
  );
}

export default App;
