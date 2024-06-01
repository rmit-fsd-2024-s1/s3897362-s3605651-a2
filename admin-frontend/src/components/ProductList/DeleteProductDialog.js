import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Box,
  Text,
} from "@chakra-ui/react";

const DeleteProductDialog = ({
  isOpen,
  onClose,
  cancelRef,
  handleDelete,
  productNames,
}) => (
  <AlertDialog
    isOpen={isOpen}
    leastDestructiveRef={cancelRef}
    onClose={onClose}
  >
    <AlertDialogOverlay>
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Confirm Deletion
        </AlertDialogHeader>
        <AlertDialogBody>
          Are you sure you want to delete the following products?
          <Box mt={4}>
            {productNames.map((name) => (
              <Text fontWeight="bold" key={name}>
                {name}
              </Text>
            ))}
          </Box>
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleDelete} ml={3}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogOverlay>
  </AlertDialog>
);

export default DeleteProductDialog;
