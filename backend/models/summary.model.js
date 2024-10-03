module.exports = (sequelize, Sequelize) => {
  const Summary = sequelize.define("summary", {
    title: {
      type: Sequelize.STRING,
    },
    userId: {
      type: Sequelize.STRING,
    },
    shareId: {
      type: Sequelize.STRING,
    },
    transcription: {
      type: Sequelize.TEXT,
    },
    content: {
      type: Sequelize.TEXT,
    },
  });

  return Summary;
};
