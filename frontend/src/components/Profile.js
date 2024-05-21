import React, { useState } from "react";
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
  StackDivider,
} from "@chakra-ui/react";
import {
  CheckIcon,
  WarningIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";
import { Fade } from "@chakra-ui/transition";

const Profile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal state
  const [editUser, setEditUser] = useState({
    // Form state
    name: "",
    email: "",
    dateOfJoining: "",
  });
  const toast = useToast(); // Toast state
  const username = localStorage.getItem("userLoggedIn"); // Get the current user's email
  const users = JSON.parse(localStorage.getItem("users")) || []; // Get the users array from local storage
  const userIndex = users.findIndex((u) => u.email === username); // Find the index of the current user
  const user = users[userIndex]; // Get the current user object

  const [isNameValid, setIsNameValid] = useState(true); // Name validation state
  const [isEmailValid, setIsEmailValid] = useState(true); // Email validation state

  const [password, setPassword] = useState(""); // Password state
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password state
  const [showPassword, setShowPassword] = useState(false); // Show password state
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Show confirm password state

  const [isAlertOpen, setIsAlertOpen] = useState(false); // Alert dialog state
  const [deleteName, setDeleteName] = useState(""); // Delete name state
  const [deleteEmail, setDeleteEmail] = useState(""); // Delete email state

  // Password pattern
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  // Email pattern
  const emailPattern =
    /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
    setEditUser({ ...user }); // Pre-populate the form with current user data
    setPassword(user.password); // Set the password state
    setIsNameValid(user.name.length >= 2); // Validate the name
    setIsEmailValid(emailPattern.test(user.email)); // Validate the email
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

    if (name === "name") {
      setIsNameValid(value.length >= 2);
    } else if (name === "email") {
      setIsEmailValid(emailPattern.test(value));
    }

    if (name === "password") {
      setPassword(value);
      if (value) setShowConfirmPassword(true);
      else setShowConfirmPassword(false);
    }

    if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  // Function to save the changes made to the user's profile
  const handleSaveChanges = () => {
    /**
     * Validate the name field
     * Display an error toast if the name is less than 2 characters long
     */
    if (editUser.name.length < 2) {
      toast({
        title: "Error",
        description: "Name must be at least 2 characters long.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    /**
     * Validate the email field
     * Display an error toast if the email is not valid
     * Email must be in the format
     */
    if (!emailPattern.test(editUser.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    /**
     * Validate the password field
     * Display an error toast if the password is not valid
     * Password must be at least 8 characters long, contain at least 1 number and 1 special character
     */
    if (!passwordPattern.test(password)) {
      toast({
        title: "Error",
        description:
          "Password must be at least 8 characters long, contain at least 1 number and 1 special character.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    /**
     * Validate the confirm password field
     * Display an error toast if the passwords do not match
     */
    if (showConfirmPassword && password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    /**
     * Update the users array with the new user data
     * Map over the users array
     * If the user's name matches the current user's name, update the user with the new data
     * Otherwise, return the user as is
     */
    const updatedUsers = users.map((u) => {
      if (u.name === username) {
        return { ...u, name: editUser.name, email: editUser.email, password };
      }
      return u;
    });

    // Update the local storage with the new users array
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    // If the username was changed, update the current userLoggedIn as well
    if (username !== editUser.name) {
      localStorage.setItem("userLoggedIn", editUser.email);
    }

    // Display a success toast indicating that the profile has been updated
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    onClose(); // Close the modal after saving changes
  };

  /**
   * Function to handle account deletion
   * If the entered name and email match the current user's name and email, delete the account
   * Update the users array by filtering out the current user
   * Update the local storage with the new users array
   * Remove the userLoggedIn key from local storage
   * Set a flag indicating account deletion success
   * Reload the page after account deletion
   */
  const handleDelete = () => {
    if (deleteName === user.name && deleteEmail === user.email) {
      const updatedUsers = users.filter((u) => u.name !== user.name);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.removeItem("userLoggedIn");
      localStorage.setItem("accountDeletionSuccess", "true");
      window.location.reload();
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
            columns={{ sm: 1, md: 3 }}
            spacing={5}
            w="full"
            px={4}
            py={5}
          >
            {/* Name Card */}
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
                  Name
                </Text>
                <Text fontSize="2xl" color="text">
                  {user.name}
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
                  {user.dateOfJoining}
                </Text>
              </VStack>
            </Box>
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
                <FormLabel>Name</FormLabel>
                <InputGroup>
                  {/* Name Input */}
                  <Input
                    name="name"
                    value={editUser.name}
                    onChange={handleInputChange}
                  />
                  <InputRightElement>
                    {editUser.name.length >= 2 ? (
                      <CheckIcon color="green.500" />
                    ) : (
                      <Tooltip
                        label="Name must be at least 2 characters long."
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
                  {/* Email Input */}
                  <Input
                    name="email"
                    type="email"
                    value={editUser.email}
                    onChange={handleInputChange}
                  />
                  <InputRightElement>
                    {emailPattern.test(editUser.email) &&
                    !users.some(
                      (u) => u.email === editUser.email && u.email !== username
                    ) ? (
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
                <FormLabel>Password</FormLabel>
                {/* Password Input */}
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
                        label="Password must be at least 8 characters long, include at least one number, and one special character (e.g., !@#$%^&*)."
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
                mr={3}
                colorScheme="red"
                onClick={() => setIsAlertOpen(true)}
              >
                Delete Account
              </Button>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleSaveChanges}
                isDisabled={
                  !(
                    isNameValid &&
                    isEmailValid &&
                    passwordPattern.test(password)
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
              <AlertDialogBody>
                <FormControl>
                  <FormLabel>
                    Please enter your exact name for account deletion
                  </FormLabel>
                  <InputGroup>
                    <Input
                      placeholder={user.name}
                      onChange={(e) => setDeleteName(e.target.value)}
                      isInvalid={deleteName !== "" && deleteName !== user.name}
                      isValid={deleteName === user.name}
                    />
                    <InputRightElement>
                      {deleteName === user.name ? (
                        <CheckIcon color="green.500" />
                      ) : (
                        deleteName !== "" && <WarningIcon color="red.500" />
                      )}
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel>
                    Please enter your exact email for account deletion
                  </FormLabel>
                  <InputGroup>
                    <Input
                      placeholder={user.email}
                      onChange={(e) => setDeleteEmail(e.target.value)}
                      isInvalid={
                        deleteEmail !== "" && deleteEmail !== user.email
                      }
                      isValid={deleteEmail === user.email}
                    />
                    <InputRightElement>
                      {deleteEmail === user.email ? (
                        <CheckIcon color="green.500" />
                      ) : (
                        deleteEmail !== "" && <WarningIcon color="red.500" />
                      )}
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  bg={"darkGreen"}
                  textColor={"beige"}
                  _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
                  onClick={() => setIsAlertOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleDelete}
                  isDisabled={
                    deleteName !== user.name || deleteEmail !== user.email
                  }
                  ml={3}
                >
                  Delete
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
