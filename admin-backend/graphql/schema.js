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

    getAllReviews: [Review]

    getAllUsers: [User]
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

    updateReview(
      review_id: ID!
      review_text: String!
      is_deleted: Boolean!
    ): Review
  }

  type Review {
    review_id: ID!
    user_id: ID!
    product_id: ID!
    rating: Int!
    review_text: String
    is_deleted: Boolean
    createdAt: String
    updatedAt: String
  }

  type User {
    user_id: ID!
    username: String!
    email: String!
    first_name: String!
    last_name: String!
    createdAt: String
    updatedAt: String
  }
`;

module.exports = typeDefs;
