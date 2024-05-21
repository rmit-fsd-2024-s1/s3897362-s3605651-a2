import React from "react";
import { Heading, Flex, Button } from "@chakra-ui/react";
import { Fade } from "@chakra-ui/transition";

/**
 * Header Component
 * Contains the header for the application.
 * The header displays the application name and logo.
 */
const Header = ({ changeView }) => {
  return (
    <Fade in={true}>
      <Flex align="center" justify="center" h="100%">
        <Button
          onClick={() => changeView("main")}
          variant="ghost"
          _hover={{ bg: "transparent" }}
          _active={{ bg: "transparent" }}
        >
          <Heading
            fontWeight="700"
            size="3xl"
            noOfLines={1}
            _hover={{ transform: "scale(0.96)" }}
            transition="all 0.2s"
            mt={12}
            color={"beige"}
          >
            SOIL
          </Heading>
        </Button>
      </Flex>
    </Fade>
  );
};

export default Header;
