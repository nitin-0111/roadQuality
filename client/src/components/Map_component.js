import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine'; // Import Leaflet Routing Machine
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'; // Import routing machine CSS
import { roadData } from '../tmp_dataSet/DataSet';
import './MapComponent.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import redMarkerIcon from './red_marker.png';
import ride from './ride.png';

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

const MapComponent = ({ pathCoords }) => {
  const mapRef = useRef(null);
  const [selectedLayer, setSelectedLayer] = useState('GoogleSatellite');
  const [currLocation, setCurrLocation] = useState([26.862, 75.810]);
  const [markerDisplayed, setMarkerDisplayed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [routingControl, setRoutingControl] = useState(null);
  const notify = () => toast('User location obtained!', { type: 'success' });

  useEffect(() => {
    const getUserLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrLocation([latitude, longitude]);
            setShowNotification(true);

            // axios
            //   .post(${process.env.REACT_APP_BASE_URL}/senddata, {
            //     latitude,
            //     longitude,
            //   })
            //   .then((response) => {
            //     console.log('Location added successfully:', response.data);
            //   })
            //   .catch((error) => {
            //     console.error('Error adding location:', error);
            //   });


          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by your browser.');
      }
    };

    getUserLocation();

    const baseLayers = {
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
      }),
      GoogleHybrid: L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }),
    };

    if (!mapRef.current) {
      const map = L.map('map').setView(currLocation, 18);
      mapRef.current = map;

      const selectedLayerObj = baseLayers[selectedLayer];
      selectedLayerObj.addTo(map);

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

      const addQuality = () => {
        const colors = {
          0: 'lightgreen',
          1: 'red',
        };

        roadData.forEach((segment) => {
          const { longitude_s, longitude_e, latitude_s, latitude_e, quality_label } = segment;

          const coordinates = [
            [latitude_s, longitude_s],
            [latitude_e, longitude_e],
          ];

          const color = colors[quality_label];

          L.polyline(coordinates, { color, weight: 10, shadow: { color: 'black', opacity: 0.8 } }).addTo(map);
        });
      };
      addQuality();

      // Initialize routing control here
      const routingControl = L.Routing.control({
        waypoints: [],
        createMarker: function (i, waypoint, n) {
          if (i === 0 || i === n - 1) {
            // Use custom marker icon for start and destination waypoints
            return L.marker(waypoint.latLng, {
              icon: myMarker
            });
          }
        }
      }).on('routesfound', function (e) {
        console.log(e);
        mapRef.current.eachLayer(function (layer) {
          if (layer.options.icon === taxiIcon) {
            mapRef.current.removeLayer(layer);
          }
        });
        let taxiMarker = null;
        let index = 0;
      
        const moveTaxi = () => {
          if (index < e.routes[0].coordinates.length) {
            const coordinate = e.routes[0].coordinates[index];
            if (!taxiMarker) {
              taxiMarker = L.marker(coordinate, { icon: taxiIcon }).addTo(mapRef.current);
            } else {
              taxiMarker.setLatLng(coordinate);
            }
            index++;
            setTimeout(moveTaxi, 80);
          }
        };
  
        moveTaxi();
      }).addTo(map);
      

      

      // Keep a reference to the routing control so you can update it later
      // (e.g., when the pathCoords change)
      setRoutingControl(routingControl);
    }
  }, [selectedLayer, currLocation]);


  useEffect(() => {
    if (showNotification) {
      notify();
      setShowNotification(false);
    }
  }, [showNotification]);

  useEffect(() => {
    if (routingControl) {
      const { start, dest } = pathCoords;
      routingControl.setWaypoints([L.latLng(start.lat, start.lng), L.latLng(dest.lat, dest.lng)]);
    }
  }, [pathCoords, routingControl]);

  const handleAddMarker = () => {
    const map = mapRef.current;

    if (!markerDisplayed) {
      const marker = L.marker(currLocation, { icon: myMarker });
      marker.bindPopup('Current Location').openPopup().addTo(map);
      setMarkerDisplayed(true);
    } else {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });
      setMarkerDisplayed(false);
    }
  };

  return (
    <div>
      <div id="map"></div>
      <button className={`marker-button ${markerDisplayed ? 'remove-marker' : 'add-marker'}`} onClick={handleAddMarker}>
        {markerDisplayed ? '- Remove Marker' : '+ Add Marker'}
      </button>
    </div>
  );
};

export default MapComponent;