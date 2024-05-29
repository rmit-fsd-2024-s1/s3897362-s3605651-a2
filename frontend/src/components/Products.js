import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Heading,
  SimpleGrid,
  Flex,
  Spacer,
  Button,
  Image,
  Divider,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import { fetchProducts, addToCart } from "../data/repository";
import { Fade } from "@chakra-ui/transition";
import { MinusIcon } from "@chakra-ui/icons";
import CreditCardForm from "./CreditCardForm";

/**
 * Initial Specials Array
 * Contains an array of objects, each representing a special product.
 * Each object has the following properties:
 * - name: string
 * - description: string
 * - price: number
 * - quantity: number
 * - unit: string
 * - image: string (URL to the image)
 */
const Products = ({ changeView }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserId(storedUser.user_id);
    }
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(userId, product.product_id);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // Fetch the updated product list to reflect the quantity changes
      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Fade in={true}>
      {/* Display the specials of the week */}
      <Box p="4">
        <Heading
          as="h1"
          size="lg"
          fontFamily="'Josefin Sans', sans-serif"
          textAlign="center"
          mb={5}
          color="heading"
        >
          Specials of the Week!
        </Heading>
        <Flex direction="row" justify="space-between">
          <Box maxWidth="1100" margin="0 auto">
            <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={10} pb={5}>
              {/* Map over the products array to display each product */}
              {products.map((product, index) => (
                <Box
                  key={index}
                  p={5}
                  shadow="lg"
                  borderWidth="1px"
                  borderRadius="lg"
                  position="relative"
                  bg="card"
                  textColor={"heading"}
                  height="100%"
                  display="flex"
                  flexDirection="column"
                  transition="all 0.2s"
                  _hover={{ transform: "scale(1.01)" }}
                  overflow="hidden" // To ensure the image is contained within the borders
                  borderColor={"beige"}
                >
                  {/* Skeleton loader for the image
                   * to prevent images randomly loading and looking untidy
                   */}
                  <Skeleton
                    isLoaded={isLoaded}
                    height="200px"
                    borderRadius="lg"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      objectFit="cover" // Adjust as needed
                      boxSize="200px"
                      width="100%"
                      borderRadius="lg" // Rounded corners for the image
                    />
                  </Skeleton>
                  <Heading fontSize="xl" mb={2} mt={4}>
                    {product.name}
                  </Heading>
                  <Text color="text" mb={4} flexGrow={1}>
                    {product.description}
                  </Text>
                  <Spacer />
                  <Flex justifyContent="space-between" alignItems="center">
                    {/* Price and Quantity */}
                    <Text fontWeight="bold" fontSize="lg">
                      ${Number(product.price).toFixed(2)}
                      <Text
                        as="span"
                        fontSize="sm"
                        color="text"
                        fontWeight="normal"
                        fontFamily="'Josefin Sans', sans-serif"
                      >
                        /{product.unit}
                      </Text>
                    </Text>
                    <Text fontSize="md">QTY: {product.quantity}</Text>
                  </Flex>
                  {/* Add to cart button */}
                  <Button
                    mt={4}
                    bg={"darkGreen"}
                    textColor={"beige"}
                    onClick={() => handleAddToCart(product)}
                    _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
                  >
                    Add to cart
                  </Button>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Flex>
      </Box>
    </Fade>
  );
};

export default Products;
