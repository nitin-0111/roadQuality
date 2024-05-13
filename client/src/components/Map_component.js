import React, { useEffect, useRef, useState } from 'react';
import * as turf from '@turf/turf';
import Button from '@mui/material/Button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine'; // Import Leaflet Routing Machine
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import routing machine CSS
import { roadData } from '../tmp_dataSet/DataSet';
import './MapComponent.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BallTriangle } from 'react-loader-spinner'
import redMarkerIcon from './red_marker.png';
import ride from './ride.png';
import { BaseURL } from '../env';

import { Howl } from 'howler';


const myMarker = L.icon({
  iconUrl: redMarkerIcon,
  iconSize: [38, 38],
  iconAnchor: [19, 38], // Adjusted iconAnchor
  popupAnchor: [0, -38], // Adjusted popupAnchor if necessary
});
var taxiIcon = L.icon({
  iconUrl: ride,
  iconSize: [38, 38],
  iconAnchor: [19, 38], // Adjusted iconAnchor
  popupAnchor: [0, -38], // Adjusted popupAnchor if necessary
})

const baseLayers = {
  GoogleHybrid: L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  }),
  GoogleSatellite: L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  }),

  GoogleStreets: L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  }),
  GoogleTerrain: L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  })

};


const MapComponent = ({ pathCoords, isLoading, setLoading }) => {
  const mapRef = useRef(null);
  const [selectedLayer, setSelectedLayer] = useState('GoogleHybrid');
  const [currLocation, setCurrLocation] = useState([26.862, 75.810]);
  const [curAccuracy, setAccuracy] = useState(0);
  const [markerDisplayed, setMarkerDisplayed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [routingControl, setRoutingControl] = useState(null);
  const [circleBoundary, setCircleBoundary] = useState(null);
  const [locationMarker, setLocationMarker] = useState(null);
  const [distance, setDistance] = useState(100000);
  const [potholes, setPotholes] = useState([]);

  // const [potholes, setPotholes] = useState([{ lat: 26.862664103230202, lng: 75.82017390573363 }]);
  const [potholesPoint, setPotholesPoint] = useState([]);
 
  let polyline = [];

  // const notify = () => toast('User location obtained!', { type: 'success' });




  const getUserLocation = () => {

    if ('geolocation' in navigator) {
      const watchID = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setCurrLocation([latitude, longitude]);
          setAccuracy(position.coords.accuracy)
          // console.log("Accuracy in location ", curAccuracy);
          setShowNotification(true);
          if (markerDisplayed) {
            updateMarkerPosition([latitude, longitude]);
          }
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
      return watchID;
    } else {
      console.error('Geolocation is not supported by your browser.');
      return null
    }
  };
  const updateMarkerPosition = (newPosition) => {
    const map = mapRef.current;
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.setLatLng(newPosition); // Update marker position
        layer._icon.style.transition = 'transform 0.01s'; // Apply smooth transition
      }
    });
    if (circleBoundary) {
      map.removeLayer(circleBoundary);
      setCircleBoundary(null);
    }
    const circle = L.circle(newPosition, {
      color: 'blue',
      fillColor: '#add8e6',
      fillOpacity: 0.5,
      radius: 7,
    }).addTo(map);
    setCircleBoundary(circle);

    const markerIcon = document.querySelector('.leaflet-marker-icon');
    if (markerIcon) {
      markerIcon.style.transition = 'transform 0.5s ease-out';
    }

  };

  const getLabelsFromBackend = async (route) => {
    try {
      const res = await axios.post(BaseURL + '/sendData', { route })
      // await getAllPotholes();
      // console.log("gelabed=>", res.data.potholes);
      return res.data;
    } catch (error) {
      console.error("Error fetching labels:", error);
      throw error;
    }
  }





  useEffect(() => {

    if (!mapRef.current) {
      const map = L.map('map').setView(currLocation, 18);
      mapRef.current = map;

      const selectedLayerObj = baseLayers[selectedLayer];
      selectedLayerObj.addTo(map);


      const handleChangeLayer = (event) => {
        const selected = event.target.value;
        const selectedLayer = baseLayers[selected];
        map.eachLayer((layer) => {
          map.removeLayer(layer);
        });
        selectedLayer.addTo(map);
      };

      const dropdown = L.control.layers(baseLayers).addTo(map);
      if (markerDisplayed) {
        const circle = L.circle(currLocation, {
          color: 'blue',
          fillColor: '#add8e6',
          fillOpacity: 0.5,
          radius: 7
        }).addTo(map);
        setCircleBoundary(circle);
      } else {
        if (circleBoundary) {
          map.removeLayer(circleBoundary);
          setCircleBoundary(null);
        }
      }
      const routingControl = L.Routing.control({
        waypoints: [],

        lineOptions: {
          styles: [
            {
              color: 'lightblue',
              opacity: 0.1,
              weight: 6
            }
          ]
        },
        createMarker: function (i, waypoint, n) {
          if (i === 0 || i === n - 1) {

            return L.marker(waypoint.latLng, {
              icon: myMarker
            });
          }
        }
      })
        .on('routesfound', async function (e) {
          try {

            // const labeledRoutes = await getLabelsFromBackend(e.routes[0]);
            const route = e.routes[0];
            const hLabled = await axios.post(BaseURL + "/hlabel", { route });
            setLoading(false)
            // console.log("labeled", labeledRoutes);
            // await mapLabels(labeledRoutes);
            await mapLabels(hLabled.data);
            await moveLocation(hLabled.data);


          } catch (error) {
          }

        }).addTo(map);
      setRoutingControl(routingControl)
    }
  }, [selectedLayer, currLocation]);

  useEffect(() => {
    if (routingControl) {
      const map = mapRef.current;
      // map.eachLayer((layer) => {
      //   if (layer instanceof L.Marker) {
      //     map.removeLayer(layer);
      //   }

      // });
      const { start, dest } = pathCoords;
      routingControl.setWaypoints([L.latLng(start.lat, start.lng), L.latLng(dest.lat, dest.lng)]);
    }
  }, [pathCoords, routingControl]);



  const moveLocation = async (route) => {
    const map = mapRef.current;
    const { coordinates } = route;

    let taxiMarker = L.marker(coordinates[0], { icon: taxiIcon, opacity: 0 }).addTo(map);
    taxiMarker.setOpacity(1);

    let showNotification = false;

    for (let i = 1; i < coordinates.length; i++) {
      const { lat, lng, label } = coordinates[i];
      const coordinate = L.latLng(lat, lng);

      taxiMarker.setLatLng(coordinate);

      if (label === 1 && !showNotification) {
        playNotificationSound1();
        showNotification = true;
      } else if (label !== 1 && showNotification) {
        showNotification = false;
      }

      await new Promise(resolve => setTimeout(resolve, 800));
    }
  };



  const mapLabels = async (labeledRoutes) => {
    // console.log("segment",labeledRoutes);
    const map = mapRef.current;
    polyline.forEach(pl => map.removeLayer(pl));
    const getColors = ['#15ab4e', '#ab1515', '#85827a'];


    const route = labeledRoutes
    let segmentCoordinates = [];
    let segmentColor = getColors[route.coordinates[0].label];

    route.coordinates.forEach(coord => {
      const color = getColors[coord.label];

      if (color !== segmentColor) {
        if (segmentCoordinates.length > 1) {
          console.log("segment ");
          const pl = L.polyline(segmentCoordinates, { color: segmentColor, zIndexOffset: 100, weight: 8, opacity: 0.7 }).addTo(map);
          polyline.push(pl);
        }
        segmentCoordinates = [];
        segmentColor = color;
      }

      segmentCoordinates.push([coord.lat, coord.lng]);
    });

    if (segmentCoordinates.length > 1) {
      console.log("segment 1", segmentCoordinates, segmentColor);
      const pl = L.polyline(segmentCoordinates, { color: segmentColor, zIndexOffset: 100, weight: 10, opacity: 1 }).addTo(map);
      polyline.push(pl);
    }
    setLoading(false);

  };


  // useEffect(() => {
  //   const checkForPothole = async () => {
  //     if (currLocation) {
  //       const userPoint = turf.point(currLocation);

  //       potholes.forEach((pothole) => {
  //         const potholePoint = turf.point([pothole.lat, pothole.lng]);
  //         const distance = turf.distance(userPoint, potholePoint, { units: 'meters' });
  //         console.log("distance", distance);
  //         if (distance <= 40 && !showNotification) {
  //           playNotificationSound1();
  //           setDistance(distance);
  //           setShowNotification(true);
  //           return;// Update state to indicate sound has been played for this pothole
  //         } else if (distance > 40) {
  //           // Reset soundPlayed state if user moves away from the pothole
  //           setShowNotification(false);
  //           return;
  //         }
  //       });
  //     }
  //   };

  //   const watchID = getUserLocation();
  //   checkForPothole();

  //   return () => {
  //     if (watchID) {
  //       navigator.geolocation.clearWatch(watchID);
  //     }
  //   };
  // }, [currLocation, potholes]);





  const handleAddMarker = () => {
    const map = mapRef.current;

    if (!markerDisplayed) {
      const marker = L.marker(currLocation, { icon: myMarker });
      marker.bindPopup(`current location ${curAccuracy}`).openPopup().addTo(map);
      setMarkerDisplayed(true);
      setLocationMarker(marker);
      if (circleBoundary) {
        map.removeLayer(circleBoundary);
        setCircleBoundary(null);
      }
      const circle = L.circle(currLocation, {
        color: 'blue', // Light blue color
        fillColor: '#add8e6', // Light blue color
        fillOpacity: 0.5,
        radius: 7 // Adjust the radius as needed
      }).addTo(map);
      setCircleBoundary(circle);


    } else {
      // map.eachLayer((layer) => {
      //   if (layer instanceof L.Marker) {
      //     map.removeLayer(layer);
      //   }

      // });
      if (locationMarker) {
        map.removeLayer(locationMarker);
        setLocationMarker(null);
      }
      setMarkerDisplayed(false);
      if (circleBoundary) {
        map.removeLayer(circleBoundary);
        setCircleBoundary(null);
      }

    }
  };
  useEffect(() => {
    // Function to add pothole markers to the map
    const addPotholeMarkers = () => {
      const map = mapRef.current;

      // Clear previous pothole markers
      potholesPoint.forEach(marker => map.removeLayer(marker));
      setPotholesPoint([]);

      // Add new pothole markers
      potholes.forEach(point => {
        const marker = L.marker([point.lat, point.lng], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: '<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%;"></div>'
          })
        }).addTo(map);
        setPotholesPoint(prev => [...prev, marker]);
      });
    };

    // Call the function to add pothole markers when potholes state changes
    addPotholeMarkers();
  }, [potholes]);
  const getAllPotholes = async () => {
    try {
      const res = await axios.get(BaseURL + '/allPotholes');
      console.log("potholes ===> ", res.data);
      setPotholes(res.data);
    } catch (error) {
      console.error("Error fetching potholes:", error);
    }
  }


  const labelHandler = async () => {
    try {
      const res = await axios.get(BaseURL + '/label');
      console.log("res.data", res.data);
    } catch (error) {

    }
  }
  return (
    <>

      {/* <div className='contiainer'>
        <div className="loading-container">
          {isLoading ? (
            <BallTriangle
              height={100}
              width={100}
              radius={5}
              color="red"
              ariaLabel="ball-triangle-loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          ) : ( */}
      <div id="map" className='mapComponent'></div>
      {/* )}
        </div> */}

      <div style={{ display: 'flex', gap: '20px' }}>
        <button
          className={`marker-button ${markerDisplayed ? 'remove-marker' : 'add-marker'}`}
          onClick={handleAddMarker}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#3f51b5',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {markerDisplayed ? '- Remove Marker' : '+ Add Marker'}
        </button>
        <button
          onClick={labelHandler}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Update Labels
        </button>
        <button
          onClick={playNotificationSound1}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#f44336',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Sound Notification
        </button>
        <button
          onClick={getAllPotholes}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          All pothole

        </button>
      </div>

      {/* </div> */}
    </>
  );


};



const playNotificationSound1 = () => {
  toast.error('pothole !!!', {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",

  });
  const audio = new Audio('./sound.mp3');
  audio.volume = 0.7;
  audio.play();
};


// const updateMapWithRoutes=(labeledRoutes) => {

//   if(routingControl){
//     const se
//   }
// }

export default MapComponent;

/*
  const handleChangeLayer = (event) => {
        const selected = event.target.value;
        setSelectedLayer(selected);
        const selectedLayer = baseLayers[selected];
        map.eachLayer((layer) => {
          map.removeLayer(layer);
        });
        selectedLayer.addTo(map);
      };

      const dropdown = L.control.layers(baseLayers).addTo(map);
 */