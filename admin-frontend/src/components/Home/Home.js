import React from "react";
import { useQuery, gql } from "@apollo/client";
import { SimpleGrid } from "@chakra-ui/react";
import SpecialPie from "./SpecialPie/SpecialPie";

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
      productNames: specialProducts.map((product) => product.name),
    },
    {
      id: "notSpecial",
      label: "Not Special",
      value: notSpecialProducts.length,
      productNames: notSpecialProducts.map((product) => product.name),
    },
  ];
  return (
    <SimpleGrid columns={3} spacing={10}>
      <SpecialPie chartData={chartData} />
    </SimpleGrid>
  );
};

export default Home;
