import { Box, Text } from "@chakra-ui/react";
import { Fade } from "@chakra-ui/transition";

/**
 * Footer Component
 * Contains the footer text for the application.
 */
const Footer = () => {
  return (
    <Fade in={true}>
      <Box
        textAlign="center"
        fontSize={{ sm: "9px", md: "xs" }}
        textColor={"card"}
      >
        Made by{" "}
        <Text as="span" fontWeight="bold" color="darkGreen">
          Sagar Datta
        </Text>{" "}
        (s3605651) and{" "}
        <Text as="span" fontWeight="bold" color="darkGreen">
          Matthew Jackson
        </Text>{" "}
        (s3897362) for COSC2758 Full Stack Development.
      </Box>
    </Fade>
  );
};

export default Footer;
