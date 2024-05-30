import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Text, // Added this line
} from "@chakra-ui/react";
import { Fade } from "@chakra-ui/transition";
import axios from "axios";

const ReviewEntry = ({ changeView, userId, productId, isAdmin }) => {
  const toast = useToast();
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

  // Added state for productId and setter
  const [currentProductId, setProductId] = useState(productId);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("/api/reviews");
        setReviews(response.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while fetching reviews.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchReviews();
  }, [toast]);

  const handleSubmit = async () => {
    if (rating && reviewText) {
      try {
        await axios.post("/api/reviews", {
          user_id: userId,
          product_id: currentProductId,
          rating,
          review_text: reviewText,
        });
        toast({
          title: "Review submitted.",
          description: "Your review has been submitted successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Optionally reset the form or navigate to another view
        changeView("products");
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while submitting your review.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Incomplete form",
        description: "Please complete all fields before submitting.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteByUser = async (id) => {
    try {
      await axios.delete(`/api/reviews/user/${id}`);
      toast({
        title: "Review deleted.",
        description: "The review has been marked as deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Optionally refresh the reviews list or navigate to another view
      setReviews(reviews.filter((review) => review.review_id !== id));
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the review.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteByAdmin = async (id) => {
    try {
      await axios.delete(`/api/reviews/admin/${id}`);
      toast({
        title: "Review deleted.",
        description: "The review has been marked as deleted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Optionally refresh the reviews list or navigate to another view
      setReviews(reviews.filter((review) => review.review_id !== id));
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the review.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Fade in={true}>
      <Flex direction="column" p={5} gap={6}>
        <Box maxWidth="600px" margin="0 auto">
          <Heading as="h1" mb={6} textAlign="center">
            Write a Review
          </Heading>
          <FormControl mb={4}>
            <FormLabel>Product ID</FormLabel>
            <Input
              type="text"
              value={currentProductId || ""}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Enter the product ID"
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Rating</FormLabel>
            <Select
              placeholder="Select rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Review</FormLabel>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
            />
          </FormControl>
          <Button colorScheme="teal" onClick={handleSubmit}>
            Submit Review
          </Button>
        </Box>
        <Box>
          <Heading as="h2" mb={4}>
            Reviews
          </Heading>
          {reviews.map((review) => (
            <Box key={review.review_id} p={4} borderWidth={1} borderRadius="md" mb={4}>
              <Text><strong>Product ID:</strong> {review.product_id}</Text>
              <Text><strong>Rating:</strong> {review.rating}</Text>
              <Text><strong>Review:</strong> {review.review_text}</Text>
              {isAdmin ? (
                <Button
                  colorScheme="red"
                  onClick={() => handleDeleteByAdmin(review.review_id)}
                  mt={2}
                >
                  Delete Review (Admin)
                </Button>
              ) : (
                <Button
                  colorScheme="red"
                  onClick={() => handleDeleteByUser(review.review_id)}
                  mt={2}
                >
                  Delete Review
                </Button>
              )}
            </Box>
          ))}
        </Box>
      </Flex>
    </Fade>
  );
};

export default ReviewEntry;
