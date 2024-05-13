// const addQuality = () => {
//   const colors = {
//     0: 'lightgreen',
//     1: 'red',
//   };

//   roadData.forEach((segment) => {
//     const { longitude_s, longitude_e, latitude_s, latitude_e, quality_label } = segment;

//     const coordinates = [
//       [latitude_s, longitude_s],
//       [latitude_e, longitude_e],
//     ];

//     const color = colors[quality_label];

//     L.polyline(coordinates, { color, weight: 10, shadow: { color: 'black', opacity: 0.8 } }).addTo(map);
//   });
// };
// addQuality();

/*
 const routingControl = L.Routing.control({
        waypoints: [],
        createMarker: function (i, waypoint, n) {
          if (i === 0 || i === n - 1) {
            // Use custom marker icon for start and destination waypoints
            return L.marker(waypoint.latLng, {
              icon: myMarker
            });
          }
        },
        lineOptions: {
          styles: [{ color: 'lightgreen', opacity: 0.8, weight: 6 }]
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
    */