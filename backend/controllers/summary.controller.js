const db = require("../models");
const Summary = db.summary;
require("dotenv").config();

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await Summary.findOne({
      where: { id },
    });
    res.status(200).json({ data: row });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMylist = async (req, res) => {
  try {
    const rows = await Summary.findAll({
      where: { userId: req.user.id },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPubliclist = async (req, res) => {
  try {
    const rows = await Summary.findAll({
      where: {
        userId: { [db.Sequelize.Op.ne]: req.user.id },
        isShared: true,
      },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createNew = async (req, res) => {
  try {
    const { summary, isShared = false } = req.body;
    const row = await Summary.create({
      title: summary.title,
      content: summary.content,
      userId: req.user.id,
      transcription: summary.transcription,
      isShared: isShared,
    });
    res.status(200).json({ data: row });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const { summary, isShared = false } = req.body;
    if (!summary.id) {
      const newRow = await Summary.create({
        title: summary.title,
        content: summary.content,
        transcription: summary.transcription,
        isShared: isShared,
        userId: req.user.id,
      });
      return res.status(200).json({ data: newRow });
    } else {
      await Summary.update(
        {
          title: summary.title,
          content: summary.content,
          transcription: summary.transcription,
          isShared: isShared,
        },
        { where: { id: summary.id } }
      );
      const row = await Summary.findOne({
        where: { id: summary.id },
      });
      res.status(200).json({ data: row });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeOne = async (req, res) => {
  try {
    const { id } = req.params;
    await Summary.destroy({ where: { id } });
    const rows = await Summary.findAll({
      where: { userId: req.user.id },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
