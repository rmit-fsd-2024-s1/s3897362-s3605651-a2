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
  FormErrorMessage, // Add FormErrorMessage
  Box,
} from "@chakra-ui/react";
import { createReview } from "../data/repository";

const ReviewForm = ({ isOpen, onClose, productId, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [userId, setUserId] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.user_id : null;
  });
  const [error, setError] = useState(""); // Add state for error message

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
      if (!userId || !productId || !rating || !reviewText) {
        setError("All fields are required"); // Set error message if any field is missing
        return;
      }

      if (reviewText.split(" ").length > 100) {
        // Check if review exceeds 100 words
        setError("Review should be up to 100 words");
        return;
      }

      await createReview({
        user_id: userId,
        product_id: productId,
        rating,
        review_text: reviewText,
      });

      onSubmit();
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="card">
        <ModalHeader color="heading">Write a Review</ModalHeader>
        <ModalCloseButton color={"heading"} />
        <ModalBody>
          <FormControl isInvalid={error}>
            <FormLabel fontWeight={"bold"} color="heading">
              Rating
            </FormLabel>
            <Select value={rating} onChange={(e) => setRating(e.target.value)}>
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
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
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
              Submit Review
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReviewForm;
