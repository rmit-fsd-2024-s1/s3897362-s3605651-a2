import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import ReviewEntry from "./ReviewEntry";

const ReviewEntryModal = ({ isOpen, onClose, productId }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Write a Review</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ReviewEntry productId={productId} onClose={onClose} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReviewEntryModal;
