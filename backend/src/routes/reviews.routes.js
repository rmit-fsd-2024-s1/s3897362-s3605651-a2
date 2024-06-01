const express = require("express");
const reviewController = require("../controllers/review.controller");
const router = express.Router();

router.get("/", reviewController.getAllReviews);
router.get("/:id", reviewController.getReviewById);
router.get("/product/:productId", reviewController.getReviewsByProductId); // New route
router.post("/", reviewController.createReview);
router.put("/:id", reviewController.updateReview);
router.delete("/user/:id", reviewController.deleteReviewByUser);
router.delete("/admin/:id", reviewController.deleteReviewByAdmin);

module.exports = router;
