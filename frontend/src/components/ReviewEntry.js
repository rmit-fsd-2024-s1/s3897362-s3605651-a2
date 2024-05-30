import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, useToast } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ReviewEntry = () => {
  const { productId } = useParams();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user")).user_id;

  const handleReviewSubmit = async () => {
    try {
      await axios.post("/api/reviews", {
        productId,
        userId,
        review,
        rating,
      });
      toast({
        title: "Review Submitted",
        description: "Your review has been submitted successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your review.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="600px" mx="auto" mt={10} p={5} shadow="lg" borderWidth="1px" borderRadius="lg" bg="card">
      <FormControl id="review" mb={5}>
        <FormLabel>Write your review</FormLabel>
        <Textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review here..."
        />
      </FormControl>
      <FormControl id="rating" mb={5}>
        <FormLabel>Rating</FormLabel>
        <Input
          type="number"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value, 10))}
          placeholder="Rate from 1 to 5"
          min={1}
          max={5}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleReviewSubmit}>
        Submit Review
      </Button>
    </Box>
  );
};

export default ReviewEntry;
