// NavBar.js
import React from "react";
import {
  Grid,
  Flex,
  Button,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { Fade } from "@chakra-ui/transition";

/**
 * NavBar Component
 * Contains the navigation bar for the application.
 * The navigation bar displays links to different views based on the user's authentication status.
 * If the user is logged in, the navigation bar displays the user's name and a logout option.
 * If the user is not logged in, the navigation bar displays sign up and sign in options.
 * @param {Object} props - Component properties
 * @param {Function} props.changeView - Function to change the current view
 * @param {boolean} props.isLoggedIn - User authentication status
 * @param {Function} props.handleLogout - Function to handle user logout
 * @param {string} props.userName - User's name
 * @returns {JSX.Element} NavBar component
 */
const NavBar = ({ changeView, isLoggedIn, handleLogout }) => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const name = user.first_name || "";
  return (
    <Fade in={true}>
      <Grid
        as="nav"
        templateColumns="1fr 1fr 1fr"
        align="center"
        bg="middleGreen"
      >
        <div></div> {/* Empty div for left part */}
        <Flex justify="center" mt={1}>
          <Button
            onClick={() => changeView("main")}
            colorScheme="blackAlpha"
            variant="ghost"
            textColor={"beige"}
          >
            Home
          </Button>
          <Button
            onClick={() => changeView("products")}
            colorScheme="blackAlpha"
            variant="ghost"
            textColor={"beige"}
          >
            Product Specials
          </Button>
          <Button
            onClick={() => changeView("gardening-tips")}
            colorScheme="blackAlpha"
            variant="ghost"
            textColor={"beige"}
          >
            Gardening Tips
          </Button>
          {isLoggedIn && (
            <Button
              onClick={() => changeView("diet-plan")}
              colorScheme="blackAlpha"
              variant="ghost"
              textColor={"beige"}
            >
              Diet Plan
            </Button>
          )}
        </Flex>
        <Flex justify="end" pr={4} align="center">
          {isLoggedIn ? (
            <>
              <Menu>
                <MenuButton _hover={{ transform: "scale(1.1)" }}>
                  <Avatar
                    size="md"
                    name={name}
                    mr={2}
                    src="https://bit.ly/broken-link"
                    cursor="pointer"
                    onClick={() => changeView("profile")}
                    color={"beige"}
                    bg={"darkGreen"}
                  />
                </MenuButton>
                <MenuList bg={"card"} borderColor={"lightGreen"} shadow="xl">
                  <MenuItem
                    bg={"transparent"}
                    onClick={() => changeView("profile")}
                    textColor={"darkGreen"}
                    fontWeight={"bold"}
                    _hover={{ bg: "darkGreen", textColor: "beige" }}
                  >
                    Profile
                  </MenuItem>
                  <MenuDivider borderColor={"lightGreen"} />
                  <MenuItem
                    fontWeight={"bold"}
                    bg={"transparent"}
                    onClick={handleLogout}
                    color="red"
                    _hover={{ bg: "red", textColor: "beige" }}
                  >
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
            <>
              <Button
                onClick={() => changeView("signup")}
                bg={"darkGreen"}
                textColor={"beige"}
                _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
                size="sm"
                mr={2}
              >
                Sign Up
              </Button>
              <Button
                onClick={() => changeView("signin")}
                bg={"darkGreen"}
                textColor={"beige"}
                _hover={{ bg: "lightGreen", textColor: "darkGreen" }}
                size="sm"
              >
                Sign In
              </Button>
            </>
          )}
        </Flex>
      </Grid>
    </Fade>
  );
};

export default NavBar;
