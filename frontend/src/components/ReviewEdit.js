import React, { useState } from 'react';

const ReviewEditForm = ({ review, onUpdate }) => {
  const [updatedReviewData, setUpdatedReviewData] = useState({
    rating: review.rating,
    review_text: review.review_text,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedReviewData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(updatedReviewData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        name="rating"
        value={updatedReviewData.rating}
        onChange={handleChange}
      />
      <textarea
        name="review_text"
        value={updatedReviewData.review_text}
        onChange={handleChange}
      />
      <button type="submit">Update Review</button>
    </form>
  );
};

export default ReviewEditForm;
