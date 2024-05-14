import React, { useEffect, useRef, useState } from 'react';
import LoadGoogleMapsApi from './LoadGoogleMapsApi';

function MyMapComponent() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const isApiLoaded = LoadGoogleMapsApi();

  useEffect(() => {
    if (isApiLoaded) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const map = new window.google.maps.Map(mapRef.current, {
            center: currentLocation,
            zoom: 12,
          });

          setMap(map);

          const service = new window.google.maps.places.PlacesService(map);
          const request = {
            location: currentLocation,
            radius: 5000, // 5km in meters
            type: ['park'],
          };

          service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              results.forEach((place) => {
                const marker = new window.google.maps.Marker({
                  position: place.geometry.location,
                  map,
                  title: place.name,
                });
              });
            }
          });
        },
        () => {
          // Handle location error
        }
      );
    }
  }, [isApiLoaded]);

  return <div ref={mapRef} style={{ width: '400px', height: '300px' }} />;
}

export default MyMapComponent;