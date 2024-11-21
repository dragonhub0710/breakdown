module.exports = (sequelize, Sequelize) => {
  const Breakdown = sequelize.define("breakdown", {
    title: {
      type: Sequelize.STRING,
    },
    content: {
      type: Sequelize.TEXT,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    isShared: {
      type: Sequelize.BOOLEAN,
    },
    transcription: {
      type: Sequelize.TEXT,
    },
    shareId: {
      type: Sequelize.STRING,
    },
    commenters: {
      type: Sequelize.TEXT,
    },
  });

  return Breakdown;
};
