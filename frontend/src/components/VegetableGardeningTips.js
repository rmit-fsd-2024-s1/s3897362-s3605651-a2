import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  SimpleGrid,
  Container,
  Flex,
} from "@chakra-ui/react";
import { Fade } from "@chakra-ui/transition";

/**
 * Gardening Tips Array
 * Contains an array of objects, each representing a gardening tip.
 * Each object has the following properties:
 * - id: number
 * - title: string
 * - content: string
 */
const gardeningTips = [
  {
    id: 1,
    title: "Choose the Right Location",
    content:
      "Look for a spot that receives at least 6 hours of sunlight daily. Adequate sunlight is crucial for the growth of most vegetables.",
  },
  {
    id: 2,
    title: "Start Small",
    content:
      "Begin with a few pots or a small plot to easily manage your garden. Starting small helps you learn and adjust without becoming overwhelmed.",
  },
  {
    id: 3,
    title: "Select Suitable Vegetables",
    content:
      "Opt for vegetables that grow well in your climate and soil type. Consider starting with easy-to-grow options like lettuce, radishes, or cherry tomatoes.",
  },
  {
    id: 4,
    title: "Ensure Proper Soil Preparation",
    content:
      "Enrich your soil with compost and organic matter to improve fertility. Good soil is the foundation of a healthy garden.",
  },
  {
    id: 5,
    title: "Regular Watering",
    content:
      "Keep the soil consistently moist but not waterlogged. Vegetable gardens typically need about 1 inch of water per week.",
  },
  {
    id: 6,
    title: "Practice Crop Rotation",
    content:
      "Avoid planting the same vegetable in the same spot each year to prevent soil depletion and reduce disease risk.",
  },
  {
    id: 7,
    title: "Use Natural Pest Control",
    content:
      "Employ organic methods like companion planting or beneficial insects to manage pests without harmful chemicals.",
  },
  {
    id: 8,
    title: "Mulch to Conserve Moisture",
    content:
      "Apply a layer of mulch around your plants to help retain soil moisture and suppress weeds.",
  },
  {
    id: 9,
    title: "Fertilize Thoughtfully",
    content:
      "Use organic fertilizers to provide your plants with necessary nutrients without overloading them with chemicals.",
  },
  {
    id: 10,
    title: "Harvest at the Right Time",
    content:
      "Pick vegetables when they are mature but not overripe for the best flavor. Regular harvesting often encourages more production.",
  },
];

const VegetableGardeningTips = () => {
  return (
    <Fade in={true}>
      <Container maxW="container.xl" centerContent p={0}>
        <Heading
          as="h1"
          size="lg"
          fontFamily="'Josefin Sans', sans-serif"
          textAlign="center"
          mt={4}
          mb={5}
          textColor={"heading"}
        >
          Ten Small Vegetable Gardening Tips
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={10} pb={8}>
          {/* Map over the gardeningTips array to display each tip */}
          {gardeningTips.map((tip) => (
            <Box
              key={tip.id}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
              borderColor={"beige"}
              bg="card"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.02)" }}
            >
              <VStack spacing={4} align="stretch">
                <Flex justifyContent="space-between" alignItems="center">
                  {/* Tip ID and Title */}
                  <Text fontSize="3xl" fontWeight="bold" color="orange.400">
                    {tip.id}
                  </Text>
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    textAlign="center"
                    flexGrow={1}
                    textColor={"heading"}
                  >
                    {tip.title}
                  </Text>
                </Flex>
                <Divider borderColor="lightGreen" />
                {/* Tip Content */}
                <Text textColor={"text"}>{tip.content}</Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Fade>
  );
};

export default VegetableGardeningTips;
