import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { SimpleGrid, Box } from "@chakra-ui/react";

Chart.register(ArcElement);

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

  const regularProducts = data.getAllProducts.filter(
    (product) => !product.isSpecial
  );

  const pieData = {
    labels: ["Special Products", "Regular Products"],
    datasets: [
      {
        data: [specialProducts.length, regularProducts.length],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  return (
    <SimpleGrid columns={3} spacing={10}>
      <Box
        bg="card"
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        borderColor={"beige"}
        transition="all 0.2s"
        _hover={{ transform: "scale(1.01)" }}
        marginBottom="1em" // Add space between the cards
      >
        <h1>Products:</h1>
        <Pie data={pieData} />
      </Box>
      <Box
        bg="card"
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        borderColor={"beige"}
        transition="all 0.2s"
        _hover={{ transform: "scale(1.01)" }}
        marginBottom="1em" // Add space between the cards
      ></Box>{" "}
      {/* Empty Box for first column */}
      <Box
        bg="card"
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        borderColor={"beige"}
        transition="all 0.2s"
        _hover={{ transform: "scale(1.01)" }}
        marginBottom="1em" // Add space between the cards
      ></Box>{" "}
      {/* Empty Box for third column */}
    </SimpleGrid>
  );
};

export default Home;
