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
  IconButton,
  Checkbox,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
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

const ProductList = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    refetchQueries: [{ query: GET_PRODUCTS }],
  });

  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  const productNames = selectedProducts
    .map(
      (id) =>
        data.getAllProducts.find((product) => product.product_id === id)?.name
    )
    .filter(Boolean);

  return (
    <Box p={5} width="100%">
      <Flex justifyContent="space-between" mb={4}>
        <Button
          colorScheme="red"
          onClick={() => setIsDeleteMode(!isDeleteMode)}
        >
          {isDeleteMode ? "Cancel Delete" : "Delete Product"}
        </Button>
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
      <TableContainer
        maxW="100%"
        overflowX="auto"
        overflowY="unset"
        maxHeight="calc(100vh - 120px)"
      >
        <Table variant="simple" size="sm" width="100%">
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
                      isChecked={selectedProducts.includes(product.product_id)}
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
                <Td p={2}>${product.price}</Td>
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
                  color={product.specialPrice ? "red.500" : "gray.500"}
                  fontStyle={product.specialPrice ? "normal" : "italic"}
                >
                  {product.specialPrice ? `$${product.specialPrice}` : "N/A"}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
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
    </Box>
  );
};

export default ProductList;
