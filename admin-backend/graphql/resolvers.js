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
    
  Query: {
    getAllReviews: async (req, res) => {
      try {
        const reviews = await db.reviews.findAll({
          include: [
            {
              model: db.user,
              attributes: ["username"],
            },
          ],
        });
        res.json(reviews);
      } catch (error) {
        res.status(500).send({ message: "Error retrieving reviews" });
      }
    },
  },
  Mutation: {
    deleteReviewByAdmin: async (req, res) => {
      try {
        const { id } = req.params;
        const review = await db.reviews.findByPk(id);
        if (review) {
          await review.update({
            review_text: "[**** THIS REVIEW HAS BEEN DELETED BY THE ADMIN ****]",
            is_deleted: true,
          });
          res.json(review);
        } else {
          res.status(404).send({ message: "Review not found" });
        }
      } catch (error) {
        res.status(500).send({ message: "Error deleting review" });
      }
    },
  }
};
module.exports = resolvers;
