import React from "react";
import { useQuery, gql } from "@apollo/client";
import { SimpleGrid, Box, Heading, GridItem, Text } from "@chakra-ui/react";
import SpecialPie from "./Analytics/SpecialPie";
import RecentReviews from "./Analytics/RecentReviews";
import PopularItems from "./Analytics/PopularItems";
import OverallReviewsPie from "./Analytics/OverallReviewsPie";
import SentimentPie from "./Analytics/SentimentPie";
import MostActiveUsers from "./Analytics/MostActiveUsers";

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
      <GridItem colSpan={1}>
        <Box>
          <Heading pt={5} pl={5} as="h2" size="lg" color="gray.500">
            Products on Special
          </Heading>
          <Text pl={5} color="gray.500">
            Ratio of total stock of products that are on special
          </Text>
          <SpecialPie chartData={chartData} />
        </Box>
      </GridItem>
      <GridItem colSpan={2}>
        <Box>
          <Heading mb={5} pt={5} pl={5} as="h2" size="lg" color="gray.500">
            Our Most Reviewed Items
          </Heading>
          <PopularItems />
        </Box>
      </GridItem>
      <GridItem colSpan={1}>
        <Box>
          <Heading mb={5} pt={5} pl={5} as="h2" size="lg" color="gray.500">
            Our Most Reviewed Items
          </Heading>
          <Text pl={5} color="gray.500">
            Our most engaging products, and the sentiment
          </Text>
          <OverallReviewsPie />
        </Box>
      </GridItem>
      <GridItem colSpan={1}>
        <Box>
          <Heading mb={5} pt={5} pl={5} as="h2" size="lg" color="gray.500">
            Product Sentiment
          </Heading>
          <Text pl={5} color="gray.500">
            Out of all reviews the general sentiment to our products
          </Text>
          <SentimentPie />
        </Box>
      </GridItem>
      <GridItem colSpan={1}>
        <Box>
          <Heading mb={5} pt={5} pl={5} as="h2" size="lg" color="gray.500">
            Most Active Users
          </Heading>
          <Text pl={5} color="gray.500">
            Our most active and engaging users
          </Text>
          <MostActiveUsers />
        </Box>
      </GridItem>
    </SimpleGrid>
  );
};

export default Home;
