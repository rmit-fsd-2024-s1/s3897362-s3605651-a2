const db = require("../database");

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await db.reviews.findAll();
    res.json(reviews);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving reviews" });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await db.reviews.findByPk(req.params.id);
    if (review) {
      res.json(review);
    } else {
      res.status(404).send({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error retrieving review" });
  }
};

exports.getReviewsByProductId = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await db.reviews.findAll({
      where: {
        product_id: productId,
        is_deleted: false,
      },
    });
    res.json(reviews);
  } catch (error) {
    console.error('Error retrieving reviews for product:', error);
    res.status(500).send({ message: 'Error retrieving reviews for product' });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { user_id, product_id, rating, review_text } = req.body;
      console.log("Received data:", { user_id, product_id, rating, review_text });
    const createdAt = new Date();
    const updatedAt = new Date();
    const review = await db.reviews.create({
      user_id,
      product_id,
      rating,
      review_text,
      created_at: createdAt,
      updated_at: updatedAt,
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).send({ message: "Error creating review" });
  }
};


exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review_text } = req.body;
    const review = await db.reviews.findByPk(id);
    if (review) {
      await review.update({
        rating,
        review_text,
      });
      res.json(review);
    } else {
      res.status(404).send({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error updating review" });
  }
};

exports.deleteReviewByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await db.reviews.findByPk(id);
    if (review) {
      await review.update({
        review_text: "[**** THIS REVIEW HAS BEEN DELETED BY THE USER ****]",
        is_deleted: true,
      });
      res.json(review);
    } else {
      res.status(404).send({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error deleting review" });
  }
};

exports.deleteReviewByAdmin = async (req, res) => {
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
};
