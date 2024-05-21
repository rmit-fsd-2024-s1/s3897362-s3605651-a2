import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Flex,
  VStack,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  InputRightElement,
  InputGroup,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Heading,
  Tooltip,
  SimpleGrid,
  Spinner,
  StackDivider,
} from "@chakra-ui/react";
import {
  CheckIcon,
  WarningIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import { Fade } from "@chakra-ui/transition";
import { findUser, getUser, updateUser } from "../data/repository";

const Profile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal state
  const [editUser, setEditUser] = useState({
    // Form state
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const toast = useToast(); // Toast state
  const [user, setUser] = useState(null); // State to store the user object
  const [loading, setLoading] = useState(true); // State to manage loading state

  const [isUsernameValid, setIsUsernameValid] = useState(true); // Username validation state
  const [isEmailValid, setIsEmailValid] = useState(true); // Email validation state
  const [isFirstNameValid, setIsFirstNameValid] = useState(true); // First name validation state
  const [isLastNameValid, setIsLastNameValid] = useState(true); // Last name validation state

  const [password, setPassword] = useState(""); // Password state
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state
  const [showPassword, setShowPassword] = useState(false); // Show password state
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Show confirm password state

  const [isAlertOpen, setIsAlertOpen] = useState(false); // Alert dialog state

  // Password pattern
  const passwordPattern = /^.{6,}$/;

  // Email pattern
  const emailPattern =
    /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user")); // Get the logged-in user from local storage
        if (storedUser) {
          const userData = await getUser(storedUser.id);
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };
    fetchUserData();
  }, []);

  // If loading, show a spinner
  if (loading) {
    return (
      <Flex align="center" justify="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  // If no user is found, display a message indicating that no user information is available.
  if (!user) {
    return (
      <Flex direction="column" align="center" justify="center" height="100vh">
        <Text fontSize="3xl" alignSelf="flex-start" ml={8} mt={4}>
          Profile Information
        </Text>
        <Text mt={8}>No user information available</Text>
      </Flex>
    );
  }

  /**
   * Function to open the edit profile modal
   * Pre-populates the form with the current user's data
   * Resets the showPassword and showConfirmPassword states
   * Displays the modal
   */
  const handleEditOpen = () => {
    setEditUser({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    }); // Pre-populate the form with current user data
    setPassword(""); // Reset the password state
    setConfirmPassword(""); // Reset the confirm password state
    setIsUsernameValid(true);
    setIsEmailValid(true);
    setIsFirstNameValid(true);
    setIsLastNameValid(true);
    setShowPassword(false); // Reset showPassword state
    setShowConfirmPassword(false); // Reset showConfirmPassword state
    onOpen(); // Open the modal
  };

  /**
   * Function to handle input changes in the form
   * Validates the name, email, password, and confirm password fields
   * Updates the editUser state with the new values
   * Updates the isNameValid, isEmailValid, and showConfirmPassword states
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));

    if (name === "username") {
      setIsUsernameValid(value.length >= 3 && value.length <= 32);
    } else if (name === "email") {
      setIsEmailValid(emailPattern.test(value));
    } else if (name === "first_name") {
      setIsFirstNameValid(value.length >= 2 && value.length <= 40);
    } else if (name === "last_name") {
      setIsLastNameValid(value.length >= 2 && value.length <= 40);
    } else if (name === "password") {
      setPassword(value);
      if (value) setShowConfirmPassword(true);
      else setShowConfirmPassword(false);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  // Function to save the changes made to the user's profile
  const handleSaveChanges = async () => {
    try {
      // Validate form inputs as needed

      // Prepare the updated user data
      const updatedUser = {
        username: editUser.username,
        email: editUser.email,
        first_name: editUser.first_name,
        last_name: editUser.last_name,
        password: password,
      };

      // Update the user in the database
      await updateUser(user.user_id, updatedUser); // Ensure the correct ID is passed

      // Fetch the updated user data from the backend
      const fetchedUser = await findUser(user.user_id);

      // Update user data in the component state and local storage
      setUser(fetchedUser);
      localStorage.setItem("user", JSON.stringify(fetchedUser));

      // Display a success toast indicating that the profile has been updated
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose(); // Close the modal after saving changes
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while updating the profile.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Fade in={true}>
      <Flex direction="column" align="center" justify="center" w="full">
        <Heading
          as="h1"
          size="lg"
          fontFamily="'Josefin Sans', sans-serif"
          textAlign="center"
          mt={5}
          textColor={"heading"}
        >
          Profile Information
        </Heading>
        <Box maxWidth="1200" margin="0 auto">
          <SimpleGrid
            mt={4}
            columns={{ sm: 1, md: 2 }}
            spacing={5}
            w="full"
            px={4}
            py={5}
          >
            {/* Username Card */}
            <Box
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
              bg="card"
              p={5}
              transition="all 0.2s"
              _hover={{ transform: "scale(1.02)" }}
              borderColor={"beige"}
            >
              <VStack
                spacing={4}
                align="flex-start"
                divider={<StackDivider borderColor={"lightGreen"} />}
              >
                <Text
                  fontFamily="'Josefin Sans', sans-serif"
                  fontSize="xl"
                  fontWeight="bold"
                  textColor={"heading"}
                >
                  Username
                </Text>
                <Text fontSize="2xl" color="text">
                  {user.username}
                </Text>
              </VStack>
            </Box>

            {/* Full Name Card */}
            <Box
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
              bg="card"
              p={5}
              transition="all 0.2s"
              _hover={{ transform: "scale(1.02)" }}
              borderColor={"beige"}
            >
              <VStack
                spacing={4}
                align="flex-start"
                divider={<StackDivider borderColor={"lightGreen"} />}
              >
                <Text
                  fontFamily="'Josefin Sans', sans-serif"
                  fontSize="xl"
                  fontWeight="bold"
                  textColor={"heading"}
                >
                  Full Name
                </Text>
                <Text fontSize="2xl" color="text">
                  {user.first_name} {user.last_name}
                </Text>
              </VStack>
            </Box>

            {/* Email Card */}
            <Box
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
              bg="card"
              p={5}
              transition="all 0.2s"
              _hover={{ transform: "scale(1.02)" }}
              borderColor={"beige"}
            >
              <VStack
                spacing={4}
                align="flex-start"
                divider={<StackDivider borderColor={"lightGreen"} />}
              >
                <Text
                  fontFamily="'Josefin Sans', sans-serif"
                  fontSize="xl"
                  fontWeight="bold"
                  textColor={"heading"}
                >
                  Email
                </Text>
                <Text fontSize="2xl" color="text">
                  {user.email}
                </Text>
              </VStack>
            </Box>

            {/* Date of Joining Card */}
            <Box
              shadow="md"
              borderWidth="1px"
              borderRadius="lg"
              bg="card"
              p={5}
              transition="all 0.2s"
              _hover={{ transform: "scale(1.02)" }}
              borderColor={"beige"}
            >
              <VStack
                spacing={4}
                align="flex-start"
                divider={<StackDivider borderColor="lightGreen" />}
              >
                <Text
                  fontFamily="'Josefin Sans', sans-serif"
                  fontSize="xl"
                  fontWeight="bold"
                  textColor={"heading"}
                >
                  Date of Joining
                </Text>
                <Text fontSize="2xl" color="text">
                  {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </VStack>
            </Box>

            {/* Date Modified Card */}
            {new Date(user.updatedAt).toLocaleDateString() !==
              new Date(user.createdAt).toLocaleDateString() && (
              <Box
                shadow="md"
                borderWidth="1px"
                borderRadius="lg"
                bg="card"
                p={5}
                transition="all 0.2s"
                _hover={{ transform: "scale(1.02)" }}
                borderColor={"beige"}
              >
                <VStack
                  spacing={4}
                  align="flex-start"
                  divider={<StackDivider borderColor="lightGreen" />}
                >
                  <Text
                    fontFamily="'Josefin Sans', sans-serif"
                    fontSize="xl"
                    fontWeight="bold"
                    textColor={"heading"}
                  >
                    Date Modified
                  </Text>
                  <Text fontSize="2xl" color="text">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </Text>
                </VStack>
              </Box>
            )}
          </SimpleGrid>
        </Box>
        {/* Edit Profile Button */}
        <Button
          mt={7}
          bg={"darkGreen"}
          textColor={"beige"}
          onClick={handleEditOpen}
          _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
        >
          Edit Profile
        </Button>
        {/* Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg={"card"} textColor={"darkGreen"}>
            <ModalHeader>Edit Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <InputGroup>
                  <Input
                    name="username"
                    value={editUser.username}
                    onChange={handleInputChange}
                  />
                  <InputRightElement>
                    {isUsernameValid ? (
                      <CheckIcon color="green.500" />
                    ) : (
                      <Tooltip
                        label="Username must be between 3 and 32 characters."
                        hasArrow
                      >
                        <WarningIcon color="red.500" />
                      </Tooltip>
                    )}
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Email</FormLabel>
                <InputGroup>
                  <Input
                    name="email"
                    type="email"
                    value={editUser.email}
                    onChange={handleInputChange}
                  />
                  <InputRightElement>
                    {isEmailValid ? (
                      <CheckIcon color="green.500" />
                    ) : (
                      <Tooltip
                        label="Please enter a valid email address (e.g., example@domain.com)."
                        hasArrow
                      >
                        <WarningIcon color="red.500" />
                      </Tooltip>
                    )}
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>First Name</FormLabel>
                <InputGroup>
                  <Input
                    name="first_name"
                    value={editUser.first_name}
                    onChange={handleInputChange}
                  />
                  <InputRightElement>
                    {isFirstNameValid ? (
                      <CheckIcon color="green.500" />
                    ) : (
                      <Tooltip
                        label="First name must be between 2 and 40 characters."
                        hasArrow
                      >
                        <WarningIcon color="red.500" />
                      </Tooltip>
                    )}
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Last Name</FormLabel>
                <InputGroup>
                  <Input
                    name="last_name"
                    value={editUser.last_name}
                    onChange={handleInputChange}
                  />
                  <InputRightElement>
                    {isLastNameValid ? (
                      <CheckIcon color="green.500" />
                    ) : (
                      <Tooltip
                        label="Last name must be between 2 and 40 characters."
                        hasArrow
                      >
                        <WarningIcon color="red.500" />
                      </Tooltip>
                    )}
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handleInputChange}
                  />
                  <InputRightElement mr={5}>
                    <Button
                      variant="unstyled"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                    {passwordPattern.test(password) ? (
                      <CheckIcon color="green.500" />
                    ) : (
                      <Tooltip
                        label="Password must be at least 6 characters long."
                        hasArrow
                      >
                        <WarningIcon color="red.500" />
                      </Tooltip>
                    )}
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              {showConfirmPassword && (
                <FormControl mt={4}>
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={handleInputChange}
                    />
                    <InputRightElement mr={5}>
                      <Button
                        variant="unstyled"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      </Button>
                      {password === confirmPassword ? (
                        <CheckIcon color="green.500" />
                      ) : (
                        <Tooltip label="The passwords must match." hasArrow>
                          <WarningIcon color="red.500" />
                        </Tooltip>
                      )}
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              )}
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleSaveChanges}
                isDisabled={
                  !(
                    isUsernameValid &&
                    isEmailValid &&
                    isFirstNameValid &&
                    isLastNameValid &&
                    (!showConfirmPassword || password === confirmPassword)
                  )
                }
              >
                Save Changes
              </Button>
              <Button
                onClick={onClose}
                bg={"darkGreen"}
                textColor={"beige"}
                _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <AlertDialog isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)}>
          <AlertDialogOverlay>
            <AlertDialogContent bg={"card"} textColor={"darkGreen"}>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Account
              </AlertDialogHeader>

              <AlertDialogCloseButton />
              <AlertDialogBody>{/* Empty body for now */}</AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  bg={"darkGreen"}
                  textColor={"beige"}
                  _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
                  onClick={() => setIsAlertOpen(false)}
                >
                  Cancel
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Flex>
    </Fade>
  );
};

export default Profile;
