import React, { useEffect, useRef, useState } from 'react';
import LoadGoogleMapsApi from './LoadGoogleMapsApi';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../entity/fireBaseService';
import { Link } from 'react-router-dom'; // Make sure to import Link

function MyMapComponent() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [nearbyParks, setNearbyParks] = useState([]);
  const [selectedPark, setSelectedPark] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const isApiLoaded = LoadGoogleMapsApi();
  const [firebaseReviews, setFirebaseReviews] = useState([]);
  

  useEffect(() => {
    if (isApiLoaded) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          document.body.style.backgroundColor = "#f2f2f2";



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
              setNearbyParks(results); // Save nearby parks
              results.forEach((place) => {
                const marker = new window.google.maps.Marker({
                  position: place.geometry.location,
                  map,
                  title: place.name,
                });

                marker.addListener('click', async () => {
                  try {
                    const parkName = place.name; // Assuming the park name is used as the identifier
                    // Center the map on the marker's position and zoom in
                    map.setCenter(place.geometry.location);
                    map.setZoom(15);
                
                    // Create an info window with park name and view on Google Maps link
                    const infoWindow = new window.google.maps.InfoWindow({
                      content: `<div><strong>${parkName}</strong><br/><a href="#" onclick="window.open('https://www.google.com/maps/place/?q=place_id:${place.place_id}', '_blank');">View on Google Maps</a></div>`
                    });
                    // Open the info window on the clicked marker
                    infoWindow.open(map, marker);
                    // Fetch reviews from Google Maps API
                    service.getDetails(
                      {
                        placeId: place.place_id,
                        fields: ['review'],
                      },
                      async (details, status) => {
                        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                          const googleReviews = details.reviews || []; // Reviews from Google Maps API

                          // Fetch reviews from Firebase
                          fetchFirebaseReviews(place.name);

                          // Merge reviews from Google Maps API and Firebase
                          const combinedReviews = [...googleReviews, ...firebaseReviews];

                          // Update state with combined reviews
                          setReviews(combinedReviews);
                          setSelectedPark(parkName); // Update selected park
                        } else {
                          console.error('Park document does not exist:', parkName);
                        }
                      }
                    );
                  } catch (error) {
                    console.error('Error fetching reviews:', error);
                  }
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
  const fetchFirebaseReviews = async (parkName) => {
    try {
      const parkDocRef = doc(db, 'parks', parkName);
      const parkDocSnapshot = await getDoc(parkDocRef);
      if (parkDocSnapshot.exists()) {
        const data = parkDocSnapshot.data();
        setFirebaseReviews(data.reviews || []);
      } else {
        console.error('Park document does not exist:', parkName);
        setFirebaseReviews([]);
      }
    } catch (error) {
      console.error('Failed to fetch Firebase reviews:', error);
      setFirebaseReviews([]);
    }
  };

  const submitReviewToFirebase = async (parkName, rating, reviewText) => {
    try {
      // Check if the document exists
      const parkDocRef = doc(db, 'parks', parkName);
      const parkDocSnapshot = await getDoc(parkDocRef);
      if (!parkDocSnapshot.exists()) {
        console.error('Park document does not exist:', parkName);
        throw new Error('Park document does not exist');
      }

      // Update park document with new review
      await updateDoc(parkDocRef, {
        reviews: arrayUnion({ rating, reviewText }),
      });
      return true; // Review submitted successfully
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw error; // Re-throw the error to handle it outside this function
    }
  };

  const handleViewNearbyParksSubmit = async () => {
    if (!selectedPark) {
      alert('Please select a park to submit the review.');
      return;
    }
    if (reviewText.trim().length < 20) {
      alert('Review must be at least 20 characters long.');
      return;
    }
    if (rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5.');
      return;
    }

    try {
      // Get the park name of the selected park
      const selectedParkData = nearbyParks.find(park => park.name === selectedPark);
      const parkName = selectedParkData ? selectedParkData.name : null;

      if (!parkName) {
        alert('Failed to find the name of the selected park.');
        return;
      }
      // Submit review to Firebase, associating it with the selected park
      const isSuccess = await submitReviewToFirebase(parkName, rating, reviewText); // Adjust parameters accordingly
      if (isSuccess) {
        setSubmitted(true);
        setSelectedPark('');
        setRating(0);
        setReviewText('');
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start', // align items to the top
    justifyContent: 'space-between', // space between the map and the form
    height: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f2f2f2',
  };
  
const mapContainerStyle = {
  flex: 2, // take 3 times the space compared to the review container
  marginRight: '20px',
  height: '70%', // fill the height of the container
  marginTop: '50px',

};

const mapStyle = {
  width: '100%', // fill the width of the container
  height: '100%', // fill the height of the container
};

const reviewsContainerStyle = {
  flex: 1, // assign the remaining space to the review form
  maxWidth: '400px', // set a max width for the review form
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // center the form within the review container
};

  

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
  };

  const reviewStyle = {
    marginBottom: '10px',
  };

  const logoStyle = {
    alignSelf: 'flex-start',
    maxWidth: '80px',
    padding: '20px',
    marginTop: '-30px',
  };

  const navStyle = {
    alignSelf: 'flex-start',
    paddingLeft: '20px',
    marginBottom: '40px',
    display: 'flex',
  };

  const navLinkStyle = {
    textDecoration: 'none',
    color: '#6a5acd',
    margin: '0 10px',
  };

  const inputStyle = {
    width: '300px',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#6a5acd',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const successMessageStyle = {
    color: 'green',
    fontWeight: 'bold',
    marginTop: '10px',
  };

  return (
    <div style={containerStyle}>

<img src="/logo.png" alt="OutFit Explorer Logo" style={logoStyle} />
      <nav style={navStyle}>
        <Link to="/home" style={navLinkStyle}> Home</Link>

        <Link to="/rewards" style={navLinkStyle}>Rewards</Link>
        {/* Linking 'Profile' to the '/manage' as per original functionality */}
        <Link to="/manage" style={navLinkStyle}>Profile</Link> 
      </nav>

      <div style={mapContainerStyle}>
        <div ref={mapRef} style={mapStyle} />
      </div>
      <div style={reviewsContainerStyle}>
        {reviews.length > 0 && (
          <div>
            <h3 style={headingStyle}>Reviews for {selectedPark}</h3>
            {reviews.map((review, index) => (
              <div key={index} style={reviewStyle}>
                <p>{review.text}</p>
                <p>Rating: {review.rating}</p>
              </div>
            ))}
          </div>
        )}
        {firebaseReviews.length > 0 && (
          <div>
            {firebaseReviews.map((review, index) => (
              <div key={index} style={reviewStyle}>
                <p>{review.reviewText}</p>
                <p>Rating: {review.rating}</p>
              </div>
            ))}
          </div>
        )}
        <h3 style={headingStyle}>Submit Review</h3>
        <select style={inputStyle} value={selectedPark} onChange={(e) => setSelectedPark(e.target.value)}>
          <option value="">Select park...</option>
          {nearbyParks.map((park) => (
            <option key={park.place_id} value={park.name}>{park.name}</option>
          ))}
        </select>
        <div>
          <label htmlFor="rating">Rating:</label>
          <select id="rating" style={inputStyle} value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            <option value={0}>Select rating...</option>
            <option value={1}>1 star</option>
            <option value={2}>2 stars</option>
            <option value={3}>3 stars</option>
            <option value={4}>4 stars</option>
            <option value={5}>5 stars</option>
          </select>
        </div>
        <div>
          <label htmlFor="review">Review:</label>
          <textarea id="review" style={inputStyle} value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
        </div>
        <button style={buttonStyle} type="submit" onClick={handleViewNearbyParksSubmit}>Submit</button>
        {submitted && <p style={successMessageStyle}>Your review has been submitted successfully!</p>}
      </div>
    </div>

    
  );
}

export default MyMapComponent;