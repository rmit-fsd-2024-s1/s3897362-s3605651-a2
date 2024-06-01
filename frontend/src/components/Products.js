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
import { Fade } from "@chakra-ui/transition";
import { MinusIcon } from "@chakra-ui/icons";
import {
  fetchProducts,
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReviewByUser,
  deleteReviewByAdmin,
} from "../data/repository";
import CreditCardForm from "./CreditCardForm";
import ReviewModal from "./ReviewModal";

const Products = ({ changeView }) => {
  const [specialProducts, setSpecialProducts] = useState([]);
  const [regularProducts, setRegularProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  const [userId, setUserId] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? user.user_id : null;
  });
  const toast = useToast();
  const {
    isOpen: isCheckoutOpen,
    onOpen: onCheckoutOpen,
    onClose: onCheckoutClose,
  } = useDisclosure();

//reviews test code
const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
const [selectedProductId, setSelectedProductId] = useState(null);

const handleReviewButtonClick = (product) => {
  setIsReviewModalOpen(true);
  setSelectedProductId(product.product_id);
};
<ReviewModal
  isOpen={isReviewModalOpen}
  onClose={() => setIsReviewModalOpen(false)}
  productId={selectedProductId}
/>
//end


  useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setUserId(user ? user.user_id : null);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        const special = data.filter((product) => product.isSpecial);
        const regular = data.filter((product) => !product.isSpecial);
        setSpecialProducts(special);
        setRegularProducts(regular);
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

    async function loadUser() {
      if (userId) {
        try {
          const userData = await JSON.parse(localStorage.getItem("user"));
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    }

    loadProducts();
    loadCart();
    loadUser();
  }, [userId]);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(userId, product.product_id);
      const updatedCart = await getCart(userId);
      setCart(updatedCart);

      const updatedProducts = await fetchProducts();
      const special = updatedProducts.filter((product) => product.isSpecial);
      const regular = updatedProducts.filter((product) => !product.isSpecial);
      setSpecialProducts(special);
      setRegularProducts(regular);

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

      const updatedProducts = await fetchProducts();
      const special = updatedProducts.filter((product) => product.isSpecial);
      const regular = updatedProducts.filter((product) => !product.isSpecial);
      setSpecialProducts(special);
      setRegularProducts(regular);

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

  const handleClearCart = async () => {
    try {
      await clearCart(userId);
      const updatedCart = await getCart(userId);
      setCart(updatedCart);

      const updatedProducts = await fetchProducts();
      const special = updatedProducts.filter((product) => product.isSpecial);
      const regular = updatedProducts.filter((product) => !product.isSpecial);
      setSpecialProducts(special);
      setRegularProducts(regular);

      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to clear cart:", error);
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
              $
              {(
                (item.Product.isSpecial
                  ? item.Product.specialPrice
                  : item.Product.price) * item.quantity
              ).toFixed(2)}
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
                (total, item) =>
                  total +
                  (item.Product.isSpecial
                    ? item.Product.specialPrice
                    : item.Product.price) *
                    item.quantity,
                0
              )
              .toFixed(2)}
          </Text>
        </Flex>
        <Flex mt={5} justifyContent="space-between">
          <Button colorScheme="red" onClick={handleClearCart}>
            Clear Cart
          </Button>
          <Button colorScheme="blue" onClick={onCheckoutOpen}>
            Checkout
          </Button>
        </Flex>
      </>
    );
  };

  return (
    <Fade in={true}>
      <Box p="4">
        <Flex direction="row" justify="space-between">
          <Box maxWidth="1100" margin="0 auto">
            {specialProducts.length > 0 && (
              <>
                <Heading
                  as="h2"
                  size="lg"
                  fontFamily="'Josefin Sans', sans-serif"
                  textAlign="center"
                  mb={5}
                  color="heading"
                >
                  Specials of the Week!
                </Heading>
                <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={10}>
                  {specialProducts.map((product, index) => (
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
                        <Text fontWeight="bold" fontSize="lg" color="red.500">
                          ${Number(product.specialPrice).toFixed(2)}
                          <Text
                            as="span"
                            fontSize="sm"
                            color="text"
                            fontWeight="normal"
                            fontFamily="'Josefin Sans', sans-serif"
                          >
                            /{product.unit}
                            <Text
                              fontWeight="bold"
                              fontSize="md"
                              color="middleGreen"
                              textDecoration="line-through"
                            >
                              ${Number(product.price).toFixed(2)}
                            </Text>
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
                      <Button
                        mt={4}
                        bg={"darkGreen"}
                        textColor={"beige"}
                        onClick={() => handleReviewButtonClick(product)}
                        _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
                      >
                        Reviews
                      </Button>
                    </Box>
                  ))}
                </SimpleGrid>
              </>
            )}
            <Heading
              as="h2"
              size="lg"
              fontFamily="'Josefin Sans', sans-serif"
              textAlign="center"
              mt={10}
              mb={5}
              color="heading"
            >
              Regular Products
            </Heading>
            <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={10}>
              {regularProducts.map((product, index) => (
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
                  <Button
                        mt={4}
                        bg={"darkGreen"}
                        textColor={"beige"}
                        onClick={() => handleReviewButtonClick(product)}
                        _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
                      >
                        Reviews
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
              <Modal
                isOpen={isCheckoutOpen}
                onClose={onCheckoutClose}
                size="3xl"
              >
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>
                    {user.first_name} {user.last_name}'s Cart
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Flex direction="row" justify="space-between">
                      <Box flex="1" mr="2">
                        {cart.length > 0 ? (
                          cart.map((item, index) => (
                            <Flex
                              key={index}
                              alignItems="center"
                              justifyContent="space-between"
                              mb={3}
                            >
                              <Flex alignItems="center">
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
                                $
                                {(
                                  (item.Product.isSpecial
                                    ? item.Product.specialPrice
                                    : item.Product.price) * item.quantity
                                ).toFixed(2)}
                              </Text>
                            </Flex>
                          ))
                        ) : (
                          <Text>No items in the cart.</Text>
                        )}
                        <Divider borderColor="lightGreen" />
                        <Flex justifyContent="space-between" mt={5}>
                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color={"heading"}
                          >
                            Total:
                          </Text>
                          <Text
                            fontSize="xl"
                            fontWeight="bold"
                            color={"orange.500"}
                          >
                            $
                            {cart
                              .reduce(
                                (total, item) =>
                                  total +
                                  (item.Product.isSpecial
                                    ? item.Product.specialPrice
                                    : item.Product.price) *
                                    item.quantity,
                                0
                              )
                              .toFixed(2)}
                          </Text>
                        </Flex>
                      </Box>
                      <Box flex="1" ml="2">
                        <CreditCardForm
                          onClose={onCheckoutClose}
                          changeView={changeView}
                        />
                      </Box>
                    </Flex>
                  </ModalBody>
                </ModalContent>
              </Modal>
            </Box>
          )}
        </Flex>
      </Box>
    </Fade>
  );
};

export default Products;
