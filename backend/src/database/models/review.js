module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define(
      "Review",
      {
      },
      {
        tableName: "products",
        timestamps: true, // Enable Sequelize to manage createdAt and updatedAt automatically
      }
    );
  
    // Set specialPrice to null if isSpecial is false
    Product.addHook("beforeSave", (product) => {
      if (!product.isSpecial) {
        product.specialPrice = null;
      }
    });
  
    return Review;
  };
  