import logo from './logo.svg';
import './App.css';
import MapComponent from './components/Map_component';
import NavBar from './components/Navbar'
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  const [isLoading, setLoading] = useState(false);
  const [pathCoords, setPathCoords] = useState({
    start: {
      lat: 26.862,
      lng: 75.810
    },
    dest: {
      lat: 26.9855,
      lng: 75.8513
    }
  });

  return (
    <div className="App">
      <NavBar pathCoords={pathCoords} setPathCoords={setPathCoords} isLoading={isLoading} setLoading={setLoading} />
      <div className="map">
        <MapComponent pathCoords={pathCoords} isLoading={isLoading} setLoading={setLoading} />
      </div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"

      />
    </div>
  );
}

export default App;