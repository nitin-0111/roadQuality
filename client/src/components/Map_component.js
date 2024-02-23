import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { roadData } from '../tmp_dataSet/DataSet';
import './MapComponent.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import redMarkerIcon from './red_marker.png';


const myMarker = L.icon({
  iconUrl: redMarkerIcon,
  iconSize: [38, 38],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

const MapComponent = () => {
  const mapRef = useRef(null);
  const [selectedLayer, setSelectedLayer] = useState('GoogleSatellite'); // Default selection
  const [currLocation, setCurrLocation] = useState([26.865102, 75.807580]);
  const [markerDisplayed, setMarkerDisplayed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const notify = () => toast("User location obtained!", { type: 'success' });

  useEffect(() => {

    const getUserLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrLocation([latitude, longitude]);
            setShowNotification(true); // Trigger notification when user's location is obtained
            // map.setView([latitude, longitude], 25); // Set map view to user's current location
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
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),

      GoogleStreets: L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),
      GoogleTerrain: L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }),
      GoogleHybrid: L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      })
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
        map.eachLayer(layer => {
          map.removeLayer(layer);
        });
        selectedLayer.addTo(map);
      };


      const dropdown = L.control.layers(baseLayers).addTo(map);

      const addQuality = () => {
        const colors = {
          0: 'lightgreen', // Quality label 0 - green color
          1: 'red',   // Quality label 1 - red color
        };

        roadData.forEach(segment => {
          const { longitude_s, longitude_e, latitude_s, latitude_e, quality_label } = segment;

          // Define coordinates for the polyline
          const coordinates = [
            [latitude_s, longitude_s],
            [latitude_e, longitude_e],
          ];

          // Determine color based on quality_label
          const color = colors[quality_label];

          // Draw polyline on the map
          L.polyline(coordinates, { color, weight: 10, shadow: { color: 'black', opacity: 0.8 } }).addTo(map);
        });
      }
      addQuality();
    }



  }, [selectedLayer, currLocation]);

  useEffect(() => {
    if (showNotification) {
      notify();
      setShowNotification(false);
    }
  }, [showNotification]);
  


  const handleAddMarker = () => {
    const map = mapRef.current;

    if (!markerDisplayed) {
      const marker = L.marker(currLocation, { icon: myMarker });
      marker.bindPopup('Current Location').openPopup().addTo(map);
      setMarkerDisplayed(true); // Update state to indicate marker is displayed
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
