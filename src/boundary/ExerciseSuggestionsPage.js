import React, { useEffect, useRef, useState } from 'react';
import LoadGoogleMapsApi from './LoadGoogleMapsApi';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../entity/fireBaseService';
import { Link } from 'react-router-dom';

function ExerciseSuggestionsPage() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedPark, setSelectedPark] = useState('');
  const [exerciseSuggestionsMap, setExerciseSuggestionsMap] = useState({});
  const [parkFacilitiesMap, setParkFacilitiesMap] = useState({});
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

          service.nearbySearch(request, async (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              const exerciseSuggestionsMapCopy = {};
              const parkFacilitiesMapCopy = {};

              for (const place of results) {
                const parkName = place.name;

                // Retrieve park details from Firestore
                const parkRef = doc(db, 'parks', parkName);
                const parkSnapshot = await getDoc(parkRef);

                if (parkSnapshot.exists()) {
                  const parkData = parkSnapshot.data();
                  const facilities = parkData.Facilities || []; // Retrieve facilities or default to an empty array
                  const suggestions = generateExerciseSuggestions(facilities);

                  exerciseSuggestionsMapCopy[parkName] = suggestions;
                  parkFacilitiesMapCopy[parkName] = facilities;
                } else {
                  console.log(`Park "${parkName}" not found in Firestore.`);
                }
              }

              setExerciseSuggestionsMap(exerciseSuggestionsMapCopy);
              setParkFacilitiesMap(parkFacilitiesMapCopy);

              results.forEach((place) => {
                const marker = new window.google.maps.Marker({
                  position: place.geometry.location,
                  map,
                  title: place.name,
                });

                marker.addListener('click', () => {
                  const parkName = place.name;
                  map.setCenter(place.geometry.location);
                  map.setZoom(15);
                  setSelectedPark(parkName);
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


  const generateExerciseSuggestions = (facilities) => {
    const exerciseCategories = [
      {
        name: 'Jogging',
        description: 'Get your heart pumping with a jog around the park. Jogging improves cardiovascular health and boosts your mood by releasing endorphins, the "feel-good" hormones.',
        facilitiesMatch: ['Jogging and cycling paths', 'Exercise stations', 'Jogging paths', 'Cycling and walking paths', 'Riverside views'],
      },
      {
        name: 'Cycling',
        description: 'Hop on your bike and explore the park with a refreshing bike ride. Cycling is a fun and eco-friendly way to stay active while enjoying the outdoors.',
        facilitiesMatch: ['Jogging and cycling paths', 'Cycling and walking paths', 'Cycling paths', 'Cycling and skating paths'],
      },
      {
        name: 'Bird Watching',
        description: 'Grab your binoculars and observe the diverse bird species in the park. Bird watching is a peaceful activity that allows you to appreciate the beauty of nature and spot unique bird behaviors.',
        facilitiesMatch: ['Bird watching facilities', 'Nature trails', 'Bird watching areas'],
      },
      {
        name: 'Wildlife Observing',
        description: 'Observe the fascinating wildlife that calls the park home. Wildlife observing allows you to connect with nature and learn about the diverse ecosystem within the park.',
        facilitiesMatch: ['Wildlife viewing areas', 'Nature trails', 'Mangrove habitats'],
      },
      {
        name: 'Yoga',
        description: 'Unwind and find inner peace with a yoga session in the park. Yoga not only enhances flexibility and strength but also promotes relaxation and stress relief.',
        facilitiesMatch: ['Yoga areas', 'Meditation areas', 'Seating areas'],
      },
      {
        name: 'Bodyweight Exercises',
        description: 'Use your body weight to perform exercises like push-ups, squats, and lunges. These exercises build strength and endurance, requiring no equipment.',
        facilitiesMatch: ['Open green spaces', 'Fitness corner', 'Playground', 'Exercise stations'],
      },
      {
        name: 'Outdoor Circuit Training',
        description: 'Set up a circuit of exercises using benches, stairs, and other park features. Circuit training provides a total body workout and adds variety to your routine.',
        facilitiesMatch: ['Fitness corner', 'Circuit training'],
      },
      {
        name: 'Tai Chi',
        description: 'Practice the gentle movements of Tai Chi to improve balance, flexibility, and mental clarity. Tai Chi is a low-impact exercise suitable for all ages.',
        facilitiesMatch: ['Open green spaces', 'Tai Chi areas'],
      },
      {
        name: 'Picnic and Light Sports',
        description: 'Gather friends and family for a picnic or enjoy light sports like Frisbee or Badminton and more! These activities promote bonding and laughter while staying active.',
        facilitiesMatch: ['Picnic areas', 'Open green spaces', 'Sports facilities', 'Recreational areas'],
      },
    ];
  
    let suggestions = [];
  
    // Loop through exercise categories and check if any facilities match
    for (const category of exerciseCategories) {
      if (category.facilitiesMatch.some(facility => facilities.includes(facility))) {
        suggestions.push({
          name: category.name,
          description: category.description,
        });
      }
    }
  
    if (suggestions.length === 0) {
      suggestions = [
        {
          name: 'Walking',
          description: 'Take a leisurely stroll through the park to enjoy the fresh air and scenery. Walking is a great way to relax your mind and body while getting some light exercise.',
        },
        {
          name: 'Stretching',
          description: 'Take a moment to stretch your muscles and increase flexibility. Stretching improves circulation, reduces muscle tension, and helps prevent injury.',
        },
      ];
    }
  
    return suggestions;
  };

  const logoStyle = {
    alignSelf: 'flex-start',
    maxWidth: '80px',
    padding: '20px',
    marginTop: '-35px',
  };

  const navStyle = {
    alignSelf: 'flex-start',
    paddingLeft: '20px',
    marginBottom: '-20px',
    display: 'flex',
  };

  const navLinkStyle = {
    textDecoration: 'none',
    color: '#6a5acd',
    margin: '0 10px',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f2f2f2',
  };
  
  const mapContainerStyle = {
    flex: 2,
    marginRight: '30px',
    height: '70%',
    marginTop: '50px',
  };
  
  const mapStyle = {
    width: '100%',
    height: '100%',
  };
  
  const exerciseSuggestionsContainerStyle = {
    flex: 1,
    maxWidth: '400px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start', // Adjusted to start from the top
  };
  
  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#6a5acd',
  };
  
  return (
    <div style={containerStyle}>
      <img src="/logo.png" alt="OutFit Explorer Logo" style={logoStyle} />
      <nav style={navStyle}>
        <Link to="/home" style={navLinkStyle}>Home</Link>
        <Link to="/rewards" style={navLinkStyle}>Rewards</Link>
        <Link to="/manage" style={navLinkStyle}>Profile</Link>
      </nav>
      <div style={mapContainerStyle}>
        <div ref={mapRef} style={mapStyle} />
      </div>
      <div style={exerciseSuggestionsContainerStyle}>
        {selectedPark && (
          <div>
            <h3 style={headingStyle}>Exercise Suggestions for {selectedPark}</h3>
            {exerciseSuggestionsMap[selectedPark] && (
              <div>
                {exerciseSuggestionsMap[selectedPark].map((exercise, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <h4 style={{ color: '#6a5acd'}} >{exercise.name}</h4>
                    <p>{exercise.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {!selectedPark && (
          <div>
            <h3 style={headingStyle}>No Park Selected</h3>
          </div>
        )}
      </div>
    </div>
  );
  
  

}

export default ExerciseSuggestionsPage;