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
  Tooltip,
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
  const rawAverageRating =
    reviews.reduce(
      (acc, review) => (review.is_deleted ? acc : acc + review.rating),
      0
    ) / reviews.filter((review) => !review.is_deleted).length;

  // Format the average rating
  const averageRating =
    rawAverageRating % 1 === 0
      ? rawAverageRating.toFixed(0)
      : rawAverageRating.toFixed(2);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="background">
        <ModalHeader color="heading">{productName}</ModalHeader>
        <ModalCloseButton color={"heading"} />
        <ModalBody>
          {isLoading ? (
            <Text>Loading reviews...</Text>
          ) : (
            <Box>
              <Box textColor={"heading"}>
                <Tooltip
                  label={`Rating: ${averageRating} out of 5`}
                  aria-label="A tooltip"
                  hasArrow
                >
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
                </Tooltip>
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
                  {review.is_deleted ? (
                    <Text fontWeight={"bold"}>{review.review_text}</Text>
                  ) : (
                    <Box position="relative">
                      <Flex direction="column" align="flex-start">
                        <Flex
                          fontWeight="bold"
                          flexDirection="row"
                          alignItems="center"
                        >
                          <Text mr={2}>User:</Text>
                          <Text color="text"> {review.User.username}</Text>
                        </Flex>{" "}
                        <Tooltip
                          label={`Rating: ${review.rating} out of 5`}
                          aria-label="A tooltip"
                          hasArrow
                        >
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
                        </Tooltip>
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
                  )}
                </Box>
              ))}
              {reviews.length === 0 && <Text>No reviews have been made.</Text>}

              <Box width="100%" mb={4}>
                <Button
                  color="beige"
                  bg="heading"
                  _hover={{ bg: "middleGreen", color: "heading" }}
                  onClick={() => setIsReviewFormOpen(true)}
                  mt={4}
                  width="full"
                >
                  Write a Review
                </Button>
              </Box>

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
