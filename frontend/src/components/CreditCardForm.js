import { useState } from "react";
import {
  Button,
  Input,
  FormControl,
  FormLabel,
  Heading,
  Flex,
  InputGroup,
  InputRightElement,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { CheckIcon, WarningTwoIcon } from "@chakra-ui/icons";

const CreditCardForm = ({ onClose, changeView }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");

  const [isCardNumberValid, setIsCardNumberValid] = useState(false);
  const [isExpiryDateValid, setIsExpiryDateValid] = useState(false);
  const [isCvcValid, setIsCvcValid] = useState(false);
  const [isNameOnCardValid, setIsNameOnCardValid] = useState(false);

  const toast = useToast();

  const validateCardNumber = (number) => {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    const regex =
      /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;
    return regex.test(number);
  };

  const validateExpiryDate = (date) => {
    const regex = /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/;
    const isValidFormat = regex.test(date);
    if (isValidFormat) {
      const today = new Date();
      const [month, year] = date.split("/");
      const expiry = new Date(
        year.length === 2 ? `20${year}` : year,
        month - 1
      );
      return today <= expiry;
    }
    return false;
  };

  const validateCvc = (cvc) => {
    const regex = /^[0-9]{3}$/;
    return regex.test(cvc);
  };

  const validateNameOnCard = (name) => {
    return name.length >= 2;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    setCardNumber(value);
    setIsCardNumberValid(validateCardNumber(value));
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value;
    setExpiryDate(value);
    setIsExpiryDateValid(validateExpiryDate(value));
  };

  const handleCvcChange = (e) => {
    const value = e.target.value;
    setCvc(value);
    setIsCvcValid(validateCvc(value));
  };

  const handleNameOnCardChange = (e) => {
    const value = e.target.value;
    setNameOnCard(value);
    setIsNameOnCardValid(validateNameOnCard(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Close the modal
    onClose();
    // Change the view to the order summary page
    changeView("orderSummary");
    toast({
      title: "Order Placed",
      description: "Your order has been placed successfully.",
      status: "success",
      duration: 10000,
      isClosable: false,
      position: "top",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Heading
        as="h1"
        size="md"
        fontFamily="'Josefin Sans', sans-serif"
        mb={5}
        color="heading"
      >
        Enter Credit Card Details
      </Heading>
      <FormControl>
        <FormLabel color="darkGreen">Credit Card Number</FormLabel>
        <InputGroup>
          <Input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="Enter card number"
          />
          <InputRightElement>
            <Tooltip
              label={
                isCardNumberValid
                  ? "Valid"
                  : "Invalid - Please enter a valid card number (e.g., 4111 1111 1111 1111)"
              }
              aria-label="A tooltip"
            >
              {isCardNumberValid ? (
                <CheckIcon color="green.500" />
              ) : (
                <WarningTwoIcon color="red.500" />
              )}
            </Tooltip>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel mt={2} color="darkGreen">
          Expiry Date
        </FormLabel>
        <InputGroup>
          <Input
            type="text"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            placeholder="MM/YY"
          />
          <InputRightElement>
            <Tooltip
              label={
                isExpiryDateValid
                  ? "Valid"
                  : "Invalid - Please enter a valid expiry date (e.g., 12/24)"
              }
              aria-label="A tooltip"
            >
              {isExpiryDateValid ? (
                <CheckIcon color="green.500" />
              ) : (
                <WarningTwoIcon color="red.500" />
              )}
            </Tooltip>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel mt={2} color="darkGreen">
          CVC
        </FormLabel>
        <InputGroup>
          <Input
            type="text"
            value={cvc}
            onChange={handleCvcChange}
            placeholder="CVC"
          />
          <InputRightElement>
            <Tooltip
              label={
                isCvcValid
                  ? "Valid"
                  : "Invalid - Please enter a valid CVC (e.g., 123)"
              }
              aria-label="A tooltip"
            >
              {isCvcValid ? (
                <CheckIcon color="green.500" />
              ) : (
                <WarningTwoIcon color="red.500" />
              )}
            </Tooltip>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel mt={2} color="darkGreen">
          Name on Card
        </FormLabel>
        <InputGroup>
          <Input
            type="text"
            value={nameOnCard}
            onChange={handleNameOnCardChange}
            placeholder="Name on Card"
          />
          <InputRightElement>
            <Tooltip
              label={
                isNameOnCardValid
                  ? "Valid"
                  : "Invalid - Please enter a valid name (e.g., John Doe)"
              }
              aria-label="A tooltip"
            >
              {isNameOnCardValid ? (
                <CheckIcon color="green.500" />
              ) : (
                <WarningTwoIcon color="red.500" />
              )}
            </Tooltip>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Flex justifyContent="flex-end">
        <Button
          type="submit"
          colorScheme="blue"
          size="md"
          mt={5}
          isDisabled={
            !isCardNumberValid ||
            !isExpiryDateValid ||
            !isCvcValid ||
            !isNameOnCardValid
          }
        >
          Checkout
        </Button>
      </Flex>
    </form>
  );
};

export default CreditCardForm;
