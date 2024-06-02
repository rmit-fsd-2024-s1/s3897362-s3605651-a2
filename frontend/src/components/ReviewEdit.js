import React, { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, Textarea, Select, FormControl, FormLabel } from "@chakra-ui/react";
import { updateReview } from "../data/repository";

const ReviewEdit = ({ isOpen, onClose, review, onUpdate }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateReview(review.review_id, updatedReviewData);
      onUpdate(); // Notify parent component of successful update
    } catch (error) {
      console.error("Failed to update review:", error);
      // Handle error updating review
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Review</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Rating</FormLabel>
            <Select name="rating" value={updatedReviewData.rating} onChange={handleChange}>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Review</FormLabel>
            <Textarea
              name="review_text"
              value={updatedReviewData.review_text}
              onChange={handleChange}
              placeholder="Write your review here..."
            />
          </FormControl>
          <Button colorScheme="blue" onClick={handleSubmit} mt={4}>
            Update Review
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReviewEdit;
