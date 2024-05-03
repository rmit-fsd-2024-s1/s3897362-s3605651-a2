import React, { useState, useEffect } from "react";
import { Heading, Box, Text, Flex, Divider } from "@chakra-ui/react";
import { Fade } from "@chakra-ui/transition";

const OrderSummary = () => {
  const [displayCart, setDisplayCart] = useState([]);
  const [orderNumber, setOrderNumber] = useState(null);

  useEffect(() => {
    // Retrieve the cart from local storage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
    const userCart = storedCart[localStorage.getItem("userLoggedIn")] || [];
    setDisplayCart(userCart);
  }, []);

  useEffect(() => {
    if (displayCart.length > 0) {
      // Clear the cart from local storage
      const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
      storedCart[localStorage.getItem("userLoggedIn")] = [];
      localStorage.setItem("cart", JSON.stringify(storedCart));

      // Retrieve the order number from local storage
      let storedOrderNumber = localStorage.getItem("orderNumber");
      if (!storedOrderNumber) {
        storedOrderNumber = "0001";
      } else {
        // Increase the order number by one and pad it to 4 digits
        storedOrderNumber = (parseInt(storedOrderNumber) + 1)
          .toString()
          .padStart(4, "0");
      }
      // Store the new order number in local storage
      localStorage.setItem("orderNumber", storedOrderNumber);
      // Update the state
      setOrderNumber(storedOrderNumber);
    }
  }, [displayCart]);

  const username = localStorage.getItem("userLoggedIn"); // Get the current user's email
  const users = JSON.parse(localStorage.getItem("users")) || []; // Get the users array from local storage
  const userIndex = users.findIndex((u) => u.email === username); // Find the index of the current user
  const user = users[userIndex]; // Get the current user object

  // Now you can access the user's name
  const name = user.name;

  return (
    <Fade in={true}>
      <Heading
        as="h1"
        size="lg"
        fontFamily="'Josefin Sans', sans-serif"
        textAlign="center"
        mt={4}
        mb={5}
        textColor={"heading"}
      >
        Order #{orderNumber}
      </Heading>

      <Box maxWidth="600" margin="0 auto">
        <Flex justifyContent="center" mb={5}>
          <Text as="i" color="text" mb={5} fontWeight="500">
            Hey, {name}! Your order is safely with us and will be processed
            soon!
          </Text>
        </Flex>
        <Divider mt={5} mb={5} borderColor="lightGreen"></Divider>
        {/* Display the cart items */}
        {displayCart.map((item, index) => (
          <Flex
            key={index}
            alignItems="center"
            justifyContent="space-between"
            mb={3}
          >
            <Flex alignItems="center">
              <Text fontSize="2xl" color="heading" mr={2} textAlign={"left"}>
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
        <Divider borderColor="lightGreen"></Divider>
        <Flex justifyContent="space-between" mt={5} mb={10}>
          <Text fontSize="xl" fontWeight="bold" color={"heading"}>
            Total:
          </Text>
          <Text fontSize="xl" color={"heading"}>
            $
            {displayCart
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)}
          </Text>
        </Flex>
        <Flex justifyContent="center" mb={5}>
          <Text as="i" color="text" fontWeight="500">
            Thank you for shopping with SOIL Organics!
          </Text>
        </Flex>
      </Box>
    </Fade>
  );
};

export default OrderSummary;
