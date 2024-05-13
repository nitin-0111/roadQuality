// export const getUserLocation = () => {
//     if ('geolocation' in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           console.log("current position ", position);
//           const { latitude, longitude } = position.coords;
//           setCurrLocation([latitude, longitude]);
//           setShowNotification(true);

//           // axios
//           //   .post(${process.env.REACT_APP_BASE_URL}/senddata, {
//           //     latitude,
//           //     longitude,
//           //   })
//           //   .then((response) => {
//           //     console.log('Location added successfully:', response.data);
//           //   })
//           //   .catch((error) => {
//           //     console.error('Error adding location:', error);
//           //   });


//         },
//         (error) => {
//           console.error('Error getting user location:', error);
//         }
//       );
//     } else {
//       console.error('Geolocation is not supported by your browser.');
//     }
//   };