import React from "react";
import { useQuery, gql } from "@apollo/client";
import { ResponsivePie } from "@nivo/pie";

const GET_ALL_REVIEWS = gql`
  query GetAllReviews {
    getAllReviews {
      user_id
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

const MostActiveUsers = () => {
  const {
    loading: reviewsLoading,
    error: reviewsError,
    data: reviewsData,
  } = useQuery(GET_ALL_REVIEWS);
  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery(GET_ALL_USERS);

  if (reviewsLoading || usersLoading) return <p>Loading...</p>;
  if (reviewsError || usersError) return <p>Error :(</p>;

  const reviews = reviewsData.getAllReviews;
  const users = usersData.getAllUsers;

  // Create a map of user ids to usernames
  const usernames = users.reduce((names, user) => {
    names[user.user_id] = user.username;
    return names;
  }, {});

  // Count reviews for each user
  const reviewCounts = reviews.reduce((counts, review) => {
    counts[review.user_id] = (counts[review.user_id] || 0) + 1;
    return counts;
  }, {});

  // Convert to array format for pie chart
  const pieData = Object.entries(reviewCounts).map(([id, count]) => ({
    id: usernames[id], // Use username instead of id
    label: usernames[id],
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
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        activeOuterRadiusOffset={8}
        colors={{ scheme: "dark2" }}
      />
    </div>
  );
};

export default MostActiveUsers;
