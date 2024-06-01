export const validateForm = (formState, setFormErrors) => {
  const errors = {};
  if (
    !formState.name ||
    formState.name.length < 1 ||
    formState.name.length > 80
  ) {
    errors.name = "Name must be between 1 and 80 characters";
  }
  if (
    !formState.description ||
    formState.description.length < 1 ||
    formState.description.length > 256
  ) {
    errors.description = "Description must be between 1 and 256 characters";
  }
  const pricePattern = /^\d+\.\d{2}$/;
  if (!pricePattern.test(formState.price) || parseFloat(formState.price) <= 0) {
    errors.price =
      "Price must be a number with exactly two decimal places and greater than 0";
  }
  if (
    isNaN(formState.quantity) ||
    formState.quantity <= 0 ||
    !Number.isInteger(formState.quantity)
  ) {
    errors.quantity = "Quantity must be a positive integer";
  }
  if (!formState.unit) {
    errors.unit = "Unit cannot be null";
  }
  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d](([a-z\\d-]*[a-z\\d])?))\\.)*[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  if (!formState.image) {
    errors.image = "Image URL cannot be null";
  } else if (!urlPattern.test(formState.image)) {
    errors.image = "Image URL must be a valid URL";
  }
  if (
    formState.isSpecial &&
    (!pricePattern.test(formState.specialPrice) ||
      parseFloat(formState.specialPrice) >= parseFloat(formState.price) ||
      parseFloat(formState.specialPrice) <= 0)
  ) {
    errors.specialPrice =
      "Special Price must be a number with exactly two decimal places, less than Price, and greater than 0";
  }
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};
