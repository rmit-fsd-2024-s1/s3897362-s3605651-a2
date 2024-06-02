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

  type Query {
    getAllReviews: [Review]
  }
  
  type Mutation {
    deleteReviewByAdmin(review_id: ID!): Boolean
  }
`;

module.exports = typeDefs;
