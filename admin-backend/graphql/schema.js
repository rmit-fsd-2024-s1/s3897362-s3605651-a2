const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Product {
    product_id: ID!
    name: String!
    description: String!
    price: Float!
    quantity: Int!
    unit: String!
    image: String!
    isSpecial: Boolean!
    specialPrice: Float
  }

  type Query {
    getAllProducts: [Product]
  }
`;

module.exports = typeDefs;
