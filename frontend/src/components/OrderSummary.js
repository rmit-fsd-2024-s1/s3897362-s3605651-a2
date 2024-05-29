import React, { useState, useEffect } from "react";
import { Heading, Box, Text, Flex, Divider } from "@chakra-ui/react";
import { Fade } from "@chakra-ui/transition";
import { getCart, checkoutCart } from "../data/repository";

const OrderSummary = () => {
  const [cart, setCart] = useState([]);
  const userId = JSON.parse(localStorage.getItem("user")).user_id;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartData = await getCart(userId);
        setCart(cartData);
        await checkoutCart(userId);
      } catch (error) {
        console.error("Failed to fetch cart or checkout:", error);
      }
    };

    const loadUser = async () => {
      if (userId) {
        try {
          const userData = await JSON.parse(localStorage.getItem("user"));
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };

    loadCart();
    loadUser();
  }, [userId]);

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
        Your Order Summary
      </Heading>
      <Text
        textAlign="center"
        fontStyle="italic"
        color="text"
        fontWeight={"light"}
        mt={5}
      >
        Your order has been placed! We will contact you when processing has
        completed.
      </Text>
      <Box maxWidth="600px" margin="0 auto">
        <Divider mt={5} mb={5} borderColor="lightGreen" />
        {cart.map((item, index) => (
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
        <Flex justifyContent="space-between" mt={5} mb={10}>
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
      </Box>
    </Fade>
  );
};

export default OrderSummary;
