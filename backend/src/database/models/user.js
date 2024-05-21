module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(32),
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(128),
        unique: true,
        allowNull: false,
      },
      password_hash: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      first_name: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(40),
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: true, // Enable Sequelize to manage createdAt and updatedAt automatically
    }
  );

  return User;
};
