module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define(
      "Review",
      {
        review_id:{
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
        rating:{

        },	
        review_text:{

        },	
        created_at:{

        },	
        updated_at:{

        }},
      {
        tableName: "reviews",
        timestamps: true, // Enable Sequelize to manage createdAt and updatedAt automatically
      }
    );

    return Review;
  };
  