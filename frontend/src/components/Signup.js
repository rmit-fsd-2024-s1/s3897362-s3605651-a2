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
  const [confirmPassword, setConfirmPassword] = useState(""); // State to store confirm password
  const [isNameValid, setIsNameValid] = useState(false); // State to store name validation status
  const [isEmailValid, setIsEmailValid] = useState(false); // State to store email validation status
  const [isPasswordValid, setIsPasswordValid] = useState(false); // State to store password validation status
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false); // State to store confirm password validation status
  const toast = useToast(); // Toast notification

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

    // Inline validation checks
    if (name === "first_name" || name === "last_name") {
      setIsNameValid(value.length >= 2);
    } else if (name === "email") {
      setIsEmailValid(emailPattern.test(value));
    } else if (name === "password") {
      const isValid = value.length >= 6; // Simplified password validation
      setIsPasswordValid(isValid);
      if (confirmPassword) {
        setIsConfirmPasswordValid(isValid && value === confirmPassword);
      }
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
    setIsConfirmPasswordValid(
      user.password === value && user.password.length >= 6
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /**
     * Validation for Name
     * Name must be at least 2 characters long.
     * If the name is valid, the check icon is displayed; otherwise, the warning icon is displayed.
     */
    if (!isNameValid) {
      showErrorToast(
        "Invalid Name",
        "Name must be at least 2 characters long."
      );
      return;
    }

    /**
     * Validation for Email
     * Email must match the email pattern.
     * If the email is valid, the check icon is displayed; otherwise, the warning icon is displayed.
     */
    if (!isEmailValid) {
      showErrorToast("Invalid Email", "Please enter a valid email address.");
      return;
    }

    /**
     * Validation for Password
     * Password must be at least 6 characters long.
     * If the password is valid, the check icon is displayed; otherwise, the warning icon is displayed.
     */
    if (!isPasswordValid) {
      showErrorToast(
        "Weak Password",
        "Password must be at least 6 characters long."
      );
      return;
    }

    /**
     * Validation for Confirm Password
     * Confirm password must match the password.
     * If the confirm password is valid, the check icon is displayed; otherwise, the warning icon is displayed.
     */
    if (!isConfirmPasswordValid) {
      showErrorToast("Password Mismatch", "The passwords do not match.");
      return;
    }

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
                {/* First Name Field */}
                <FormControl isRequired>
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
                        isNameValid ? (
                          <CheckIcon color="green.500" />
                        ) : (
                          <Tooltip
                            label="First name must be at least 2 characters long."
                            hasArrow
                          >
                            <WarningTwoIcon color="red.500" />
                          </Tooltip>
                        )
                      }
                    />
                  </InputGroup>
                </FormControl>

                {/* Last Name Field */}
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
                        isNameValid ? (
                          <CheckIcon color="green.500" />
                        ) : (
                          <Tooltip
                            label="Last name must be at least 2 characters long."
                            hasArrow
                          >
                            <WarningTwoIcon color="red.500" />
                          </Tooltip>
                        )
                      }
                    />
                  </InputGroup>
                </FormControl>

                {/* Username Field */}
                <FormControl isRequired mt={4}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                  />
                </FormControl>

                {/* Email Field */}
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

                {/* Password Field */}
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

                {/* Confirm Password Field */}
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
                    !isNameValid ||
                    !isEmailValid ||
                    !isPasswordValid ||
                    !isConfirmPasswordValid
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
