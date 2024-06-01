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
import { getReviewsByProductId, updateReview } from "../data/repository";
import ReviewForm from "./ReviewForm";
import ReviewEditForm from "./ReviewEdit";

const ReviewModal = ({ isOpen, onClose, productId, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const toast = useToast();

  const fetchReviews = async () => {
    try {
      const fetchedReviews = await getReviewsByProductId(productId); // Use new function
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

  const ReviewItem = ({ review, currentUser }) => {
    const [isEditing, setIsEditing] = useState(false);
  
    const handleUpdateReview = async (updatedReviewData) => {
      try {
        await updateReview(review.id, updatedReviewData);
        setIsEditing(false);
        // Optionally, refresh the reviews list after editing
      } catch (error) {
        console.error('Failed to update review:', error);
        // Handle error
      }
    };
  
    return (
      <div>
        {isEditing ? (
          <ReviewEditForm review={review} onUpdate={handleUpdateReview} />
        ) : (
          <>
            <p>Rating: {review.rating}/5</p>
            <p></p>
            <p>Review Text: {review.review_text}</p>
            {currentUser.id === review.user_id && (
              <button onClick={() => setIsEditing(true)}>Edit</button>
            )}
          </>
        )}
      </div>
    );
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
                    <br/>
                    <Text>Rating: {review.rating}/5</Text>
                </Box>
            ))}
            {reviews.length === 0 && <Text>No reviews have been made. 
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
