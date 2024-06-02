module.exports = {
    verbose: true,
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "^@/(.*)$": "<rootDir>/src/$1",
      "^axios$": "<rootDir>/__mocks__/axios.js",
    },
    transform: {
      "^.+\\.(js|jsx)$": {
        transform: "babel-jest",
        presets: ["@babel/preset-env", "@babel/preset-react"],
      },
    },
    testEnvironment: "jsdom",
    moduleFileExtensions: ["js", "jsx", "json", "node"],
    transformIgnorePatterns: ["<rootDir>/node_modules/"],
  };
  