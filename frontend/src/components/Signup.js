import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  InputGroup,
  InputRightElement,
  Tooltip,
  Grid,
  GridItem,
  Heading,
} from "@chakra-ui/react";
import { CheckIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { Fade } from "@chakra-ui/transition";
import { createUser } from "../data/repository";

const Signup = ({ onSuccessfulSignup }) => {
  // State to store user details
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [isFirstNameValid, setIsFirstNameValid] = useState(false);
  const [isLastNameValid, setIsLastNameValid] = useState(false);
  const toast = useToast();

  // Regular expressions for email and password validation
  const emailPattern =
    /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  /**
   * Function to handle input change
   * Updates the user state with the new value of the input field.
   * Validates the input based on the field name.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    if (name === "username") {
      setIsUsernameValid(value.length >= 3 && value.length <= 32);
    } else if (name === "email") {
      setIsEmailValid(emailPattern.test(value));
    } else if (name === "password") {
      setIsPasswordValid(value.length >= 6);
      if (confirmPassword) {
        setIsConfirmPasswordValid(value === confirmPassword);
      }
    } else if (name === "first_name") {
      setIsFirstNameValid(value.length >= 2 && value.length <= 40);
    } else if (name === "last_name") {
      setIsLastNameValid(value.length >= 2 && value.length <= 40);
    }
  };

  /**
   * Function to handle confirm password change
   * Updates the confirm password state with the new value of the input field.
   * Validates the confirm password based on the password field.
   * If the password field is updated, the confirm password is revalidated.
   */
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setIsConfirmPasswordValid(user.password === value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newUser = await createUser(user);
      localStorage.setItem("user", JSON.stringify(newUser));
      toast({
        title: "Signup Successful",
        description: "You are now logged in.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onSuccessfulSignup(newUser);
    } catch (error) {
      showErrorToast("Signup Failed", error.message);
    }
  };

  /**
   * Function to show error toast
   * Template for displaying error messages in a toast notification.
   */
  const showErrorToast = (title, description) => {
    toast({
      title,
      description,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  };

  return (
    <Fade in={true}>
      <Box my={8} textAlign="center">
        <Heading
          as="h1"
          size="lg"
          fontFamily="'Josefin Sans', sans-serif"
          textAlign="center"
        >
          Sign Up
        </Heading>
        <Grid templateColumns="repeat(1, 1fr)" gap={6}>
          <GridItem colSpan={{ base: 1, sm: 1, md: 1, lg: 1 }} w="full">
            <Box
              maxW={{ base: "90%", sm: "80%", md: "500px", lg: "400px" }}
              margin="auto"
              p={6}
              boxShadow="lg"
              borderRadius="lg"
              bg="card"
              textColor={"heading"}
              borderColor={"beige"}
            >
              <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <InputGroup>
                    <Input
                      type="text"
                      name="username"
                      value={user.username}
                      onChange={handleChange}
                    />
                    <InputRightElement
                      children={
                        isUsernameValid ? (
                          <CheckIcon color="green.500" />
                        ) : (
                          <Tooltip
                            label="Username must be between 3 and 32 characters."
                            hasArrow
                          >
                            <WarningTwoIcon color="red.500" />
                          </Tooltip>
                        )
                      }
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>First Name</FormLabel>
                  <InputGroup>
                    <Input
                      type="text"
                      name="first_name"
                      value={user.first_name}
                      onChange={handleChange}
                    />
                    <InputRightElement
                      children={
                        isFirstNameValid ? (
                          <CheckIcon color="green.500" />
                        ) : (
                          <Tooltip
                            label="First name must be between 2 and 40 characters."
                            hasArrow
                          >
                            <WarningTwoIcon color="red.500" />
                          </Tooltip>
                        )
                      }
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Last Name</FormLabel>
                  <InputGroup>
                    <Input
                      type="text"
                      name="last_name"
                      value={user.last_name}
                      onChange={handleChange}
                    />
                    <InputRightElement
                      children={
                        isLastNameValid ? (
                          <CheckIcon color="green.500" />
                        ) : (
                          <Tooltip
                            label="Last name must be between 2 and 40 characters."
                            hasArrow
                          >
                            <WarningTwoIcon color="red.500" />
                          </Tooltip>
                        )
                      }
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Email</FormLabel>
                  <InputGroup>
                    <Input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                    />
                    <InputRightElement
                      children={
                        isEmailValid ? (
                          <CheckIcon color="green.500" />
                        ) : (
                          <Tooltip
                            label="Please enter a valid email address (e.g., example@domain.com)."
                            hasArrow
                          >
                            <WarningTwoIcon color="red.500" />
                          </Tooltip>
                        )
                      }
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                    />
                    <InputRightElement
                      children={
                        isPasswordValid ? (
                          <CheckIcon color="green.500" />
                        ) : (
                          <Tooltip
                            label="Password must be at least 6 characters long."
                            hasArrow
                          >
                            <WarningTwoIcon color="red.500" />
                          </Tooltip>
                        )
                      }
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired mt={4}>
                  <FormLabel>Confirm Password</FormLabel>
                  <InputGroup>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                    <InputRightElement
                      children={
                        isConfirmPasswordValid ? (
                          <CheckIcon color="green.500" />
                        ) : (
                          <Tooltip label="The passwords must match." hasArrow>
                            <WarningTwoIcon color="red.500" />
                          </Tooltip>
                        )
                      }
                    />
                  </InputGroup>
                </FormControl>

                <Button
                  mt={4}
                  bg={"darkGreen"}
                  textColor={"beige"}
                  _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
                  type="submit"
                  isDisabled={
                    !isUsernameValid ||
                    !isEmailValid ||
                    !isPasswordValid ||
                    !isConfirmPasswordValid ||
                    !isFirstNameValid ||
                    !isLastNameValid
                  }
                >
                  Sign Up
                </Button>
              </form>
            </Box>
          </GridItem>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Signup;
