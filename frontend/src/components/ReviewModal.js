import React, { useState, useEffect } from "react";
import StarRatings from "react-star-ratings";
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
  Flex,
} from "@chakra-ui/react";
import { getReviewsByProductId, deleteReviewByUser } from "../data/repository";
import ReviewForm from "./ReviewForm";
import ReviewEdit from "./ReviewEdit";

const ReviewModal = ({ isOpen, onClose, productId, productName }) => {
  const [reviews, setReviews] = useState([]);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const toast = useToast();
  const [currentUserId, setCurrentUserId] = useState(null);

  const [isEditingReview, setIsEditingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const handleEditReview = (review) => {
    setEditingReview(review);
    setIsEditingReview(true);
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentUserId(
        (JSON.parse(localStorage.getItem("user")) || {}).user_id || null
      );
      fetchReviews();
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

  // Calculate the average rating
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="background">
        <ModalHeader color="heading">{productName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Box textColor={"heading"}>
              <Text fontSize="md" fontWeight="bold" mb={2}>
                Average user rating:{" "}
                <StarRatings
                  rating={Number(averageRating) || 0}
                  starRatedColor="gold"
                  starEmptyColor="gray"
                  starDimension="25px"
                  starSpacing="2px"
                  numberOfStars={5}
                  name="rating"
                />
              </Text>
            </Box>
            <Text color="heading" fontSize="md" fontWeight="bold" mb={2}>
              Individual Reviews:
            </Text>
            {reviews.map((review) => (
              <Box
                key={review.review_id}
                shadow="lg"
                borderWidth="1px"
                borderRadius="lg"
                position="relative"
                bg="card"
                textColor={"heading"}
                height="100%"
                display="flex"
                flexDirection="column"
                transition="all 0.2s"
                _hover={{ transform: "scale(1.01)" }}
                overflow="hidden"
                borderColor={"beige"}
                p={5}
                mb={2}
              >
                <Box flex="1">
                  <Flex justifyContent="space-between" alignItems="center">
                    <Box>
                      <Flex
                        fontWeight="bold"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <Text mr={2}>User:</Text>
                        <Text color="text"> {review.User.username}</Text>
                      </Flex>
                      <Text fontWeight="bold">
                        Rating:{" "}
                        <StarRatings
                          rating={Number(review.rating) || 0}
                          starRatedColor="gold"
                          starEmptyColor="gray"
                          starDimension="20px"
                          starSpacing="2px"
                          numberOfStars={5}
                          name="rating"
                        />
                      </Text>
                      <Flex
                        fontWeight="bold"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <Text mr={2}>Review:</Text>
                        <Text color="text"> {review.review_text}</Text>
                      </Flex>
                    </Box>

                    {currentUserId && currentUserId === review.user_id && (
                      <Box>
                        <Button
                          onClick={() => handleDeleteReview(review.review_id)}
                          colorScheme="red"
                          color="white"
                          mr={2}
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => handleEditReview(review)}
                          colorScheme="blue"
                          color="white"
                          mr={2}
                        >
                          Edit
                        </Button>
                      </Box>
                    )}
                  </Flex>
                </Box>
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
                userId={currentUserId}
                onSubmit={handleSubmitReview}
              />
            )}
            {isEditingReview && (
              <ReviewEdit
                isOpen={true} // Make sure it's set to true when you want to render the modal
                onClose={() => setIsEditingReview(false)} // Make sure you pass onClose function
                review={editingReview}
                onUpdate={() => {
                  setIsEditingReview(false);
                  fetchReviews(); // Update the reviews list after editing
                }}
              />
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReviewModal;
