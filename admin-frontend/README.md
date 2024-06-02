# Home Analytics Page

The Home Analytics page is composed of several components, each displaying a specific set of data.

## Components

### [`SpecialPie`](admin-frontend/src/components/Home/Analytics/SpecialPie.js)

This component displays a pie chart showing the ratio of total stock of products that are on special.

### [`RecentReviews`](admin-frontend/src/components/Home/Analytics/RecentReviews.js)

This component is responsible for displaying the most recent reviews.

### [`PopularItems`](admin-frontend/src/components/Home/Analytics/PopularItems.js)

This component displays a bar chart of the top 3 most reviewed products. The bars are color-coded based on the review sentiment (deleted, bad, average, positive).

### [`OverallReviewsPie`](admin-frontend/src/components/Home/Analytics/OverallReviewsPie.js)

This component displays a pie chart showing the overall sentiment of all reviews.

### [`SentimentPie`](admin-frontend/src/components/Home/Analytics/SentimentPie.js)

This component displays a pie chart showing the general sentiment towards our products.

### [`MostActiveUsers`](admin-frontend/src/components/Home/Analytics/MostActiveUsers.js)

This component displays a chart showing the most active and engaging users.

## Usage

Each component is used in the [`Home`](admin-frontend/src/components/Home/Home.js) component. They are placed inside a `SimpleGrid` component from the Chakra UI library, which is responsible for the layout of the components on the page.

The data for these components is fetched using the `useQuery` hook from the Apollo Client library. The GraphQL query `GET_PRODUCTS` is used to fetch all products, and the data is then filtered and manipulated as needed for each component.

# ProductList Component
The ProductList component in admin-frontend/src/components/ProductList/ProductList.js is a key part of the application. It allows you to manage products in various ways.

## Adding a Product
To add a product, click the "Add Product" button. This opens a modal where you can enter the product's details:

- name
- description
- price
- quantity
- unit
- image
- isSpecial
- specialPrice

After filling out the form, click the "Add" button to create the product. The new product will then appear in the product list.

## Editing a Product
To edit a product, first select the product from the list by clicking on it. Then, click the "Edit Product" button. This opens a modal with the product's current details pre-filled. You can change any of these details. After making your changes, click the "Update" button to save them.

## Deleting a Product
To delete a product, first select the product from the list by clicking on it. Then, click the "Delete Product" button. This opens a dialog asking you to confirm the deletion. Click the "Confirm" button to delete the product.

## Selecting a Product
To select a product, simply click on it in the list. If you click on a product that is already selected, it will be deselected.

## Note
The "Add Product", "Edit Product", and "Delete Product" buttons are mutually exclusive. If one mode is active, the others are disabled. For example, if you are in "Delete Product" mode, you cannot add or edit products until you exit "Delete Product" mode.

The "Edit Product" and "Delete Product" modes also require a product to be selected. If no product is selected, these buttons are disabled.

# ReviewList Component
The ReviewList component is a part of the admin frontend, which allows administrators to manage and delete reviews. This component is located in the file admin-frontend/src/components/ReviewList/ReviewList.js.

## Overview
The ReviewList component fetches all reviews from the backend using the GET_REVIEWS GraphQL query. It displays these reviews in a table, where each row represents a review and includes a checkbox for selection.

The component maintains a state selectedReviews which is an array of review IDs that the admin has selected for deletion.

A "Delete Review" button is provided. When clicked, it opens a dialog box asking for confirmation of the deletion. This dialog box is implemented by the DeleteReviewDialog component from admin-frontend/src/components/ReviewList/DeleteReviewDialog.js.

## Deletion Process
The deletion process is handled by the handleDelete function. This function iterates over the selectedReviews array and for each review, it calls the updateReview mutation with the review ID, a placeholder text indicating the review has been deleted, and a flag is_deleted set to true.

After the deletion, the selectedReviews array is cleared and the dialog box is close