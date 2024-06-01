import React, { useState, useRef } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Image,
  Spinner,
  Box,
  Text,
  Badge,
  Tooltip,
  Button,
  Checkbox,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
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
  NumberInput,
  NumberInputField,
  Switch,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const GET_PRODUCTS = gql`
  query GetAllProducts {
    getAllProducts {
      product_id
      name
      description
      price
      quantity
      unit
      image
      isSpecial
      specialPrice
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($product_id: ID!) {
    deleteProduct(product_id: $product_id)
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $description: String!
    $price: Float!
    $quantity: Int!
    $unit: String!
    $image: String!
    $isSpecial: Boolean!
    $specialPrice: Float
  ) {
    createProduct(
      name: $name
      description: $description
      price: $price
      quantity: $quantity
      unit: $unit
      image: $image
      isSpecial: $isSpecial
      specialPrice: $specialPrice
    ) {
      product_id
      name
      description
      price
      quantity
      unit
      image
      isSpecial
      specialPrice
    }
  }
`;

const ProductList = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });
  const [createProduct] = useMutation(CREATE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    unit: "",
    image: "",
    isSpecial: false,
    specialPrice: 0,
  });
  const cancelRef = useRef();

  if (loading) return <Spinner />;
  if (error) return <Text>Error :(</Text>;

  const handleDelete = () => {
    selectedProducts.forEach((product_id) => {
      deleteProduct({ variables: { product_id } });
    });
    setSelectedProducts([]);
    setIsDeleteMode(false);
    setIsDialogOpen(false);
  };

  const handleSelectProduct = (product_id) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(product_id)
        ? prevSelected.filter((id) => id !== product_id)
        : [...prevSelected, product_id]
    );
  };

  const handleAddProduct = () => {
    createProduct({ variables: formState });
    setIsModalOpen(false);
    setFormState({
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      unit: "",
      image: "",
      isSpecial: false,
      specialPrice: 0,
    });
  };

  const productNames = selectedProducts
    .map(
      (id) =>
        data.getAllProducts.find((product) => product.product_id === id)?.name
    )
    .filter(Boolean);

  return (
    <Box p={5} width="100%" height="100%" display="flex" flexDirection="column">
      <Box position="sticky" top={0} bg="white" zIndex={2} pb={4}>
        <Flex justifyContent="space-between" mb={4}>
          <Flex>
            <Button
              colorScheme="red"
              onClick={() => setIsDeleteMode(!isDeleteMode)}
            >
              {isDeleteMode ? "Cancel Delete" : "Delete Product"}
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => setIsModalOpen(true)}
              ml={4}
              isDisabled={isDeleteMode}
            >
              Add Product
            </Button>
          </Flex>
          {isDeleteMode && (
            <Button
              colorScheme="red"
              onClick={() => setIsDialogOpen(true)}
              isDisabled={selectedProducts.length === 0}
            >
              Confirm
            </Button>
          )}
        </Flex>
      </Box>
      <Box flex="1" overflowY="auto" height="calc(100vh - 120px)">
        <TableContainer>
          <Table variant="simple" size="sm" height="100%" width="100%">
            <Thead position="sticky" top={0} bg="teal.500" zIndex={1}>
              <Tr>
                {isDeleteMode && (
                  <Th color="white" p={2}>
                    Select
                  </Th>
                )}
                <Th color="white" p={2}>
                  ID
                </Th>
                <Th color="white" p={2}>
                  Name
                </Th>
                <Th color="white" p={2}>
                  Description
                </Th>
                <Th color="white" p={2}>
                  Price
                </Th>
                <Th color="white" p={2}>
                  Quantity
                </Th>
                <Th color="white" p={2}>
                  Unit
                </Th>
                <Th color="white" p={2}>
                  Image
                </Th>
                <Th color="white" p={2}>
                  Is Special
                </Th>
                <Th color="white" p={2}>
                  Special Price
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.getAllProducts.map((product) => (
                <Tr key={product.product_id}>
                  {isDeleteMode && (
                    <Td p={2}>
                      <Checkbox
                        isChecked={selectedProducts.includes(
                          product.product_id
                        )}
                        onChange={() => handleSelectProduct(product.product_id)}
                      />
                    </Td>
                  )}
                  <Td p={2}>{product.product_id}</Td>
                  <Td p={2}>{product.name}</Td>
                  <Td
                    p={2}
                    maxWidth="150px"
                    whiteSpace="normal"
                    wordBreak="break-word"
                  >
                    {product.description}
                  </Td>
                  <Td fontWeight="bold" color="gray.600" p={2}>
                    ${product.price}
                  </Td>
                  <Td p={2}>{product.quantity}</Td>
                  <Td p={2}>{product.unit}</Td>
                  <Td p={2}>
                    <Tooltip
                      label={
                        <Image
                          borderRadius={10}
                          src={product.image}
                          alt={product.name}
                        />
                      }
                      placement="right"
                      hasArrow
                      bg="rgba(49, 151, 149, 0.4)"
                      padding={1}
                      borderRadius={10}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        borderRadius={3}
                        boxSize="50px"
                        cursor="pointer"
                      />
                    </Tooltip>
                  </Td>
                  <Td p={2}>
                    {product.isSpecial ? (
                      <Badge colorScheme="green">Yes</Badge>
                    ) : (
                      <Badge colorScheme="red">No</Badge>
                    )}
                  </Td>
                  <Td
                    p={2}
                    fontWeight={product.specialPrice ? "bold" : "normal"}
                    color={product.specialPrice ? "green.500" : "gray.500"}
                    fontStyle={product.specialPrice ? "normal" : "italic"}
                  >
                    {product.specialPrice ? `$${product.specialPrice}` : "N/A"}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
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
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="name" mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
              />
            </FormControl>
            <FormControl id="description" mb={4}>
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                value={formState.description}
                onChange={(e) =>
                  setFormState({ ...formState, description: e.target.value })
                }
              />
            </FormControl>
            <FormControl id="price" mb={4}>
              <FormLabel>Price</FormLabel>
              <NumberInput
                step={0.01}
                min={0.01}
                value={formState.price}
                onChange={(valueString) =>
                  setFormState({ ...formState, price: parseFloat(valueString) })
                }
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl id="quantity" mb={4}>
              <FormLabel>Quantity</FormLabel>
              <NumberInput
                step={1}
                min={1}
                value={formState.quantity}
                onChange={(valueString) =>
                  setFormState({
                    ...formState,
                    quantity: parseInt(valueString),
                  })
                }
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl id="unit" mb={4}>
              <FormLabel>Unit</FormLabel>
              <Input
                type="text"
                value={formState.unit}
                onChange={(e) =>
                  setFormState({ ...formState, unit: e.target.value })
                }
              />
            </FormControl>
            <FormControl id="image" mb={4}>
              <FormLabel>Image URL</FormLabel>
              <Input
                type="text"
                value={formState.image}
                onChange={(e) =>
                  setFormState({ ...formState, image: e.target.value })
                }
              />
            </FormControl>
            <FormControl
              id="isSpecial"
              display="flex"
              alignItems="center"
              mb={4}
            >
              <FormLabel mb="0">Is Special</FormLabel>
              <Switch
                isChecked={formState.isSpecial}
                onChange={(e) =>
                  setFormState({ ...formState, isSpecial: e.target.checked })
                }
              />
            </FormControl>
            {formState.isSpecial && (
              <FormControl id="specialPrice" mb={4}>
                <FormLabel>Special Price</FormLabel>
                <NumberInput
                  step={0.01}
                  min={0.01}
                  value={formState.specialPrice}
                  onChange={(valueString) =>
                    setFormState({
                      ...formState,
                      specialPrice: parseFloat(valueString),
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddProduct}>
              Add Product
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductList;
