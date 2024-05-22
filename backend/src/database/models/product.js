module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2), // Stores values in dollars and cents
        allowNull: false,
        validate: {
          min: {
            args: [0.01],
            msg: "Price must be greater than $0.00",
          },
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: "Quantity must be a positive integer",
          },
        },
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING, // Assuming the image is stored as a URL or base64 string
        allowNull: false,
      },
      isSpecial: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      specialPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
          isValidSpecialPrice(value) {
            if (this.isSpecial) {
              if (value == null) {
                throw new Error(
                  "Special price must be provided if the product is on special"
                );
              }
              if (value >= this.price) {
                throw new Error(
                  "Special price must be less than the regular price"
                );
              }
              if (value < 0.01) {
                throw new Error("Special price must be greater than 0");
              }
            }
          },
        },
      },
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

  return Product;
};
