import React, { useState } from "react";
import { Box, Heading, Flex, Button } from "@chakra-ui/react";
import Home from "./components/Home";
import ProductList from "./components/ProductList/ProductList";

const App = () => {
  const [selectedPage, setSelectedPage] = useState("home");

  const renderContent = () => {
    switch (selectedPage) {
      case "products":
        return <ProductList />;
      case "home":
      default:
        return <Home />;
    }
  };

  return (
    <Box>
      <Heading
        as="h1"
        p={5}
        bg="teal.500"
        color="white"
        textAlign="center"
        position="fixed"
        top={0}
        width="100%"
        zIndex={1}
      >
        Admin Dashboard
      </Heading>
      <Flex>
        <Box
          as="nav"
          p={5}
          bg="gray.100"
          position="fixed"
          top="72px"
          left={0}
          height="calc(100vh - 72px)"
          minWidth="200px"
          maxWidth="200px"
          flexShrink={0}
          overflowY="auto"
        >
          <Flex direction="column" align="flex-start">
            <Button onClick={() => setSelectedPage("home")} mb={4} width="100%">
              Home
            </Button>
            <Button
              onClick={() => setSelectedPage("products")}
              mb={4}
              width="100%"
            >
              Products
            </Button>
          </Flex>
        </Box>
        <Box
          as="main"
          p={5}
          flexGrow={1}
          ml="200px"
          mt="72px"
          overflow="auto"
          height="calc(100vh - 72px)"
        >
          {renderContent()}
        </Box>
      </Flex>
    </Box>
  );
};

export default App;
