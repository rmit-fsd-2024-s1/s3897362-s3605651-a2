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
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { createReview } from "../data/repository";

const ReviewModal = ({ isOpen, onClose, productId }) => {
  const [reviewContent, setReviewContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleCreateReview = async () => {
    setIsLoading(true);
    try {
      // Create review
      await createReview({
        productId,
        content: reviewContent,
        // Optionally, you can also include user ID or other relevant data
      });

      // Reset review content
      setReviewContent("");

      // Display success message
      toast({
        title: "Review submitted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Close the modal
      onClose();
    } catch (error) {
      // Display error message
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Write a Review</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="Write your review here..."
            mb={4}
          />
          <Button
            colorScheme="blue"
            isLoading={isLoading}
            loadingText="Submitting"
            onClick={handleCreateReview}
          >
            Submit Review
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReviewModal;
