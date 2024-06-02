import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Textarea,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";

const EditProductModal = ({
  isOpen,
  onClose,
  formState,
  setFormState,
  formErrors,
  handleUpdateProduct,
}) => {
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handlePriceChange = (e) => {
    const { value } = e.target;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setFormState((prevState) => ({
        ...prevState,
        price: value,
      }));
    }
  };

  const handleSpecialPriceChange = (e) => {
    const { value } = e.target;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setFormState((prevState) => ({
        ...prevState,
        specialPrice: value,
      }));
    }
  };

  const handleSwitchChange = (e) => {
    const { checked } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      isSpecial: checked,
      specialPrice: checked ? prevState.specialPrice : "",
    }));
  };

  const handleQuantityChange = (e) => {
    const { value } = e.target;
    if (/^\d+$/.test(value) && parseInt(value) > 0) {
      setFormState((prevState) => ({
        ...prevState,
        quantity: parseInt(value),
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        quantity: value,
      }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl id="name" mb={4} isInvalid={formErrors.name}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={formState.name}
              onChange={handleInputChange}
            />
            <FormErrorMessage>{formErrors.name}</FormErrorMessage>
          </FormControl>
          <FormControl
            id="description"
            mb={4}
            isInvalid={formErrors.description}
          >
            <FormLabel>Description</FormLabel>
            <Textarea
              value={formState.description}
              onChange={handleInputChange}
            />
            <FormErrorMessage>{formErrors.description}</FormErrorMessage>
          </FormControl>
          <FormControl id="price" mb={4} isInvalid={formErrors.price}>
            <FormLabel>Price</FormLabel>
            <Input
              type="text"
              value={formState.price}
              onChange={handlePriceChange}
            />
            <FormErrorMessage>{formErrors.price}</FormErrorMessage>
          </FormControl>
          <FormControl id="quantity" mb={4} isInvalid={formErrors.quantity}>
            <FormLabel>Quantity</FormLabel>
            <Input
              type="number"
              value={formState.quantity}
              onChange={handleQuantityChange}
            />
            <FormErrorMessage>{formErrors.quantity}</FormErrorMessage>
          </FormControl>
          <FormControl id="unit" mb={4} isInvalid={formErrors.unit}>
            <FormLabel>Unit</FormLabel>
            <Input
              type="text"
              value={formState.unit}
              onChange={handleInputChange}
            />
            <FormErrorMessage>{formErrors.unit}</FormErrorMessage>
          </FormControl>
          <FormControl id="image" mb={4} isInvalid={formErrors.image}>
            <FormLabel>Image URL</FormLabel>
            <Input
              type="text"
              value={formState.image}
              onChange={handleInputChange}
            />
            <FormErrorMessage>{formErrors.image}</FormErrorMessage>
          </FormControl>
          <FormControl id="isSpecial" display="flex" alignItems="center" mb={4}>
            <FormLabel mb="0">Is Special</FormLabel>
            <Switch
              isChecked={formState.isSpecial}
              onChange={handleSwitchChange}
            />
          </FormControl>
          {formState.isSpecial && (
            <FormControl
              id="specialPrice"
              mb={4}
              isInvalid={formErrors.specialPrice}
            >
              <FormLabel>Special Price</FormLabel>
              <Input
                type="text"
                value={formState.specialPrice}
                onChange={handleSpecialPriceChange}
              />
              <FormErrorMessage>{formErrors.specialPrice}</FormErrorMessage>
            </FormControl>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleUpdateProduct}>
            Save Changes
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditProductModal;
