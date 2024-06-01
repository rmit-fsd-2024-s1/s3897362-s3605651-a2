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
};

module.exports = resolvers;
