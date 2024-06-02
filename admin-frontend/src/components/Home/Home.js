import React from "react";
import { useQuery, gql } from "@apollo/client";
import { SimpleGrid, Box, Heading } from "@chakra-ui/react";
import SpecialPie from "./Analytics/SpecialPie";
import RecentReviews from "./Analytics/RecentReviews";

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
      <Box>
        <Heading pt={5} pl={5} as="h2" size="lg" color="gray.500">
          Products on Special
        </Heading>
        <SpecialPie chartData={chartData} />
      </Box>
      <Box>
        <Heading mb={5} pt={5} pl={5} as="h2" size="lg" color="gray.500">
          Recent Reviews
        </Heading>
        <RecentReviews />
      </Box>
    </SimpleGrid>
  );
};

export default Home;
