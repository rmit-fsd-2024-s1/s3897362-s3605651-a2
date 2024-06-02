import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Box, Text, Badge, VStack, HStack } from "@chakra-ui/react";
import StarRatings from "react-star-ratings";

const GET_ALL_REVIEWS = gql`
  query GetAllReviews {
    getAllReviews {
      review_id
      user_id
      product_id
      rating
      review_text
      createdAt
      updatedAt
      is_deleted
    }
  }
`;

const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      user_id
      username
    }
  }
`;

const GET_PRODUCT_NAME = gql`
  query GetAllProducts {
    getAllProducts {
      product_id
      name
    }
  }
`;

const RecentReviews = () => {
  const { loading, error, data } = useQuery(GET_ALL_REVIEWS);
  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery(GET_ALL_USERS);
  const {
    loading: productsLoading,
    error: productsError,
    data: productsData,
  } = useQuery(GET_PRODUCT_NAME);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const recentReviews = data.getAllReviews
    .filter((review) => !review.is_deleted)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  const userIdToUsername = {};
  if (usersData) {
    usersData.getAllUsers.forEach((user) => {
      userIdToUsername[user.user_id] = user.username;
    });
  }
  const productIdToName = {};
  if (productsData) {
    productsData.getAllProducts.forEach((product) => {
      productIdToName[product.product_id] = product.name;
    });
  }

  return (
    <VStack spacing={4} align="stretch">
      {recentReviews.map((review) => (
        <Box
          key={review.review_id}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="2xl"
          transition="all 0.2s"
          _hover={{ transform: "scale(1.02)" }}
        >
          <HStack spacing={2}>
            <Text fontWeight="bold">User:</Text>
            <Text>{userIdToUsername[review.user_id]}</Text>
          </HStack>
          <HStack spacing={2}>
            <Text fontWeight="bold">Product:</Text>
            <Text>{productIdToName[review.product_id]}</Text>
          </HStack>
          <HStack spacing={2}>
            <Text fontWeight="bold">Rating:</Text>
            <StarRatings
              rating={Number(review.rating) || 0}
              starRatedColor="gold"
              starEmptyColor="gray"
              starDimension="20px"
              starSpacing="2px"
              numberOfStars={5}
              name="rating"
            />
          </HStack>
          <HStack spacing={2}>
            <Text fontWeight="bold">Review:</Text>
            <Text>{review.review_text}</Text>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default RecentReviews;
