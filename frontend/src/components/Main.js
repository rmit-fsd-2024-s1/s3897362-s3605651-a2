import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  SimpleGrid,
  useTheme,
  Image,
  Skeleton,
} from "@chakra-ui/react";
import { Fade } from "@chakra-ui/transition";

const Main = ({ changeView }) => {
  const theme = useTheme();
  const [isLoaded, setIsLoaded] = React.useState(false);
  return (
    <Fade in={true}>
      <Flex direction="column" p={5} gap={6}>
        <Box maxWidth="1200" margin="0 auto">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <Box>
              {/* Heading and Text */}
              <Heading as="h1" size="xl" mb={4} textColor={"heading"}>
                Welcome to SOIL
              </Heading>
              <Text fontSize="lg" mb={4} textColor={"text"}>
                At SOIL Organics, we believe in the power of nature. Our mission
                is to provide you with the finest selection of organic
                groceries, sourced directly from local farms. We're not just a
                grocery store - we're a community dedicated to sustainable
                living.
                <br></br>
                <br></br>
                Explore our range of fresh produce, dairy, and pantry staples,
                all certified organic and free from harmful chemicals. But we're
                more than just a store. We're a hub for learning about the
                benefits of organic food, understanding nutrition, and
                discovering the principles of organic farming.
                <br></br>
                <br></br>
                Join us on our journey towards a healthier, more sustainable
                future. Start shopping with SOIL Organics today and make a
                difference with every meal.
              </Text>
              <Button
                bg={"darkGreen"}
                textColor={"beige"}
                // Add onClick event to change the view to "products"
                onClick={() => changeView("products")}
                _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
              >
                Explore Our Organic Selection!
              </Button>
            </Box>
            <Box>
              {/* Skeleton Image with fallback */}
              <Skeleton isLoaded={isLoaded} height="450px" borderRadius="lg">
                <Image
                  src={"/images/groceries.jpg"}
                  alt={"Grocery Store"}
                  objectFit="cover"
                  boxSize="450px"
                  width="100%"
                  borderRadius="lg"
                  mb={{ base: 4, md: 0 }} // Add bottom margin only on base, remove on md size and above
                  transition="all 0.2s"
                  _hover={{ transform: "scale(1.01)" }}
                  onLoad={() => setIsLoaded(true)}
                />
              </Skeleton>
            </Box>
          </SimpleGrid>
        </Box>
        <Box maxWidth="1200" margin="0 auto">
          <SimpleGrid columns={[1, null, 2]} spacing="40px">
            <Box
              bg="card"
              p={5}
              transition="all 0.2s"
              _hover={{ transform: "scale(1.02)" }}
              shadow="md"
              borderWidth="1px"
              borderColor={"beige"}
              borderRadius="lg"
            >
              <Heading as="h3" size="lg" mb={4} textColor={"heading"}>
                Fresh Organic Produce
              </Heading>
              <Text mb={4} textColor={"text"}>
                We offer a wide range of fresh, organic fruits and vegetables
                sourced directly from local farms. Our produce is free from
                harmful pesticides and chemicals, ensuring you get the best
                quality and taste.
              </Text>
            </Box>

            <Box
              bg="card"
              p={5}
              shadow="md"
              borderWidth="1px"
              borderColor={"beige"}
              borderRadius="lg"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.02)" }}
            >
              <Heading as="h3" size="lg" mb={4} textColor={"heading"}>
                Sustainable Practices
              </Heading>
              <Text mb={4} textColor={"text"}>
                At SOIL Organics, we believe in sustainability. We work closely
                with farmers who use environmentally friendly farming practices.
                Our packaging is also eco-friendly, reducing our carbon
                footprint.
              </Text>
            </Box>
            <Box
              bg="card"
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
              borderColor={"beige"}
              transition="all 0.2s"
              _hover={{ transform: "scale(1.02)" }}
            >
              <Heading as="h3" size="lg" mb={4} textColor={"heading"}>
                {/* Add onClick event to change the view to "products" */}
                <span
                  onClick={() => changeView("products")}
                  style={{ cursor: "pointer", color: theme.colors.heading }}
                  onMouseOver={(e) =>
                    (e.target.style.color = theme.colors.text)
                  }
                  onMouseOut={(e) =>
                    (e.target.style.color = theme.colors.heading)
                  }
                >
                  Special Deals
                </span>
              </Heading>
              <Text mb={4} textColor={"text"}>
                Check out our{" "}
                {/* Add onClick event to change the view to "products" */}
                <span
                  onClick={() => changeView("products")}
                  style={{ cursor: "pointer", color: theme.colors.text }}
                  onMouseOver={(e) =>
                    (e.target.style.color = theme.colors.heading)
                  }
                  onMouseOut={(e) => (e.target.style.color = theme.colors.text)}
                >
                  products
                </span>{" "}
                page for special deals on our organic products. We update our
                specials regularly, so there's always something new to discover.
              </Text>
            </Box>

            <Box
              bg="card"
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
              borderColor={"beige"}
              transition="all 0.2s"
              _hover={{ transform: "scale(1.02)" }}
            >
              <Heading as="h3" size="lg" mb={4} textColor={"heading"}>
                {/* Add onClick event to change the view to "gardening-tips" */}
                <span
                  onClick={() => changeView("diet-plan")}
                  style={{ cursor: "pointer", color: theme.colors.heading }}
                  onMouseOver={(e) =>
                    (e.target.style.color = theme.colors.text)
                  }
                  onMouseOut={(e) =>
                    (e.target.style.color = theme.colors.heading)
                  }
                >
                  Meal Plan
                </span>
              </Heading>
              <Text mb={4} textColor={"text"}>
                Interested in starting your own diet? Visit our{" "}
                {/* Add onClick event to change the view to "gardening-tips" */}
                <span
                  onClick={() => changeView("diet-plan")}
                  style={{ cursor: "pointer", color: theme.colors.text }}
                  onMouseOver={(e) =>
                    (e.target.style.color = theme.colors.heading)
                  }
                  onMouseOut={(e) => (e.target.style.color = theme.colors.text)}
                >
                  meal plan
                </span>{" "}
                page to setup your profile and generate a healthy meal plan for
                your diet.
              </Text>
            </Box>
          </SimpleGrid>
        </Box>
      </Flex>
    </Fade>
  );
};

export default Main;
