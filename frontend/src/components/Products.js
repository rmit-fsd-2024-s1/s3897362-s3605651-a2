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
import {
  fetchProducts,
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../data/repository";
import { Fade } from "@chakra-ui/transition";
import { MinusIcon } from "@chakra-ui/icons";
import CreditCardForm from "./CreditCardForm";

const Products = ({ changeView }) => {
  const [products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.user_id : null;
  });
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setUserId(user ? user.user_id : null);
    };

    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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

    async function loadCart() {
      if (userId) {
        try {
          const cartData = await getCart(userId);
          setCart(cartData);
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      }
    }

    loadProducts();
    loadCart();
  }, [userId]);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(userId, product.product_id);
      const updatedCart = await getCart(userId);
      setCart(updatedCart);

      // Fetch the updated products
      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  const handleRemoveFromCart = async (product) => {
    try {
      await removeFromCart(userId, product.product_id, 1);
      const updatedCart = await getCart(userId);
      setCart(updatedCart);

      // Fetch the updated products
      const updatedProducts = await fetchProducts();
      setProducts(updatedProducts);

      toast({
        title: "Removed from Cart",
        description: `${product.name} has been removed from your cart.`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to remove product from cart:", error);
    }
  };

  const CartItems = ({ cart }) => {
    return (
      <>
        {cart.map((item, index) => (
          <Flex
            key={index}
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Flex alignItems="center">
              <Tooltip label="Remove from Cart" fontSize="xs">
                <Button
                  onClick={() =>
                    handleRemoveFromCart({
                      product_id: item.product_id,
                      name: item.Product.name,
                      quantity: item.quantity,
                    })
                  }
                  colorScheme="red"
                  size="xs"
                  height="18px"
                  width="18px"
                  fontSize="10px"
                  mr={2}
                >
                  <MinusIcon />
                </Button>
              </Tooltip>
              <Text fontSize="2xl" color="heading" mr={2}>
                {item.quantity}
              </Text>
              <Text fontSize="2xl" color="lightGreen" mr={2}>
                x
              </Text>
              <Text fontWeight="bold" color="text" mr={2}>
                {item.Product.name}
              </Text>
            </Flex>
            <Text color="middleGreen">
              ${(item.Product.price * item.quantity).toFixed(2)}
            </Text>
          </Flex>
        ))}
        <Divider borderColor="lightGreen" />
        <Flex justifyContent="space-between" mt={5}>
          <Text fontSize="xl" fontWeight="bold" color={"heading"}>
            Total:
          </Text>
          <Text fontSize="xl" color={"heading"}>
            $
            {cart
              .reduce(
                (total, item) => total + item.Product.price * item.quantity,
                0
              )
              .toFixed(2)}
          </Text>
        </Flex>
      </>
    );
  };

  return (
    <Fade in={true}>
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
                  overflow="hidden"
                  borderColor={"beige"}
                >
                  <Skeleton
                    isLoaded={isLoaded}
                    height="200px"
                    borderRadius="lg"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      objectFit="cover"
                      boxSize="200px"
                      width="100%"
                      borderRadius="lg"
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
          {cart.length > 0 && (
            <Box
              position="sticky"
              top={20}
              bg="card"
              p={5}
              ml={5}
              mr={5}
              shadow="lg"
              borderWidth="1px"
              borderRadius="lg"
              borderColor={"beige"}
              transition="all 0.2s"
              _hover={{ transform: "scale(1.005)" }}
              width={{ base: "40vw", lg: "30vw", xl: "20vw" }}
              flexShrink={0}
              alignSelf="start"
            >
              <Heading as="h3" size="lg" mb={4} textColor={"heading"}>
                Cart
              </Heading>
              <CartItems cart={cart} />
            </Box>
          )}
        </Flex>
      </Box>
    </Fade>
  );
};

export default Products;
