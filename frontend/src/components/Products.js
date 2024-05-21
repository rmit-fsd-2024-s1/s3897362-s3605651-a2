import React, { useState } from "react";
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
} from "@chakra-ui/react";
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
const initialSpecials = [
  {
    name: "Organic Blueberries",
    description:
      "Fresh, plump organic blueberries perfect for your morning smoothie.",
    price: 4.99,
    quantity: 100,
    unit: "pint",
    image: "/images/blueberries.jpg",
  },
  {
    name: "Local Honey",
    description: "Raw and unfiltered honey sourced from local farms.",
    price: 7.99,
    quantity: 75,
    unit: "12oz jar",
    image: "/images/honey.jpg",
  },
  {
    name: "Almond Milk",
    description: "Organic almond milk, unsweetened and made with real almonds.",
    price: 2.99,
    quantity: 50,
    unit: "quart",
    image: "/images/almond-milk.jpg",
  },
  {
    name: "Organic Kale Chips",
    description:
      "Crispy and lightly salted, these kale chips are a healthy snack.",
    price: 3.99,
    quantity: 40,
    unit: "bag",
    image: "/images/kale-chips.jpg",
  },
  {
    name: "Grass-fed Ground Beef",
    description: "High-quality, grass-fed ground beef with a rich flavor.",
    price: 8.99,
    quantity: 30,
    unit: "lb",
    image: "/images/ground-beef.jpg",
  },
  {
    name: "Organic Free-Range Eggs",
    description:
      "Large eggs from chickens raised in a free-range, organic environment.",
    price: 4.99,
    quantity: 60,
    unit: "dozen",
    image: "/images/eggs.jpg",
  },
  {
    name: "Whole Grain Bread",
    description:
      "Baked fresh, this whole grain bread is hearty and full of fiber.",
    price: 3.49,
    quantity: 50,
    unit: "loaf",
    image: "/images/whole-grain-bread.jpg",
  },
  {
    name: "Organic Avocados",
    description: "Creamy and nutritious, perfect for guacamole or salads.",
    price: 1.49,
    quantity: 100,
    unit: "each",
    image: "/images/avocados.jpg",
  },
];
const Products = ({ changeView }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Initialize cart state from local storage or use an empty array if none exist
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart"))?.[
      localStorage.getItem("userLoggedIn")
    ] || []
  );

  // Initialize specials state from local storage or use initial specials if none exist
  const [specials, setSpecials] = useState(
    JSON.parse(localStorage.getItem("specials")) || initialSpecials
  );

  // Function to handle adding items to the cart
  const addToCart = (product) => {
    // Retrieve the cart object from local storage
    let storedCart = JSON.parse(localStorage.getItem("cart")) || {};

    // Get the current user's cart from the storedCart object
    let userCart = storedCart[localStorage.getItem("userLoggedIn")] || [];

    const existingProduct = userCart.find((item) => item.name === product.name);

    if (existingProduct) {
      // Increase quantity of existing product
      userCart = userCart.map((item) =>
        item.name === product.name
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // Add new product to the cart
      userCart.push({ ...product, quantity: 1 });
    }

    // Update the user's cart in the storedCart object
    storedCart[localStorage.getItem("userLoggedIn")] = userCart;

    // Update the cart in local storage
    localStorage.setItem("cart", JSON.stringify(storedCart));

    // Update the cart state
    setCart(userCart);

    // Update the specials
    const updatedSpecials = specials.map((special) =>
      special.name === product.name && special.quantity > 0
        ? { ...special, quantity: special.quantity - 1 }
        : special
    );
    setSpecials(updatedSpecials);
    localStorage.setItem("specials", JSON.stringify(updatedSpecials));
  };

  // Function to handle removing items from the cart
  const removeFromCart = (product) => {
    // Retrieve the cart object from local storage
    let storedCart = JSON.parse(localStorage.getItem("cart")) || {};

    // Get the current user's cart from the storedCart object
    let userCart = storedCart[localStorage.getItem("userLoggedIn")] || [];

    const existingProduct = userCart.find((item) => item.name === product.name);

    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        // Decrease quantity of existing product
        userCart = userCart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        // Remove product from cart
        userCart = userCart.filter((item) => item.name !== product.name);
      }

      // Update the user's cart in the storedCart object
      storedCart[localStorage.getItem("userLoggedIn")] = userCart;

      // Update the cart in local storage
      localStorage.setItem("cart", JSON.stringify(storedCart));

      // Update the cart state
      setCart(userCart);

      // Update the specials
      const updatedSpecials = specials.map((special) =>
        special.name === product.name
          ? { ...special, quantity: special.quantity + 1 }
          : special
      );
      setSpecials(updatedSpecials);
      localStorage.setItem("specials", JSON.stringify(updatedSpecials));
    }
  };

  const clearCart = () => {
    // Retrieve the cart object from local storage
    let storedCart = JSON.parse(localStorage.getItem("cart")) || {};

    // Get the current user's cart from the storedCart object
    let userCart = storedCart[localStorage.getItem("userLoggedIn")] || [];

    // Restore the quantities of the specials
    let updatedSpecials = [...specials];
    userCart.forEach((cartItem) => {
      updatedSpecials = updatedSpecials.map((special) =>
        special.name === cartItem.name
          ? { ...special, quantity: special.quantity + cartItem.quantity }
          : special
      );
    });

    // Update the specials in local storage and state
    localStorage.setItem("specials", JSON.stringify(updatedSpecials));
    setSpecials(updatedSpecials);

    // Clear the user's cart in the storedCart object
    storedCart[localStorage.getItem("userLoggedIn")] = [];

    // Update the cart in local storage and state
    localStorage.setItem("cart", JSON.stringify(storedCart));
    setCart([]);
  };

  const CartItems = ({ cart, removeFromCart }) => {
    return (
      <>
        {/* Display the cart items */}
        {cart.map((item, index) => (
          <Flex
            key={index}
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Flex alignItems="center">
              {/* Display the remove button only when the modal is closed */}
              {!isOpen && (
                <Tooltip label="Remove from Cart" fontSize="xs">
                  <Button
                    onClick={() => removeFromCart(item)}
                    colorScheme="red"
                    size="xs"
                    height="18px"
                    width="18px"
                    fontSize="10px"
                    mr={2}
                  >
                    <MinusIcon></MinusIcon>
                  </Button>
                </Tooltip>
              )}
              {/* Display the quantity, product name, and price */}
              <Text fontSize="2xl" color="heading" mr={2}>
                {item.quantity}
              </Text>
              <Text fontSize="2xl" color="lightGreen" mr={2}>
                x
              </Text>
              <Text fontWeight="bold" color="text" mr={2}>
                {item.name}
              </Text>
            </Flex>
            <Text color="middleGreen">
              ${(item.price * item.quantity).toFixed(2)}
            </Text>
          </Flex>
        ))}
        {/* Display the total price */}
        <Divider borderColor="lightGreen"></Divider>
        <Flex justifyContent="space-between" mt={5}>
          <Text fontSize="xl" fontWeight="bold" color={"heading"}>
            Total:
          </Text>
          <Text fontSize="xl" color={"heading"}>
            $
            {cart
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)}
          </Text>
        </Flex>
      </>
    );
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
              {/* Map over the specials array to display each product */}
              {specials.map((special, index) => (
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
                      src={special.image}
                      alt={special.name}
                      objectFit="cover" // Adjust as needed
                      boxSize="200px"
                      width="100%"
                      borderRadius="lg" // Rounded corners for the image
                      onLoad={() => setIsLoaded(true)}
                    />
                  </Skeleton>
                  <Heading fontSize="xl" mb={2} mt={4}>
                    {special.name}
                  </Heading>
                  <Text color="text" mb={4} flexGrow={1}>
                    {special.description}
                  </Text>
                  <Spacer />
                  <Flex justifyContent="space-between" alignItems="center">
                    {/* Price and Quantity */}
                    <Text fontWeight="bold" fontSize="lg">
                      ${special.price.toFixed(2)}
                      <Text
                        as="span"
                        fontSize="sm"
                        color="text"
                        fontWeight="normal"
                        fontFamily="'Josefin Sans', sans-serif"
                      >
                        /{special.unit}
                      </Text>
                    </Text>
                    <Text fontSize="md">QTY: {special.quantity}</Text>
                  </Flex>
                  {/* Add to cart button */}
                  <Button
                    mt={4}
                    bg={"darkGreen"}
                    textColor={"beige"}
                    onClick={() => addToCart(special)}
                    _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
                  >
                    Add to cart
                  </Button>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
          {/* Display the cart and checkout button */}
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
              <CartItems cart={cart} removeFromCart={removeFromCart} />
              <Flex justifyContent="space-between">
                <Button
                  onClick={clearCart}
                  colorScheme="red"
                  size="md"
                  mt={5}
                  mr={5}
                >
                  Clear Cart
                </Button>
                <Button onClick={onOpen} colorScheme="blue" size="md" mt={5}>
                  Checkout
                </Button>
              </Flex>
              {/* Modal for the order summary */}
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent maxW={"1000px"} p={5}>
                  <ModalHeader
                    mt={3}
                    color="heading"
                    fontFamily="'Josefin Sans', sans-serif"
                  >
                    Order Summary
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody mb={3}>
                    <Flex direction={{ base: "column", md: "row" }}>
                      <Box flex="1">
                        <CartItems
                          cart={cart}
                          removeFromCart={removeFromCart}
                        />
                      </Box>
                      <Box flex="1" ml={20}>
                        {/* Credit Card Form Component */}
                        <CreditCardForm
                          onClose={onClose}
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
