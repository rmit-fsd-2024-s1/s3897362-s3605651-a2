import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Box,
} from "@chakra-ui/react";
import { updateReview } from "../data/repository";

const ReviewEdit = ({ isOpen, onClose, review, onUpdate }) => {
  const [updatedReviewData, setUpdatedReviewData] = useState({
    rating: review.rating,
    review_text: review.review_text,
  });
  const [error, setError] = useState(""); // Add state for error message

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
      if (updatedReviewData.review_text.split(" ").length > 100) {
        // Check if review exceeds 100 words
        setError("Review should be up to 100 words");
        return;
      }

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
      <ModalContent bg="card">
        <ModalHeader color="heading">Edit Review</ModalHeader>
        <ModalCloseButton color={"heading"} />
        <ModalBody>
          <FormControl isInvalid={error}>
            <FormLabel fontWeight={"bold"} color="heading">
              Rating
            </FormLabel>
            <Select
              name="rating"
              value={updatedReviewData.rating}
              onChange={handleChange}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mt={4} isInvalid={error}>
            <FormLabel fontWeight={"bold"} color="heading">
              Review
            </FormLabel>
            <Textarea
              name="review_text"
              value={updatedReviewData.review_text}
              onChange={handleChange}
              placeholder="Write a review of up to 100 words" // Update placeholder
            />
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
          <Box width="100%" mb={4}>
            <Button
              color="beige"
              bg="heading"
              _hover={{ bg: "middleGreen", color: "heading" }}
              onClick={handleSubmit}
              mt={4}
              width="full"
            >
              Update Review
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReviewEdit;
