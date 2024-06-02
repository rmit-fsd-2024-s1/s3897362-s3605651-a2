module.exports = {
    verbose: true,
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"], // Corrected the path to setupTests.js
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "^@/(.*)$": "<rootDir>/src/$1",
      "^axios$": "<rootDir>/__mocks__/axios.js", // Adjust the path to your axios mock file
    },
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    testEnvironment: "jsdom",
    moduleFileExtensions: ["js", "jsx", "json", "node"],
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
  };
  