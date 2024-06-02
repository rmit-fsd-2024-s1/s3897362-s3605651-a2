import React from "react";
import { useQuery, gql } from "@apollo/client";
import { ResponsivePie } from "@nivo/pie";

const GET_ALL_REVIEWS = gql`
  query GetAllReviews {
    getAllReviews {
      product_id
      rating
    }
  }
`;

const GET_PRODUCTS = gql`
  query GetAllProducts {
    getAllProducts {
      product_id
      name
      isSpecial
    }
  }
`;

const OverallReviewsPie = () => {
  const {
    loading: reviewsLoading,
    error: reviewsError,
    data: reviewsData,
  } = useQuery(GET_ALL_REVIEWS);
  const {
    loading: productsLoading,
    error: productsError,
    data: productsData,
  } = useQuery(GET_PRODUCTS);

  if (reviewsLoading || productsLoading) return <p>Loading...</p>;
  if (reviewsError || productsError) return <p>Error :(</p>;

  const reviews = reviewsData.getAllReviews;
  const products = productsData.getAllProducts;

  // Create a map of product ids to product names
  const productNames = products.reduce((names, product) => {
    names[product.product_id] = product.name;
    return names;
  }, {});

  // Count reviews for each product
  const reviewCounts = reviews.reduce((counts, review) => {
    counts[review.product_id] = (counts[review.product_id] || 0) + 1;
    return counts;
  }, {});

  // Convert to array format for pie chart
  const pieData = Object.entries(reviewCounts).map(([id, count]) => ({
    id: productNames[id], // Use product name instead of id
    label: productNames[id],
    value: count,
  }));

  return (
    <div style={{ height: "500px" }}>
      <ResponsivePie
        data={pieData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: "nivo" }}
        borderWidth={1}
        borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextColor="#333333"
        radialLabelsLinkColor={{ from: "color" }}
        sliceLabelsSkipAngle={10}
        sliceLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

export default OverallReviewsPie;
