module.exports = (sequelize, Sequelize) => {
  const Feedback = sequelize.define("feedback", {
    content: {
      type: Sequelize.TEXT,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    breakdownId: {
      type: Sequelize.INTEGER,
    },
    isApproved: {
      type: Sequelize.BOOLEAN,
    },
  });

  return Feedback;
};
