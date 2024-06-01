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
import { getAllReviews, getReviewById } from "../data/repository";
import ReviewForm from "./ReviewForm"; // Import ReviewForm component

const ReviewModal = ({ isOpen, onClose, productId, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const toast = useToast();

  const fetchReviews = async () => {
    try {
      const fetchedReview = await getReviewById(productId);
      if (fetchedReview) {
        setReviews([fetchedReview]);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Failed to fetch review:", error);
      toast({
        title: "Error",
        description: "Failed to fetch review. Please try again later.",
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
                <Box key={review.review_id} bg="gray.100" p={2} mb={2}>
                    <Text fontWeight="bold">Review Text: {review.review_text}</Text>
                    <Text>Rating: {review.rating}</Text>
                </Box>
            ))}
            {reviews.length === 0 && <Text>No reviews available. 
                </Text>}

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
