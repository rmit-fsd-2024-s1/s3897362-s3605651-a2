import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect';
import ReviewModal from "../src/components/ReviewModal.js";
import { getReviewsByProductId, deleteReviewByUser } from "../src/data/repository";

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
}));

jest.mock("../src/data/repository");

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
    render(<ReviewModal isOpen={true} onClose={jest.fn()} productId={productId} />);

    // Wait for reviews to be loaded and rendered
    await waitFor(() => expect(screen.getByText("Great product")).toBeInTheDocument());

    // Debugging: log the rendered HTML to see what's rendered
    screen.debug();

    // Check that the first review (Matches currentUser) has edit and delete buttons
    const deleteButtons = await screen.findAllByText("Delete");
    const editButtons = await screen.findAllByText("Edit");

    // Debugging: log the buttons found
    console.log("Delete Buttons:", deleteButtons);
    console.log("Edit Buttons:", editButtons);

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
