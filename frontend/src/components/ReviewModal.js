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
  IconButton,
  Box,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
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

  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    // Clear the previous reviews
    setReviews([]);

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
    } finally {
      setIsLoading(false);
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
          {isLoading ? (
            <Text>Loading reviews...</Text>
          ) : (
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
                  <Box position="relative">
                    <Flex direction="column" align="flex-start">
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
                    </Flex>
                    {currentUserId && currentUserId === review.user_id && (
                      <Box position="absolute" top={2} right={2}>
                        <IconButton
                          aria-label="Delete review"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() => handleDeleteReview(review.review_id)}
                          mr={2}
                          size="sm"
                        />
                        <IconButton
                          aria-label="Edit review"
                          icon={<EditIcon />}
                          colorScheme="blue"
                          onClick={() => handleEditReview(review)}
                          size="sm"
                        />
                      </Box>
                    )}
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
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReviewModal;
