module.exports = (Sequelize, sequelize) => {
  const User_Activity = sequelize.define("User_Activity", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    activity: {
      type: Sequelize.ENUM({
        values: ["login", "logout"],
      }),
      allowNull: false,
    },
  });

  return User_Activity;
};
