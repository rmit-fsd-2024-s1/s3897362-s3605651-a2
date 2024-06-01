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
  },
};

module.exports = resolvers;
