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
import {
  findUser,
  getUser,
  updateUser,
  changePassword,
  deleteUser,
  removeUser,
  verifyPassword,
} from "../data/repository";

const Profile = () => {
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure(); // Modal state for edit profile
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

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isNewPasswordValid, setIsNewPasswordValid] = useState(true);

  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [deleteUsername, setDeleteUsername] = useState("");
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [confirmDeletePassword, setConfirmDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);

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
    onEditOpen(); // Open the modal
  };

  const handleChangePasswordOpen = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setIsChangePasswordOpen(true);
  };
  const onChangePasswordClose = () => setIsChangePasswordOpen(false);

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setIsNewPasswordValid(value.length >= 6);
  };

  const handleDeleteAccountOpen = () => {
    setDeleteUsername("");
    setDeleteEmail("");
    setDeletePassword("");
    setConfirmDeletePassword("");
    setShowDeletePassword(false);
    setIsDeleteAccountOpen(true);
  };

  const onDeleteAccountClose = () => {
    setDeleteUsername("");
    setDeleteEmail("");
    setDeletePassword("");
    setConfirmDeletePassword("");
    setShowDeletePassword(false);
    setIsDeleteAccountOpen(false);
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

      onEditClose(); // Close the modal after saving changes
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

  const handleChangePassword = async () => {
    try {
      await changePassword(user.user_id, currentPassword, newPassword);
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onChangePasswordClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "An error occurred while changing the password.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Verify credentials
      if (
        user.username === deleteUsername &&
        user.email === deleteEmail &&
        (await verifyPassword(user.user_id, deletePassword))
      ) {
        await deleteUser(user.user_id);
        removeUser();
        toast({
          title: "Account Deleted",
          description: "Your account has been successfully deleted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        // Redirect to home page or login page
        window.location.href = "/";
      } else {
        toast({
          title: "Error",
          description: "The provided credentials are incorrect.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the account.",
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
            columns={{ sm: 1, md: 3 }}
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
        <Flex mt={7} spacing={4}>
          {/* Edit Profile Button */}
          <Button
            bg={"darkGreen"}
            textColor={"beige"}
            onClick={handleEditOpen}
            _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
            mr={4} // Margin right to add space between buttons
          >
            Edit Profile
          </Button>
          {/* Change Password Button */}
          <Button
            bg={"darkGreen"}
            textColor={"beige"}
            onClick={handleChangePasswordOpen}
            _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
            mr={4} // Margin right to add space between buttons
          >
            Change Password
          </Button>
          {/* Delete Account Button */}
          <Button
            bg={"red.500"}
            textColor={"white"}
            onClick={handleDeleteAccountOpen}
            _hover={{ bg: "red.700" }}
          >
            Delete Account
          </Button>
        </Flex>

        {/* Edit Profile Modal */}
        <Modal isOpen={isEditOpen} onClose={onEditClose}>
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
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
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
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
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
                onClick={onEditClose}
                bg={"darkGreen"}
                textColor={"beige"}
                _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* Change Password Modal */}
        <Modal isOpen={isChangePasswordOpen} onClose={onChangePasswordClose}>
          <ModalOverlay />
          <ModalContent bg={"card"} textColor={"darkGreen"}>
            <ModalHeader>Change Password</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Current Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <InputRightElement>
                    <Button
                      variant="unstyled"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                  <InputRightElement mr={5}>
                    <Button
                      variant="unstyled"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                    {isNewPasswordValid ? (
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

              <FormControl mt={4}>
                <FormLabel>Confirm New Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                  />
                  <InputRightElement mr={5}>
                    <Button
                      variant="unstyled"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                    {newPassword === confirmNewPassword ? (
                      <CheckIcon color="green.500" />
                    ) : (
                      <Tooltip label="The passwords must match." hasArrow>
                        <WarningIcon color="red.500" />
                      </Tooltip>
                    )}
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleChangePassword}
                isDisabled={newPassword !== confirmNewPassword || !newPassword}
              >
                Change Password
              </Button>
              <Button
                onClick={onChangePasswordClose}
                bg={"darkGreen"}
                textColor={"beige"}
                _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isDeleteAccountOpen} onClose={onDeleteAccountClose}>
          <ModalOverlay />
          <ModalContent bg={"card"} textColor={"darkGreen"}>
            <ModalHeader>Delete Account</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Input
                  value={deleteUsername}
                  onChange={(e) => setDeleteUsername(e.target.value)}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showDeletePassword ? "text" : "password"}
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                  />
                  <InputRightElement>
                    <Button
                      variant="unstyled"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                    >
                      {showDeletePassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showDeletePassword ? "text" : "password"}
                    value={confirmDeletePassword}
                    onChange={(e) => setConfirmDeletePassword(e.target.value)}
                  />
                  <InputRightElement>
                    <Button
                      variant="unstyled"
                      onClick={() => setShowDeletePassword(!showDeletePassword)}
                    >
                      {showDeletePassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                    {deletePassword === confirmDeletePassword ? (
                      <CheckIcon color="green.500" />
                    ) : (
                      <Tooltip label="The passwords must match." hasArrow>
                        <WarningIcon color="red.500" />
                      </Tooltip>
                    )}
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="red"
                mr={3}
                onClick={handleDeleteAccount}
                isDisabled={!deleteUsername || !deleteEmail || !deletePassword}
              >
                Delete Account
              </Button>
              <Button
                onClick={onDeleteAccountClose}
                bg={"darkGreen"}
                textColor={"beige"}
                _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
              >
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Fade>
  );
};

export default Profile;
