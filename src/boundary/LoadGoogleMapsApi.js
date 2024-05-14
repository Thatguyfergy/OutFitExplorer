import { useEffect, useState } from 'react';

const LoadGoogleMapsApi = () => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDtJfoEL9oAteJDUf5hPo6_90oHUxqWDfI&libraries=places,geometry&callback=initMap`;
    script.async = true;
    window.initMap = () => setIsApiLoaded(true);
    document.body.appendChild(script);
  }, []);

  return isApiLoaded;
};

export default LoadGoogleMapsApi;