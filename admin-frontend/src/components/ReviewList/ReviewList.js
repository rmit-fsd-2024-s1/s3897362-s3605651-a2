import React, { useState, useRef } from "react";
import {
  Box,
  Spinner,
  Text,
  Flex,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { useQuery, gql, useMutation } from "@apollo/client";
import DeleteReviewDialog from "./DeleteReviewDialog";

const GET_REVIEWS = gql`
  query GetAllReviews {
    getAllReviews {
      review_id
      user_id
      product_id
      rating
      review_text
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_REVIEW = gql`
  mutation UpdateReview(
    $review_id: ID!
    $review_text: String!
    $is_deleted: Boolean!
  ) {
    updateReview(
      review_id: $review_id
      review_text: $review_text
      is_deleted: $is_deleted
    ) {
      review_id
      review_text
      is_deleted
    }
  }
`;

const ReviewList = () => {
  const { loading, error, data } = useQuery(GET_REVIEWS);

  const [selectedReviews, setSelectedReviews] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [updateReview] = useMutation(UPDATE_REVIEW, {
    refetchQueries: [GET_REVIEWS],
  });
  const cancelRef = useRef();

  if (loading) return <Spinner />;
  if (error) return <Text>Error :(</Text>;

  const handleDelete = () => {
    selectedReviews.forEach((review_id) => {
      updateReview({
        variables: {
          review_id,
          review_text: "[**** THIS REVIEW HAS BEEN DELETED BY AN ADMIN ****]",
          is_deleted: true,
        },
      });
    });
    setSelectedReviews([]);
    setIsDialogOpen(false);
  };

  const handleSelectReview = (review_id) => {
    setSelectedReviews((prevSelected) =>
      prevSelected.includes(review_id) ? [] : [review_id]
    );
  };

  const reviewIds = selectedReviews;

  return (
    <Box p={5} width="100%" height="100%" display="flex" flexDirection="column">
      <Box position="sticky" top={0} bg="white" zIndex={2} pb={4}>
        <Flex justifyContent="space-between" mb={4}>
          <Button
            colorScheme="red"
            onClick={() => setIsDialogOpen(true)}
            isDisabled={selectedReviews.length === 0}
          >
            Delete Review
          </Button>
        </Flex>
      </Box>
      <Box flex="1" overflowY="auto" height="calc(100vh - 120px)">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Select</Th>
              <Th>Review ID</Th>
              <Th>User ID</Th>
              <Th>Product ID</Th>
              <Th>Rating</Th>
              <Th>Review Text</Th>
              <Th>Created At</Th>
              <Th>Updated At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.getAllReviews.map((review) => (
              <Tr key={review.review_id}>
                <Td>
                  <input
                    type="checkbox"
                    checked={selectedReviews.includes(review.review_id)}
                    onChange={() => handleSelectReview(review.review_id)}
                  />
                </Td>
                <Td>{review.review_id}</Td>
                <Td>{review.user_id}</Td>
                <Td>{review.product_id}</Td>
                <Td>{review.rating}</Td>
                <Td>{review.review_text}</Td>
                <Td>{review.createdAt}</Td>
                <Td>{review.updatedAt}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <DeleteReviewDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        cancelRef={cancelRef}
        handleDelete={handleDelete}
        reviewIds={reviewIds}
      />
    </Box>
  );
};

export default ReviewList;
