import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Box, Button } from "@chakra-ui/react";

const ReviewTable = ({
  reviews,
  isDeleteMode,
  handleSelectReview,
  selectedReviews,
  onDeleteReview,
}) => (
  <Box maxH="calc(100vh - 120px)" overflowY="auto">
    <Table variant="simple" size="sm" width="100%">
      <Thead
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          backgroundColor: "teal.500",
        }}
      >
        <Tr>
          {isDeleteMode && (
            <Th color="white" p={2}>
              Select
            </Th>
          )}
          <Th color="white" p={2}>
            ID
          </Th>
          <Th color="white" p={2}>
            User ID
          </Th>
          <Th color="white" p={2}>
            Product ID
          </Th>
          <Th color="white" p={2}>
            Rating
          </Th>
          <Th color="white" p={2}>
            Review Text
          </Th>
          <Th color="white" p={2}>
            Deleted
          </Th>
          <Th color="white" p={2}>
            Created At
          </Th>
          <Th color="white" p={2}>
            Updated At
          </Th>
          {isDeleteMode && (
            <Th color="white" p={2}>
              Delete
            </Th>
          )}
        </Tr>
      </Thead>
      <Tbody>
        {reviews.map((review) => (
          <Tr key={review.review_id}>
            {isDeleteMode && (
              <Td>
                <input
                  type="checkbox"
                  checked={selectedReviews.includes(review.review_id)}
                  onChange={() => handleSelectReview(review.review_id)}
                />
              </Td>
            )}
            <Td>{review.review_id}</Td>
            <Td>{review.user_id}</Td>
            <Td>{review.product_id}</Td>
            <Td>{review.rating}</Td>
            <Td>{review.review_text}</Td>
            <Td>{review.is_deleted}</Td>
            <Td>{review.createdAt}</Td>
            <Td>{review.updatedAt}</Td>
            {isDeleteMode && (
              <Td>
                <Button onClick={() => onDeleteReview(review.review_id)} colorScheme="red">
                  Delete
                </Button>
              </Td>
            )}
          </Tr>
        ))}
      </Tbody>
    </Table>
  </Box>
);

export default ReviewTable;
