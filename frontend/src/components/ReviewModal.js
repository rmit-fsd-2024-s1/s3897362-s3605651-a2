import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Text,
  Box,
  useToast,
} from "@chakra-ui/react";
import { getAllReviews } from "../data/repository";
import ReviewForm from "./ReviewForm"; // Import ReviewForm component

const ReviewModal = ({ isOpen, onClose, productId, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const toast = useToast();

  const fetchReviews = async () => {
    try {
      const fetchedReviews = await getAllReviews();
      const productReviews = fetchedReviews.filter(
        (review) => review.productId === productId
      );
      setReviews(productReviews);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      toast({
        title: "Error",
        description: "Failed to fetch reviews. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen, productId, toast]);

  const handleSubmitReview = async () => {
    // Refresh reviews after submitting a new review
    await fetchReviews();
    setIsReviewFormOpen(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Product Reviews</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              Reviews:
            </Text>
            {reviews.map((review) => (
              <Box key={review.id} bg="gray.100" p={2} mb={2}>
                <Text fontWeight="bold">{review.title}</Text>
                <Text>{review.content}</Text>
                <Text>Rating: {review.rating}</Text>
              </Box>
            ))}
            {reviews.length === 0 && <Text>No reviews available.</Text>}

            {/* Button to write review */}
            <Button
              colorScheme="blue"
              onClick={() => setIsReviewFormOpen(true)}
              mt={4}
            >
              Write a Review
            </Button>

            {/* Include ReviewForm if isOpen is true */}
            {isReviewFormOpen && (
              <ReviewForm
                isOpen={isReviewFormOpen}
                onClose={() => setIsReviewFormOpen(false)}
                productId={productId}
                userId={userId}
                onSubmit={handleSubmitReview}
              />
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReviewModal;
