import React from "react";
import { useQuery, gql } from "@apollo/client";
import { ResponsivePie } from "@nivo/pie";

const GET_PRODUCTS = gql`
  query GetAllProducts {
    getAllProducts {
      name
      isSpecial
    }
  }
`;

const Home = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const specialProducts = data.getAllProducts.filter(
    (product) => product.isSpecial
  );
  const notSpecialProducts = data.getAllProducts.filter(
    (product) => !product.isSpecial
  );

  const chartData = [
    {
      id: "special",
      label: "Special",
      value: specialProducts.length,
    },
    {
      id: "notSpecial",
      label: "Not Special",
      value: notSpecialProducts.length,
    },
  ];

  return (
    <div>
      <h1>Special Products:</h1>
      {specialProducts.map((product) => (
        <p key={product.name}>{product.name}</p>
      ))}
      <div style={{ height: 400 }}>
        <ResponsivePie
          data={chartData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={{ scheme: "nivo" }}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
        />
      </div>
    </div>
  );
};

export default Home;
