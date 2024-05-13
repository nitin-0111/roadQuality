import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import redMarkerIcon from './red_marker.png';
import { baseLayers } from '../utils/baseLayers';

const myMarker = L.icon({
  iconUrl: redMarkerIcon,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

const MapComponent = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [markerDisplayed, setMarkerDisplayed] = useState(false);

  useEffect(() => {
    let map = null;
    if (!mapRef.current) {
      map = L.map('map').setView([0, 0], 18);
      mapRef.current = map;

      const selectedLayerObj = baseLayers['GoogleSatellite'];
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
    }

    const watchID = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLatLng = L.latLng(latitude, longitude);

        if (!markerRef.current) {
          const marker = L.marker(newLatLng, { icon: myMarker });
          marker.bindPopup('Current Location').openPopup().addTo(mapRef.current);
          markerRef.current = marker;
          setMarkerDisplayed(true);
        } else {
          markerRef.current.setLatLng(newLatLng);
        }

        mapRef.current.setView(newLatLng);
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchID);
    };
  }, []);

  const handleToggleMarker = () => {
    setMarkerDisplayed((prev) => !prev);
  };

  return (
    <div>
      <div id="map"></div>
      <button className="marker-button" onClick={handleToggleMarker}>
        {markerDisplayed ? 'Hide Marker' : 'Show Marker'}
      </button>
    </div>
  );
};

export default MapComponent;
