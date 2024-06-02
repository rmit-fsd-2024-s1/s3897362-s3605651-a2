import React from "react";
import { useQuery, gql } from "@apollo/client";
import { ResponsiveBar } from "@nivo/bar";

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
      is_deleted
      rating
      updatedAt
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

  const data = products.map((product) => {
    const productReviews = reviews.filter(
      (review) => review.product_id === product.product_id
    );
    const deletedReviews = productReviews.filter((review) => review.is_deleted);
    const nonDeletedReviews = productReviews.filter(
      (review) => !review.is_deleted
    );

    const positiveReviews = nonDeletedReviews.filter(
      (review) => review.rating >= 4
    );
    const averageReviews = nonDeletedReviews.filter(
      (review) => review.rating === 3
    );
    const badReviews = nonDeletedReviews.filter((review) => review.rating <= 2);

    return {
      product: product.name,
      deleted: deletedReviews.length,
      positive: positiveReviews.length,
      average: averageReviews.length,
      bad: badReviews.length,
    };
  });

  // Calculate total reviews for each product
  const dataWithTotalReviews = data.map((item) => ({
    ...item,
    totalReviews: item.deleted + item.positive + item.average + item.bad,
  }));

  // Sort the data based on total reviews in descending order
  const sortedData = dataWithTotalReviews.sort(
    (a, b) => b.totalReviews - a.totalReviews
  );

  // Get the top 3 most reviewed products
  const top3Data = sortedData.slice(0, 3);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ height: "500px" }}>
        <ResponsiveBar
          data={top3Data}
          keys={["deleted", "bad", "average", "positive"]}
          indexBy="product"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={({ id, data }) => {
            switch (id) {
              case "deleted":
                return "#333333"; // dark gray
              case "positive":
                return "#4CAF50"; // green
              case "average":
                return "#FFEB3B"; // yellow
              case "bad":
                return "#F44336"; // red
              default:
                return "#9E9E9E"; // gray
            }
          }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "country",
            legendPosition: "middle",
            legendOffset: 32,
            truncateTickAt: 0,
          }}
          axisLeft={{
            format: (value) => (Number.isInteger(value) ? value : ""),
          }}
          enableLabel={false}
        />
      </div>
    </div>
  );
};

export default PopularItems;
