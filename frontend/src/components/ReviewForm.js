import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { createReview } from "../data/repository";

const ReviewForm = ({ isOpen, onClose, productId, onSubmit }) => {
  const [rating, setRating] = useState(5); // Set default rating to 5
  const [reviewText, setReviewText] = useState("");
  const [userId, setUserId] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.user_id : null;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setUserId(user ? user.user_id : null);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleSubmit = async () => {
    try {
      // Validate data before sending
      if (!userId || !productId || !rating || !reviewText) {
        console.error("Missing required fields");
        return;
      }

      console.log("Submitting review data:", {
        user_id: userId,
        product_id: productId,
        rating,
        review_text: reviewText,
      });

      await createReview({
        user_id: userId,
        product_id: productId,
        rating,
        review_text: reviewText,
      });

      onSubmit(); // Notify modal component of successful review submission
    } catch (error) {
      console.error("Failed to submit review:", error);
      // Handle error submission
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Write a Review</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Rating</FormLabel>
            <Select value={rating} onChange={(e) => setRating(e.target.value)}>
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
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
            />
          </FormControl>
          <Button colorScheme="blue" onClick={handleSubmit} mt={4}>
            Submit Review
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReviewForm;
