import React from "react";
import { useQuery, gql } from "@apollo/client";
import { ResponsivePie } from "@nivo/pie";

const GET_ALL_REVIEWS = gql`
  query GetAllReviews {
    getAllReviews {
      rating
    }
  }
`;

const SentimentPie = () => {
  const {
    loading: reviewsLoading,
    error: reviewsError,
    data: reviewsData,
  } = useQuery(GET_ALL_REVIEWS);

  if (reviewsLoading) return <p>Loading...</p>;
  if (reviewsError) return <p>Error :(</p>;

  const reviews = reviewsData.getAllReviews;

  // Count reviews for each rating
  const reviewCounts = reviews.reduce((counts, review) => {
    counts[review.rating] = (counts[review.rating] || 0) + 1;
    return counts;
  }, {});

  // Convert to array format for pie chart
  const pieData = Object.entries(reviewCounts).map(([rating, count]) => ({
    id: rating,
    label: `Rating ${rating}`,
    value: count,
  }));
  const colors = ["#f54242", "#f5a442", "#f5d142", "#b5f542", "#42f554"];
  return (
    <div style={{ height: "500px" }}>
      <ResponsivePie
        data={pieData}
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={colors}
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
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        activeOuterRadiusOffset={8}
      />
    </div>
  );
};

export default SentimentPie;
