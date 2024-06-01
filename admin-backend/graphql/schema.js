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

  type Mutation {
    createProduct(
      name: String!
      description: String!
      price: Float!
      quantity: Int!
      unit: String!
      image: String!
      isSpecial: Boolean!
      specialPrice: Float
    ): Product

    updateProduct(
      product_id: ID!
      name: String!
      description: String!
      price: Float!
      quantity: Int!
      unit: String!
      image: String!
      isSpecial: Boolean!
      specialPrice: Float
    ): Product

    deleteProduct(product_id: ID!): Boolean
  }
`;

module.exports = typeDefs;
