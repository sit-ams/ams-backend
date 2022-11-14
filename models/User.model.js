module.exports = (Sequelize, sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    prn: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    },
    type: {
      type: Sequelize.ENUM({
        values: ["admin", "faculty", "student"],
      }),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return User;
};
