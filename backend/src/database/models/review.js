module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define(
      "Review",
      {
        review_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "user_id",
          },
        },
        product_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "products",
            key: "product_id",
          },
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            min: 1,
            max: 5,
          },
        },
        review_text: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        is_deleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          onUpdate: DataTypes.NOW,
        },
      },
      {
        tableName: "reviews",
        timestamps: true, // Enable Sequelize to manage createdAt and updatedAt automatically
        createdAt: "created_at",
        updatedAt: "updated_at",
      }
    );
  
    return Review;
  };
  