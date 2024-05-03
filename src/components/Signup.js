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

const Signup = ({ onSuccessfulSignup }) => {
  // State to store user details
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    dateOfJoining: new Date().toLocaleDateString(),
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
  // Password must be at least 8 characters long, include at least one number, and one special character (e.g., !@#$%^&*).
  const passwordPattern =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

  /**
   * Function to handle input change
   * Updates the user state with the new value of the input field.
   * Validates the input based on the field name.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    // Inline validation checks
    if (name === "name") {
      setIsNameValid(value.length >= 2);
    } else if (name === "email") {
      setIsEmailValid(emailPattern.test(value));
    } else if (name === "password") {
      const isValid = passwordPattern.test(value);
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
      user.password === value && passwordPattern.test(user.password)
    );
  };

  const handleSubmit = (e) => {
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
     * Password must be at least 8 characters long, include at least one number, and one special character.
     * If the password is valid, the check icon is displayed; otherwise, the warning icon is displayed.
     */
    if (!isPasswordValid) {
      showErrorToast(
        "Weak Password",
        "Password must be at least 8 characters long, include at least one number, and one special character (e.g., !@#$%^&*)."
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

    /**
     * Check if the email already exists
     * If the email already exists, show an error toast.
     */
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.email === user.email)) {
      showErrorToast(
        "Email Exists",
        "An account with this email already exists."
      );
      return;
    }

    // Add the new user to the users array in localStorage
    users.push({ ...user, dateOfJoining: new Date().toLocaleDateString() });
    // Update the users array in localStorage
    localStorage.setItem("users", JSON.stringify(users));
    // Set the userLoggedIn in localStorage
    localStorage.setItem("userLoggedIn", user.email);
    // Display a success toast
    toast({
      title: "Signup Successful",
      description: "You are now logged in.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onSuccessfulSignup(); // Redirect to the home page
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
                {/* Name Field */}
                <FormControl isRequired>
                  <FormLabel>Name</FormLabel>
                  <InputGroup>
                    <Input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                    />
                    <InputRightElement
                      children={
                        isNameValid ? (
                          <CheckIcon color="green.500" />
                        ) : (
                          <Tooltip
                            label="Name must be at least 2 characters long."
                            hasArrow
                          >
                            <WarningTwoIcon color="red.500" />
                          </Tooltip>
                        )
                      }
                    />
                  </InputGroup>
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
                            label="Password must be at least 8 characters long, include at least one number, and one special character (e.g., !@#$%^&*)."
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
