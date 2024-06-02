

/*  This unit test is designed to verify that the user checking of current user and the user who wrote a review is correct
    This is smportant as it ensures we dont acidentally allow somone to delete or edit a review that is not their's
*/
// Need to pull functions from repository to do the test
jest.mock("axios");
jest.mock("../src/data/repository");

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import ReviewModal from "../src/components/ReviewModal";
import { getReviewsByProductId, deleteReviewByUser } from "../src/data/repository";

describe("ReviewModal Component - User ID System", () => {
  const productId = 1;
  const currentUser = { user_id: 1, username: "testuser" };
  // Mock reviews as the contents excluding user id is not important in testing
  const reviews = [
    { review_id: 1, user_id: 1, review_text: "Great product", rating: 5 },
    { review_id: 2, user_id: 2, review_text: "Not bad", rating: 3 },
  ];

  beforeEach(() => {
    // Mock localStorage to set a current user
    Storage.prototype.getItem = jest.fn(() => JSON.stringify(currentUser));
    getReviewsByProductId.mockResolvedValue(reviews);
  });

  it("should allow the user to edit or delete their own reviews only", async () => {
    render(<ReviewModal isOpen={true} onClose={jest.fn()} productId={productId} />);

    // Check that the first review (Matches currentUser) has edit and delete buttons
    const deleteButtons = await screen.findAllByText("Delete");
    const editButtons = await screen.findAllByText("Edit");
    expect(deleteButtons.length).toBe(1);
    expect(editButtons.length).toBe(1);

    // Check that the second review (Does not match currentUser) does not have edit or delete buttons
    const secondReview = screen.getByText("Not bad").closest('div');
    expect(secondReview).not.toHaveTextContent("Delete");
    expect(secondReview).not.toHaveTextContent("Edit");

    // Check if delete function is called correctly
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => expect(deleteReviewByUser).toHaveBeenCalledWith(1));

    // Check if edit form appears
    fireEvent.click(editButtons[0]);
    expect(await screen.findByText("Update Review")).toBeInTheDocument();
  });
});
