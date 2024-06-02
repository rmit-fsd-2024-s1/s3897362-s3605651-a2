module.exports = {
    verbose: true,
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "^@/(.*)$": "<rootDir>/src/$1",
    },
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    testEnvironment: "jsdom",
    moduleFileExtensions: ["js", "jsx", "json", "node"],
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
  };
  