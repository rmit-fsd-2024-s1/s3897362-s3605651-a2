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
import {
  getReviewsByProductId,
  updateReview,
  deleteReviewByUser,
} from "../data/repository";
import ReviewForm from "./ReviewForm";
import ReviewEditForm from "./ReviewEdit";

const ReviewModal = ({ isOpen, onClose, productId }) => {
  const [reviews, setReviews] = useState([]);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const toast = useToast();
  const [userId, setUserId] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.user_id : null;
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
      setCurrentUser({ id: userId });
    }
  }, [isOpen, productId, toast]);

  const fetchReviews = async () => {
    try {
      const fetchedReviews = await getReviewsByProductId(productId);
      setReviews(fetchedReviews);
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

  const handleSubmitReview = async () => {
    await fetchReviews();
    setIsReviewFormOpen(false);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReviewByUser(reviewId);
      fetchReviews();
      toast({
        title: "Success",
        description: "Review deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to delete review:", error);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
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
                <Text fontWeight="bold">{review.review_text}</Text>
                <br />
                <Text>Rating: {review.rating}/5</Text>
                <Text>By: {review.User.username}</Text>
                {currentUser && currentUser.id === review.user_id && (
                  <Button
                    colorScheme="red"
                    onClick={() => handleDeleteReview(review.review_id)}
                  >
                    Delete
                  </Button>
                )}
              </Box>
            ))}
            {reviews.length === 0 && <Text>No reviews have been made.</Text>}

            <Button
              colorScheme="blue"
              onClick={() => setIsReviewFormOpen(true)}
              mt={4}
            >
              Write a Review
            </Button>

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
