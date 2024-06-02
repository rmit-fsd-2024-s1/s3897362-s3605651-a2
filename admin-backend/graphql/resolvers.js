const {
  getAllUsers,
} = require("../../backend/src/controllers/user.controller");
const db = require("../models");

const resolvers = {
  Query: {
    getAllProducts: async () => {
      try {
        const products = await db.product.findAll();
        return products;
      } catch (error) {
        throw new Error("Error retrieving products");
      }
    },
    getAllReviews: async () => {
      try {
        const reviews = await db.review.findAll();
        return reviews;
      } catch (error) {
        throw new Error("Error retrieving reviews");
      }
    },
    getAllUsers: async () => {
      try {
        const users = await db.user.findAll();
        return users;
      } catch (error) {
        throw new Error("Error retrieving users");
      }
    },
  },
  Mutation: {
    createProduct: async (_, args) => {
      try {
        const product = await db.product.create(args);
        return product;
      } catch (error) {
        throw new Error("Error creating product");
      }
    },
    updateProduct: async (_, args) => {
      try {
        const { product_id } = args;
        const product = await db.product.findByPk(product_id);
        if (!product) {
          throw new Error("Product not found");
        }
        await product.update(args);
        return product;
      } catch (error) {
        throw new Error("Error updating product");
      }
    },
    deleteProduct: async (_, { product_id }) => {
      try {
        const product = await db.product.findByPk(product_id);
        if (!product) {
          throw new Error("Product not found");
        }
        await product.destroy();
        return true;
      } catch (error) {
        throw new Error("Error deleting product");
      }
    },
    updateReview: async (_, { review_id, review_text, is_deleted }) => {
      const review = await db.review.findByPk(review_id);
      if (!review) {
        throw new Error("Review not found");
      }
      review.review_text = review_text;
      review.is_deleted = is_deleted;
      await review.save();
      return review;
    },
  },
};
module.exports = resolvers;
