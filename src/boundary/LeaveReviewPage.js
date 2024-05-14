/*import React, { useState } from 'react';
import { submitParkReview } from '../control/ReviewController'; // Import the function to submit park reviews

const LeaveReviewPage = ({ parks }) => {
  const [selectedPark, setSelectedPark] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault(); // Prevent form submission
    try {
      // Validate review content and rating
      if (!selectedPark) {
        alert('Please select a park.');
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

      // Submit review to Firebase
      const isSuccess = await submitParkReview(selectedPark, rating, reviewText);
      if (isSuccess) {
        setSubmitted(true); // Set submitted state to true
        setSelectedPark(''); // Reset selected park
        setRating(0); // Reset rating
        setReviewText(''); // Clear review text
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      // Handle error (show error message, etc.)
    }
  };

  return (
    <div>
      <h1>Leave a Review</h1>
      <form onSubmit={handleSubmitReview}>
        <div>
          <label htmlFor="park">Select Park:</label>
          <select id="park" value={selectedPark} onChange={(e) => setSelectedPark(e.target.value)}>
            <option value="">Select park...</option>
            {parks.map((park) => (
              <option key={park.id} value={park.id}>{park.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rating">Rating:</label>
          <select id="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
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
          <textarea id="review" value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
        </div>
        <button type="submit">Submit</button>
      </form>
      {submitted && <p>Your review has been submitted successfully!</p>}
    </div>
  );
};

export default LeaveReviewPage;*/
