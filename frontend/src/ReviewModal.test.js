/*
The reasoning behind this unit test is that a users ability to edit reviews
is soley dependant on the userId of the current user and the user that made
the original review
*/

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import ReviewModal from "../src/components/ReviewModal.js";
import { getReviewsByProductId, deleteReviewByUser } from "../src/data/repository";

// Mock so that we can bypassing importing axios 
jest.clearAllMocks()
jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
}));
jest.mock("../src/data/repository");

// Mock reviews so that we can test seperatley from the backend
describe("ReviewModal Component - User ID System", () => {
  const productId = 1;
  const currentUser = { user_id: 1, username: "testuser" };
  const reviews = [
    { review_id: 1, user_id: 1, review_text: "Great product", rating: 5, User: { username: "testuser1" } },
    { review_id: 2, user_id: 2, review_text: "Not bad", rating: 3, User: { username: "testuser2" } },
  ];

  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => JSON.stringify(currentUser));
    getReviewsByProductId.mockResolvedValue(reviews);
  });

  it("should allow the user to edit or delete their own reviews only", async () => {
    render(<ReviewModal isOpen={true} onClose={jest.fn()} productId={productId} productName="Test Product" />);

    await waitFor(() => {
      expect(screen.getByText("Great product")).toBeInTheDocument();
      expect(screen.getByText("Not bad")).toBeInTheDocument();
    });

    screen.debug();

    // Check that ids match and code executes
    const deleteButtons = screen.getAllByLabelText("Delete review");
    const editButtons = screen.getAllByLabelText("Edit review");
    expect(deleteButtons.length).toBe(1);
    expect(editButtons.length).toBe(1);

    // Check that buttons are not present on id mismatch so users cannot edit and delet other users reviews
    const secondReview = screen.getByText("Not bad").closest('div');
    expect(secondReview).not.toHaveTextContent("Delete review");
    expect(secondReview).not.toHaveTextContent("Edit review");

    // Check for delete
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => expect(deleteReviewByUser).toHaveBeenCalledWith(1));

    // Check for edit
    fireEvent.click(editButtons[0]);
    expect(await screen.findByText("Update Review")).toBeInTheDocument();
  });
});
