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
  },
};

module.exports = resolvers;
