import React, { useState } from "react";
import {
  Box, Flex, Heading, Button, Textarea, FormControl, FormLabel, Input, Select, useTheme, useToast,
} from "@chakra-ui/react";
import { Fade } from "@chakra-ui/transition";
import axios from "axios";

const ReviewEntry = ({ changeView, userId, productId, isAdmin }) => {
  const theme = useTheme();
  const toast = useToast();

  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);

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
  }, []);

  const handleSubmit = async () => {
    if (rating && reviewText) {
      try {
        await axios.post("/api/reviews", {
          user_id: userId,
          product_id: productId,
          rating: rating,
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
          <Heading as="h1" size="xl" mb={4} textColor={"heading"}>
            Submit a Review
          </Heading>
          <FormControl id="productId" mb={4} isRequired>
            <FormLabel>Product ID</FormLabel>
            <Input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Enter Product ID"
            />
          </FormControl>
          <FormControl id="rating" mb={4} isRequired>
            <FormLabel>Rating</FormLabel>
            <Select
              placeholder="Select rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </Select>
          </FormControl>
          <FormControl id="reviewText" mb={4} isRequired>
            <FormLabel>Review Text</FormLabel>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review (max 100 words)"
              maxLength={500} // Adjust the maxLength as needed
              size="sm"
            />
          </FormControl>
          <Button
            bg={"darkGreen"}
            textColor={"beige"}
            _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
            onClick={handleSubmit}
          >
            Submit Review
          </Button>
        </Box>
        <Box maxWidth="600px" margin="0 auto" mt={8}>
          <Heading as="h2" size="lg" mb={4} textColor={"heading"}>
            Reviews
          </Heading>
          {reviews.map((review) => (
            <Box
              key={review.review_id}
              bg="card"
              p={5}
              shadow="md"
              borderWidth="1px"
              borderColor={"beige"}
              borderRadius="lg"
              mb={4}
            >
              <Text fontSize="lg" mb={2} textColor={"text"}>
                {review.review_text}
              </Text>
              <Text fontSize="sm" mb={2} textColor={"text"}>
                Rating: {review.rating}
              </Text>
              {isAdmin && (
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDeleteByAdmin(review.review_id)}
                  mr={2}
                >
                  Delete as Admin
                </Button>
              )}
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => handleDeleteByUser(review.review_id)}
              >
                Delete as User
              </Button>
            </Box>
          ))}
        </Box>
      </Flex>
    </Fade>
  );
};

export default ReviewEntry;