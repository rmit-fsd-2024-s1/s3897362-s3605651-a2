// App.js
import React, { useState, useEffect } from "react";
import { Grid, GridItem, useToast } from "@chakra-ui/react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import NavBar from "./components/NavBar";
import Products from "./components/Products";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Profile from "./components/Profile";
import DietPlan from "./components/DietPlan";
import OrderSummary from "./components/OrderSummary";
import "./App.css";
import { Fade } from "@chakra-ui/transition";

function App() {
  const toast = useToast();
  const [currentView, setCurrentView] = useState("main");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setIsLoggedIn(true);
      setUser(loggedInUser);
    }
  }, []);

  const changeView = (view) => {
    setCurrentView(view);
  };

  const handleAuthSuccess = (user) => {
    setIsLoggedIn(true);
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentView("main"); // Redirect to the home page
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear the logged-in user's state
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView("main"); // Redirect to the main page
  };

  useEffect(() => {
    // Check if the account deletion was successful
    if (localStorage.getItem("accountDeletionSuccess") === "true") {
      toast({
        title: "Successful Account Deletion",
        description: "Account has been successfully deleted.",
        status: "success", // Use 'success' instead of 'error' for successful deletion.
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      // Remove the flag to prevent the toast from appearing again on subsequent loads
      localStorage.removeItem("accountDeletionSuccess");
    }
  }, [toast]);

  return (
    <Fade in={true}>
      <Grid
        templateAreas={`"header header header"
                      "navbar navbar navbar"
                      "main main main"
                      "footer footer footer"`}
        gridTemplateRows={`10vh 7vh 79vh 4vh`}
        gridTemplateColumns={`1fr 2fr 2fr`}
        color="blackAlpha.700"
        fontWeight="bold"
      >
        <GridItem pl="2" pr="2" pt="2" pb="2" bg="lightGreen" gridArea="header">
          <Header changeView={changeView} />
        </GridItem>
        <GridItem
          pl="2"
          pr="2"
          pt="2"
          pb="2"
          bg="middleGreen"
          gridArea="navbar"
        >
          <NavBar
            changeView={changeView}
            isLoggedIn={isLoggedIn}
            handleLogout={handleLogout}
          />
        </GridItem>
        <GridItem
          pl="2"
          pr="2"
          pt="2"
          pb="2"
          gridArea="main"
          overflowY={"auto"}
          className="smooth-scroll"
          bg={"background"}
        >
          {currentView === "main" && <Main changeView={changeView} />}
          {currentView === "products" && <Products changeView={changeView} />}
          {currentView === "orderSummary" && <OrderSummary />}
          {currentView === "profile" && <Profile />}
          {currentView === "diet-plan" && <DietPlan />}
          {currentView === "signup" && (
            <Signup onSuccessfulSignup={handleAuthSuccess} />
          )}
          {currentView === "signin" && (
            <Signin onSuccessfulSignin={handleAuthSuccess} />
          )}
        </GridItem>
        <GridItem pl="2" pr="2" pt="2" bg="middleGreen" gridArea="footer">
          <Footer />
        </GridItem>
      </Grid>
    </Fade>
  );
}

export default App;
