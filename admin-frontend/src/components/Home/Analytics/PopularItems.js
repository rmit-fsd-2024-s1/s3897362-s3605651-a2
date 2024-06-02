import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Box, Text, VStack } from "@chakra-ui/react";

const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    getAllProducts {
      product_id
      name
    }
  }
`;

const GET_ALL_REVIEWS = gql`
  query GetAllReviews {
    getAllReviews {
      product_id
      rating
    }
  }
`;

const PopularItems = () => {
  const {
    loading: productsLoading,
    error: productsError,
    data: productsData,
  } = useQuery(GET_ALL_PRODUCTS);
  const {
    loading: reviewsLoading,
    error: reviewsError,
    data: reviewsData,
  } = useQuery(GET_ALL_REVIEWS);

  if (productsLoading || reviewsLoading) return <p>Loading...</p>;
  if (productsError || reviewsError) return <p>Error :(</p>;

  const products = productsData.getAllProducts;
  const reviews = reviewsData.getAllReviews;

  // Calculate popularity based on your logic here
  // For example, you can calculate the number of reviews for each product
  const productsWithPopularity = products.map((product) => {
    const productReviews = reviews.filter(
      (review) => review.product_id === product.product_id
    );
    return {
      ...product,
      popularity: productReviews.length,
    };
  });

  const popularItems = productsWithPopularity
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);

  return (
    <VStack spacing={4} align="stretch">
      {popularItems.map((item) => (
        <Box
          key={item.product_id}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="2xl"
          transition="all 0.2s"
          _hover={{ transform: "scale(1.02)" }}
        >
          <Text fontWeight="bold">{item.name}</Text>
          <Text>Popularity: {item.popularity}</Text>
        </Box>
      ))}
    </VStack>
  );
};

export default PopularItems;
