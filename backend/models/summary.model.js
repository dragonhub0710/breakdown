module.exports = (sequelize, Sequelize) => {
  const Summary = sequelize.define("summary", {
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
  });

  return Summary;
};
