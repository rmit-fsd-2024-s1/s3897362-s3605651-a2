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
} from "@chakra-ui/react";
import { getAllReviews } from "../data/repository";

const ReviewModal = ({ isOpen, onClose, productId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const fetchedReviews = await getAllReviews();
        // Filter reviews for the specific product
        const productReviews = fetchedReviews.filter(
          (review) => review.productId === productId
        );
        setReviews(productReviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    }

    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen, productId]);

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
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReviewModal;
