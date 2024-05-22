module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    "Cart",
    {
      cart_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Ensures one cart per user
        references: {
          model: "users",
          key: "user_id",
        },
      },
    },
    {
      tableName: "cart",
      timestamps: true, // Enable Sequelize to manage createdAt and updatedAt automatically
    }
  );

  return Cart;
};
