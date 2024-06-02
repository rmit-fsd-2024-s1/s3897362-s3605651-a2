require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const db = require("./models");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const app = express();

// Initialize ApolloServer
const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4001;
  app.listen(PORT, () => {
    console.log(
      `Admin backend running on http://localhost:${PORT}${server.graphqlPath}`
    );
  });
});

// Sync the database
db.sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Failed to synchronize database:", err);
  });
