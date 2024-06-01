import React, { useState, useRef } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Box, Spinner, Text, Button, Flex } from "@chakra-ui/react";
import ProductTable from "./ProductTable";
import DeleteProductDialog from "./DeleteProductDialog";
import AddProductModal from "./AddProductModal";
import { validateForm } from "../Validation/formValidation";

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
  const [formErrors, setFormErrors] = useState({});
  const cancelRef = useRef();

  if (loading) return <Spinner />;
  if (error) return <Text>Error :(</Text>;

  const handleAddProduct = () => {
    if (validateForm(formState, setFormErrors)) {
      createProduct({
        variables: {
          name: formState.name,
          description: formState.description,
          price: parseFloat(formState.price),
          quantity: parseInt(formState.quantity),
          unit: formState.unit,
          image: formState.image,
          isSpecial: formState.isSpecial,
          specialPrice: formState.isSpecial
            ? parseFloat(formState.specialPrice)
            : null,
        },
      });
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
      setFormErrors({});
    }
  };

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
        <ProductTable
          products={data.getAllProducts}
          isDeleteMode={isDeleteMode}
          handleSelectProduct={handleSelectProduct}
          selectedProducts={selectedProducts}
        />
      </Box>
      <DeleteProductDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        cancelRef={cancelRef}
        handleDelete={handleDelete}
        productNames={productNames}
      />
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formState={formState}
        setFormState={setFormState}
        formErrors={formErrors}
        handleAddProduct={handleAddProduct}
      />
    </Box>
  );
};

export default ProductList;
