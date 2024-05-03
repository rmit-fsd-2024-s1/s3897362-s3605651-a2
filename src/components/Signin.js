import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { Fade } from "@chakra-ui/transition";

const Signin = ({ onSuccessfulSignin }) => {
  // State to store user credentials
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const toast = useToast(); // Toast notification

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];
    // Find user with matching email and password
    const user = users.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    // If user is found, set userLoggedIn in localStorage and display success toast
    if (user) {
      localStorage.setItem("userLoggedIn", credentials.email);
      toast({
        title: "Successful Login",
        description: `Welcome ${user.name}!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onSuccessfulSignin();
    } else {
      // If user is not found, display error toast
      toast({
        title: "Error",
        description: "Invalid email or password",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Fade in={true}>
      <Box my={8}>
        <Heading
          as="h1"
          size="lg"
          fontFamily="'Josefin Sans', sans-serif"
          textAlign="center"
        >
          Sign In
        </Heading>
        <Box
          maxW={{ base: "90%", sm: "80%", md: "500px", lg: "400px" }}
          mx="auto"
          p={6}
          boxShadow="lg"
          borderRadius="lg"
          bg="card"
          textColor={"heading"}
          borderColor={"beige"}
        >
          <form onSubmit={handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
              />
            </FormControl>
            <FormControl isRequired mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
              />
            </FormControl>
            <Button
              mt={4}
              bg={"darkGreen"}
              textColor={"beige"}
              _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
              type="submit"
            >
              Sign In
            </Button>
          </form>
        </Box>
      </Box>
    </Fade>
  );
};

export default Signin;
