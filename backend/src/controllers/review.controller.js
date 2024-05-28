const db = require("../database");

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await db.Review.findAll();
    res.json(reviews);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving reviews" });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await db.Review.findByPk(req.params.id);
    if (review) {
      res.json(review);
    } else {
      res.status(404).send({ message: "Review not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error retrieving review" });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { user_id, product_id, rating, review_text } = req.body;
    const review = await db.Review.create({
      user_id,
      product_id,
      rating,
      review_text,
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
    const review = await db.Review.findByPk(id);
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
    const review = await db.Review.findByPk(id);
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
    const review = await db.Review.findByPk(id);
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
