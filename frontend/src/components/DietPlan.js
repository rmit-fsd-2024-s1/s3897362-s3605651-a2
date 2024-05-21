import React, { useState, useEffect } from "react";
import {
  Fade,
  Heading,
  Box,
  Input,
  Button,
  FormLabel,
  FormControl,
  Text,
  Select,
  Divider,
  SimpleGrid,
  Flex,
  useDisclosure,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Menu,
  MenuButton,
  Link,
  MenuList,
  MenuItem,
  Spinner,
  Skeleton,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

/**
 * DietPlan component
 * Contains the form to create the user's dietary profile
 * Displays the user's dietary information
 * Allows the user to edit their dietary information
 * Generates a meal plan for the user
 * Displays the user's meal plan
 * @returns {JSX.Element} DietPlan component
 */
const DietPlan = () => {
  /**
   * DietPlan component
   *
   * State variables:
   * personalInfo: Array to store the user's personal information
   * userExists: Boolean to check if the user exists
   * userInfo: Object to store the user's information
   * allergens: String to store the user's allergens
   * isOpen: Boolean to control the modal
   * userMealPlan: Object to store the user's meal plan
   * formSubmitted: Boolean to check if the form has been submitted
   * userEmail: String to store the user's email
   */
  const [personalInfo] = useState([]);
  const [userExists, setUserExists] = useState(false);
  const [userInfo, setUserInfo] = useState({
    // State variable to store the user's information
    age: "",
    weight: "",
    height: "",
    activityLevel: "",
    healthGoals: "",
    diet: "",
  });
  const userEmail = localStorage.getItem("userLoggedIn");
  const [allergens, setAllergens] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userMealPlan, setUserMealPlan] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // State variable to check if the data is loading
  const [isLoading, setIsLoading] = useState(true);

  //  State variable to check if the image is loaded
  const [isImgLoaded, setIsImgLoaded] = React.useState(false);

  /**
   * useEffect hook to run the effect whenever the userEmail changes
   * Retrieve the user's information from local storage
   * Check if the user exists
   * Set the user's information and allergens
   * Set the user's meal plan
   */
  useEffect(() => {
    const storedInfo = JSON.parse(localStorage.getItem("personalInfo")) || [];
    const userIndex = storedInfo.findIndex((info) => info.email === userEmail);
    const mealPlans = JSON.parse(localStorage.getItem("mealPlans")) || {};
    const currentUserMealPlan = mealPlans[userEmail];
    if (userIndex !== -1) {
      setUserExists(true);
      setUserInfo(storedInfo[userIndex]);
      if (storedInfo[userIndex].allergens) {
        setAllergens(storedInfo[userIndex].allergens);
      }
    }
    setUserMealPlan(currentUserMealPlan);
    setIsLoading(false);
  }, [userEmail]);

  /**
   * Function to handle changes in the form fields
   * Sets the user's information in the userInfo state
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Check if all fields are filled
    for (let key in userInfo) {
      // Skip the allergens field
      if (key === "allergens") continue;
      if (userInfo[key] === "") {
        // If a field is empty
        alert(`Please fill in your ${key}`); // Alert the user
        return;
      }
    }

    // Calculate the Basal Metabolic Rate (BMR) using the Harris-Benedict equation
    const bmr =
      userInfo.gender === "men"
        ? 10 * userInfo.weight + 6.25 * userInfo.height - 5 * userInfo.age + 5
        : 10 * userInfo.weight +
          6.25 * userInfo.height -
          5 * userInfo.age -
          161;

    // Calculate the Total Daily Energy Expenditure (TDEE) using the BMR and activity level
    let calories;
    switch (userInfo.activityLevel) {
      case "Sedentary":
        calories = bmr * 1.2;
        break;
      case "Lightly active":
        calories = bmr * 1.375;
        break;
      case "Moderately active":
        calories = bmr * 1.55;
        break;
      case "Very active":
        calories = bmr * 1.725;
        break;
      case "Extra active":
        calories = bmr * 1.9;
        break;
      default:
        calories = bmr;
    }

    // Adjust the calories based on the user's health goals
    switch (userInfo.healthGoals) {
      case "lose weight":
        calories -= 500;
        break;
      case "gain weight":
        calories += 500;
        break;
      default:
        break;
    }
    // Store the calculated calories in userInfo
    setUserInfo((prev) => ({ ...prev, calories }));

    let updatedInfo = personalInfo; // Create a copy of the personalInfo array
    // Check if the user already exists in the personalInfo array
    const userIndex = personalInfo.findIndex(
      (info) => info.email === userEmail
    );

    /**
     * If the user exists, update their information
     * If the user doesn't exist, add them to the array
     */
    if (userIndex !== -1) {
      updatedInfo[userIndex] = {
        ...userInfo,
        email: userEmail,
        calories,
        allergens,
      };
    } else {
      updatedInfo = [
        ...personalInfo,
        { ...userInfo, email: userEmail, calories, allergens },
      ];
    }

    // Store the updated information in local storage
    localStorage.setItem("personalInfo", JSON.stringify(updatedInfo));

    // Retrieve the meal plans from local storage
    let mealPlans = JSON.parse(localStorage.getItem("mealPlans")) || {};

    // Remove the meal plan for the current user
    delete mealPlans[userEmail];

    // Store the updated meal plans in local storage
    localStorage.setItem("mealPlans", JSON.stringify(mealPlans));

    // Set the userExists state to true
    setFormSubmitted(true);
    setUserExists(true);
    // Remove the user's meal plan
    setUserMealPlan({});
    // Close the modal
    onClose();
  };

  /**
   * Function to generate the user's bio
   * Returns a JSX element with the user's bio
   * Includes the user's:
   * - Age
   * - Gender
   * - Height
   * - Weight
   */
  const generateBio = () => {
    const { age, gender, height, weight } = userInfo;
    return (
      <>
        <Text as="span" color="text">
          You are a{" "}
        </Text>
        <Text as="span" color="darkGreen">{`${age} `}</Text>
        <Text as="span" color="text">
          year old{" "}
        </Text>
        <Text as="span" color="darkGreen">{`${gender}`}</Text>
        <Text as="span" color="text">
          {", "}
          who is{" "}
        </Text>
        <Text as="span" color="darkGreen">{`${height} cm `}</Text>
        <Text as="span" color="text">
          {" "}
          tall and weighs
        </Text>
        <Text as="span" color="darkGreen">{` ${weight} kg`}</Text>
        <Text as="span" color="text">
          .
        </Text>
      </>
    );
  };

  /**
   * Function to generate the user's activity level
   * Returns a JSX element with the user's activity level
   * Includes the user's:
   * - Activity level
   * - Health goals
   */
  const generateActivity = () => {
    const { activityLevel, healthGoals } = userInfo;
    return (
      <>
        <Text as="span" color="text">
          You are a{" "}
        </Text>
        <Text as="span" color="darkGreen">{`${activityLevel} `}</Text>
        <Text as="span" color="text">
          person, who is trying to{" "}
        </Text>
        <Text as="span" color="darkGreen">{`${healthGoals}`}</Text>
        <Text as="span" color="text">
          .
        </Text>
      </>
    );
  };

  /**
   * Function to generate the user's diet description
   * Returns a JSX element with the user's diet description
   * Includes the user's:
   * - Diet
   * - Calories
   */
  const generateDietDescription = () => {
    const { diet, calories } = userInfo;
    return (
      <Text as="span">
        <Text as="span" color="text">
          You would benefit from a{" "}
        </Text>
        {diet !== "None" && (
          <Text as="span" color="darkGreen">{`${diet} `}</Text>
        )}
        <Text as="span" color="text">
          diet with a caloric intake of{" "}
        </Text>
        <Text as="span" color="orange.400">{`${Math.round(calories)} `}</Text>
        <Text as="span" color="text">
          calories per day.
        </Text>
      </Text>
    );
  };

  /**
   * Function to generate the user's allergens
   * Returns a JSX element with the user's allergens
   * Includes the user's:
   * - Allergens
   */
  const generateAllergens = () => {
    // Split the allergens string into an array
    let allergensArray = allergens.split(",");

    // Clean up the array by trimming whitespace and removing empty strings
    allergensArray = allergensArray
      .map((allergen) => allergen.trim())
      .filter(Boolean);

    // Format the output with commas and "and" before the last allergen
    let allergensOutput =
      allergensArray.length > 1
        ? `${allergensArray
            .slice(0, -1)
            .join(", ")}, and ${allergensArray.slice(-1)}`
        : allergensArray[0];

    return (
      <Text as="span">
        <Text as="span" color="text">
          {" "}
          Avoiding:{" "}
        </Text>
        <Text as="span" color="darkGreen">{`${allergensOutput}`}</Text>
        <Text as="span" color="text">
          .
        </Text>
      </Text>
    );
  };

  /**
   * Function to generate the user's meal plan
   * Calls the Spoonacular API to generate a meal plan
   * Saves the meal plan in local storage
   * Updates the userMealPlan state
   *
   * Although not good practice, the API key is hardcoded in the URL
   * so that the project can be run without setting up a .env file for
   * marking purposes
   *
   * In a production environment, the API key should be stored in a .env file
   */
  const generateMealPlan = async (timeFrame) => {
    const response = await fetch(
      `https://api.spoonacular.com/mealplanner/generate?apiKey=2e2b0982fefc4ecabe38c1feb4f2bff7&timeFrame=${timeFrame}&targetCalories=${userInfo.calories}&diet=${userInfo.diet}&exclude=${allergens}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();

      // Retrieve the existing meal plans from local storage
      let mealPlans = JSON.parse(localStorage.getItem("mealPlans")) || {};

      // Add the new meal plan to the meal plans object
      mealPlans[userEmail] = data;

      // Store the updated meal plans in local storage
      localStorage.setItem("mealPlans", JSON.stringify(mealPlans));
      // Update the userMealPlan state
      setUserMealPlan(mealPlans[userEmail]);
    } else {
      console.error("Failed to fetch meal plan");
    }
  };

  const renderDayPlan = (dayPlan) => {
    return (
      <Box mb={10}>
        <SimpleGrid
          columns={{ md: 1, lg: 4 }}
          spacing={10}
          justifyContent={"center"}
        >
          {/* Check if the dayPlan exists or is an empty object */}
          {dayPlan.meals.map((meal, index) => (
            <Box key={index}>
              <Box
                p={6}
                boxShadow="lg"
                borderRadius="lg"
                bg="card"
                textColor={"heading"}
                borderColor={"beige"}
                transition="all 0.2s"
                _hover={{ transform: "scale(1.01)" }}
              >
                {/* Display the meal type based on the index */}
                <Heading color={"text"} mb={5} size="md">
                  {index === 0 ? "Breakfast" : index === 1 ? "Lunch" : "Dinner"}
                </Heading>
                {/* Display the meal title, image, ready time, servings, and link to the recipe */}
                <Heading mb={3} size="md">
                  {meal.title}
                </Heading>
                {/* Display a skeleton loader while the image is loading */}
                <Skeleton isLoaded={isImgLoaded} borderRadius="lg">
                  <img
                    src={`https://spoonacular.com/recipeImages/${meal.id}-636x393.${meal.imageType}`}
                    alt={`https://via.placeholder.com/636x393?text=No+Meal+Visual+Available`}
                    style={{ borderRadius: "10px" }}
                    onLoad={() => setIsImgLoaded(true)}
                  />
                </Skeleton>
                <Text mt={6}>
                  <Text as="span" color="text">
                    Ready in:{" "}
                  </Text>
                  <Text as="span" color="darkGreen">
                    {meal.readyInMinutes} minutes
                  </Text>
                </Text>
                <>
                  <Text as="span" color="text">
                    Servings:{" "}
                  </Text>
                  <Text as="span" color="darkGreen">
                    {meal.servings}
                  </Text>
                </>
                <Text>
                  <Link href={meal.sourceUrl} isExternal color="blue.500">
                    View Recipe
                  </Link>
                </Text>
              </Box>
            </Box>
          ))}

          <Box
            p={6}
            boxShadow="lg"
            borderRadius="lg"
            bg="card"
            textColor={"heading"}
            borderColor={"beige"}
            transition="all 0.2s"
            _hover={{ transform: "scale(1.01)" }}
            height={"fit-content"}
            alignSelf={"center"}
          >
            {/* Display the day's nutrients */}
            <Heading mb={3} size="md">
              Nutrients
            </Heading>
            <Flex direction="column" wrap="wrap" textColor={"text"}>
              <Text>
                Total Calories:{" "}
                <Text as="span" color="orange.400">
                  {Math.round(dayPlan.nutrients.calories)}
                </Text>
              </Text>
              <Text>
                Total Protein:{" "}
                <Text as="span" color="darkGreen">
                  {Math.round(dayPlan.nutrients.protein)} g
                </Text>
              </Text>
              <Text>
                Total Fat:{" "}
                <Text as="span" color="darkGreen">
                  {Math.round(dayPlan.nutrients.fat)} g
                </Text>
              </Text>
              <Text>
                Total Carbohydrates:{" "}
                <Text as="span" color="darkGreen">
                  {Math.round(dayPlan.nutrients.carbohydrates)} g
                </Text>
              </Text>
            </Flex>
          </Box>
        </SimpleGrid>
      </Box>
    );
  };

  /**
   * Function to display the user's meal plan
   * Returns a JSX element with the user's meal plan
   */
  const displayMealPlan = () => {
    /**
     * If the user's meal plan doesn't exist or is an empty object
     * Return an empty Text element
     */
    if (!userMealPlan || Object.keys(userMealPlan).length === 0) {
      return <Text></Text>;
    }

    // Determine if the meal plan is daily or weekly
    const planType = userMealPlan.week ? "Weekly" : "Daily";

    /**
     * If the meal plan is daily
     * Return the day's meal plan
     * Call the renderDayPlan function to display the day's meal plan
     */
    if (planType === "Daily") {
      return (
        <Box>
          <Heading
            as="h1"
            size="lg"
            fontFamily="'Josefin Sans', sans-serif"
            textAlign="center"
            mt={10}
            mb={5}
            textColor={"heading"}
          >
            Meal Plan for a Day:
          </Heading>

          {renderDayPlan(userMealPlan)}
        </Box>
      );
      /**
       * If the meal plan is weekly
       * Return the week's meal plan
       * Display the meal plan for each day of the week
       * Call the renderDayPlan function to display the day's meal plan
       * Pass the day's meal plan as an argument to the function
       */
    } else {
      return (
        <Box>
          {Object.keys(userMealPlan.week).map((day) => (
            <Box key={day}>
              <Heading
                as="h1"
                size="lg"
                fontFamily="'Josefin Sans', sans-serif"
                mt={10}
                mb={5}
                textColor={"heading"}
              >
                {day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()}
              </Heading>
              {renderDayPlan(userMealPlan.week[day])}
            </Box>
          ))}
        </Box>
      );
    }
  };

  /* Check if the data is loading */

  // if (isLoading) {
  //   return (
  //     /* Display a spinner while the data is loading */
  //     <Flex justify="center" align="center" height="78vh">
  //       <Spinner thickness="4px" color="heading" size="xl" />
  //     </Flex>
  //   );
  // } else
  // if (formSubmitted || userExists) {
  return (
    <Fade in={true}>
      <Heading
        as="h1"
        size="lg"
        fontFamily="'Josefin Sans', sans-serif"
        textAlign="center"
        mt={4}
        mb={5}
        textColor={"heading"}
      >
        {/*
         * Check if the form has been submitted or the user exists
         * If true, display the user's dietary information
         * If false, display the form title
         */}
        {formSubmitted || userExists
          ? "Your Dietary Information"
          : "Create your Personal Dietary Profile"}
      </Heading>
      {formSubmitted || userExists ? (
        <Box maxWidth="1300" margin="0 auto">
          <SimpleGrid
            columns={{ md: 1, lg: 3 }}
            spacing={10}
            justifyContent={"center"}
          >
            <Box
              p={6}
              boxShadow="lg"
              borderRadius="lg"
              bg="card"
              textColor={"heading"}
              borderColor={"beige"}
              transition="all 0.2s"
              _hover={{ transform: "scale(1.02)" }}
            >
              {/* Display the user's bio */}
              <Heading
                mb={4}
                as="h1"
                size="lg"
                fontFamily="'Josefin Sans', sans-serif"
              >
                Bio
              </Heading>
              <Text color={"text"}>{generateBio()}</Text>
            </Box>
            <Box
              p={6}
              boxShadow="lg"
              borderRadius="lg"
              bg="card"
              textColor={"heading"}
              borderColor={"beige"}
              transition="all 0.2s"
              _hover={{ transform: "scale(1.02)" }}
            >
              {/* Display the user's activity level */}
              <Heading
                mb={4}
                as="h1"
                size="lg"
                fontFamily="'Josefin Sans', sans-serif"
              >
                Activity
              </Heading>
              <Text color={"text"}>{generateActivity()}</Text>
            </Box>
            <Box
              p={6}
              boxShadow="lg"
              borderRadius="lg"
              bg="card"
              textColor={"heading"}
              borderColor={"beige"}
              transition="all 0.2s"
              _hover={{ transform: "scale(1.02)" }}
            >
              {/* Display the user's diet description */}
              <Heading
                mb={4}
                as="h1"
                size="lg"
                fontFamily="'Josefin Sans', sans-serif"
              >
                Diet
              </Heading>
              <Text color={"text"}>
                {generateDietDescription()}
                {allergens && generateAllergens()}
              </Text>
            </Box>
          </SimpleGrid>
          <Flex justifyContent="center" alignItems="center">
            <Button
              mt={7}
              bg={"darkGreen"}
              textColor={"beige"}
              _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
              onClick={onOpen}
            >
              Edit Info
            </Button>
            {/* Display the generate meal plan button */}
            <Menu>
              <MenuButton
                ml={5}
                mt={7}
                bg={"darkGreen"}
                textColor={"beige"}
                _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
                _active={{ bg: "lightGreen", textColor: "darkGreen" }}
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                Generate Meal Plan
              </MenuButton>
              <MenuList bg={"card"} borderColor={"beige"} shadow={"xl"}>
                {/* Display the options to generate a meal plan for a day or a week */}
                <MenuItem
                  bg={"transparent"}
                  onClick={() => generateMealPlan("day")}
                  textColor={"heading"}
                  fontWeight={"bold"}
                  _hover={{ bg: "darkGreen", textColor: "beige" }}
                >
                  Day
                </MenuItem>
                <Divider borderColor={"lightGreen"} />
                <MenuItem
                  bg={"transparent"}
                  onClick={() => generateMealPlan("week")}
                  textColor={"heading"}
                  fontWeight={"bold"}
                  _hover={{ bg: "darkGreen", textColor: "beige" }}
                >
                  Week
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Flex justifyContent="center" alignItems="center">
            {/* Display the user's meal plan */}
            {displayMealPlan()}
          </Flex>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg={"card"} textColor={"darkGreen"}>
              {/* Display the modal to edit the user's information */}
              <ModalHeader>Edit Diet Plan</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  {/* Display the form fields to edit the user's information */}
                  <FormLabel>Age</FormLabel>
                  <Input
                    type="number"
                    name="age"
                    min="0"
                    max="99"
                    value={userInfo.age}
                    onChange={handleChange}
                  />
                  <FormLabel>Gender</FormLabel>
                  <Select
                    name="gender"
                    value={userInfo.gender}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="Man">Male</option>
                    <option value="Woman">Female</option>
                  </Select>
                  <FormLabel>Weight</FormLabel>
                  <Input
                    type="number"
                    name="weight"
                    step="0.01"
                    value={userInfo.weight}
                    onChange={handleChange}
                  />

                  <FormLabel>Height</FormLabel>
                  <Input
                    type="number"
                    name="height"
                    value={userInfo.height}
                    onChange={handleChange}
                  />

                  <FormLabel>Activity Level</FormLabel>
                  <Select
                    name="activityLevel"
                    value={userInfo.activityLevel}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="Sedentary">
                      Sedentary (little or no exercise)
                    </option>
                    <option value="Lightly active">
                      Lightly active (light exercise/sports 1-3 days/week)
                    </option>
                    <option value="Moderately active">
                      Moderately active (moderate exercise/sports 3-5 days/week)
                    </option>
                    <option value="Very active">
                      Very active (hard exercise/sports 6-7 days a week)
                    </option>
                    <option value="Extra active">
                      Extra active (very hard exercise/sports & a physical job)
                    </option>
                  </Select>

                  <FormLabel>Health Goals</FormLabel>
                  <Select
                    name="healthGoals"
                    value={userInfo.healthGoals}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="lose weight">Lose weight</option>
                    <option value="maintain weight">Maintain weight</option>
                    <option value="gain weight">Gain weight</option>
                  </Select>

                  <FormLabel>Diet</FormLabel>
                  <Select
                    name="diet"
                    value={userInfo.diet}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="None">None</option>
                    <option value="Gluten Free">Gluten Free</option>
                    <option value="Ketogenic">Ketogenic</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Lacto-Vegetarian">Lacto-Vegetarian</option>
                    <option value="Ovo-Vegetarian">Ovo-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Pescetarian">Pescetarian</option>
                    <option value="Paleo">Paleo</option>
                    <option value="Primal">Primal</option>
                    <option value="Low FODMAP">Low FODMAP</option>
                    <option value="Whole30">Whole30</option>
                  </Select>

                  <FormLabel>Ingredients to Exclude</FormLabel>
                  <Textarea
                    type="text"
                    placeholder="Enter ingredients separated by commas e.g. peanuts, dairy, soy"
                    value={allergens}
                    onChange={(e) => setAllergens(e.target.value)}
                    rows={3}
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                {/* Display the save changes button */}
                <Button
                  bg={"darkGreen"}
                  textColor={"beige"}
                  _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
                  onClick={handleSubmit}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      ) : (
        <Box
          maxW={{ base: "90%", sm: "80%", md: "500px", lg: "80%" }}
          mx="auto"
          p={6}
          boxShadow="lg"
          borderRadius="lg"
          bg="card"
          textColor={"heading"}
          borderColor={"beige"}
        >
          <Box as="form" onSubmit={handleSubmit}>
            {/* Display the form fields to create the user's dietary profile */}
            <FormControl>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
                <Box>
                  <FormLabel>Age</FormLabel>
                  <Input
                    type="number"
                    min="0"
                    max="99"
                    name="age"
                    onChange={handleChange}
                  />
                  <FormLabel>Gender</FormLabel>
                  <Select name="gender" onChange={handleChange} value="">
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="Man">Male</option>
                    <option value="Woman">Female</option>
                  </Select>
                  <FormLabel>Weight (kg)</FormLabel>
                  <Input
                    type="number"
                    step="0.01"
                    name="weight"
                    onChange={handleChange}
                  />
                  <FormLabel>Height (cm)</FormLabel>
                  <Input type="number" name="height" onChange={handleChange} />

                  <FormLabel>Activity Level</FormLabel>
                  <Select name="activityLevel" onChange={handleChange} value="">
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="Sedentary">
                      Sedentary (little or no exercise)
                    </option>
                    <option value="Lightly active">
                      Lightly active (light exercise/sports 1-3 days/week)
                    </option>
                    <option value="Moderately active">
                      Moderately active (moderate exercise/sports 3-5 days/week)
                    </option>
                    <option value="Very active">
                      Very active (hard exercise/sports 6-7 days a week)
                    </option>
                    <option value="Extra active">
                      Extra active (very hard exercise/sports & a physical job)
                    </option>
                  </Select>
                </Box>
                <Box>
                  <FormLabel>Health Goals</FormLabel>
                  <Select name="healthGoals" onChange={handleChange} value="">
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="lose weight">Lose weight</option>
                    <option value="maintain weight">Maintain weight</option>
                    <option value="gain weight">Gain weight</option>
                  </Select>
                  <FormLabel>Diet</FormLabel>
                  <Select
                    name="diet"
                    value={userInfo.diet}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="None">None</option>
                    <option value="Gluten Free">Gluten Free</option>
                    <option value="Ketogenic">Ketogenic</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Lacto-Vegetarian">Lacto-Vegetarian</option>
                    <option value="Ovo-Vegetarian">Ovo-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Pescetarian">Pescetarian</option>
                    <option value="Paleo">Paleo</option>
                    <option value="Primal">Primal</option>
                    <option value="Low FODMAP">Low FODMAP</option>
                    <option value="Whole30">Whole30</option>
                  </Select>
                  <FormLabel>Ingredients to Exclude</FormLabel>
                  <Textarea
                    type="text"
                    placeholder="Enter ingredients separated by commas e.g. peanuts, dairy, soy"
                    value={allergens}
                    onChange={(e) => setAllergens(e.target.value)}
                    rows={6}
                  />
                </Box>{" "}
              </SimpleGrid>
            </FormControl>
            <Flex justifyContent={"center"}>
              {/* Display the submit button */}
              <Button
                mt={8}
                bg={"darkGreen"}
                textColor={"beige"}
                _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
                type="submit"
                // Disable the button if any field is empty
                isDisabled={
                  !userInfo.age ||
                  !userInfo.weight ||
                  !userInfo.height ||
                  !userInfo.activityLevel ||
                  !userInfo.healthGoals ||
                  !userInfo.diet
                }
              >
                Submit
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Fade>
  );
  // }
};

export default DietPlan;
