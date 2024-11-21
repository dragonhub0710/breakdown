const db = require("../models");
const Breakdown = db.breakdown;
require("dotenv").config();

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await Breakdown.findOne({
      where: { shareId: id },
    });
    if (row.commenters) {
      row.commenters = row.commenters.split(",").map((item) => item.trim());
    }
    res.status(200).json({ data: row });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMylist = async (req, res) => {
  try {
    const rows = await Breakdown.findAll({
      where: { userId: req.user.id },
      order: [["updatedAt", "DESC"]],
    });
    rows.forEach((row) => {
      if (row.commenters) {
        row.commenters = row.commenters.split(",").map((item) => item.trim());
      }
    });
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getPubliclist = async (req, res) => {
  try {
    const rows = await Breakdown.findAll({
      where: {
        userId: { [db.Sequelize.Op.ne]: req.user.id },
        isShared: true,
      },
      order: [["updatedAt", "DESC"]],
    });
    rows.forEach((row) => {
      if (row.commenters) {
        row.commenters = row.commenters.split(",").map((item) => item.trim());
      }
    });
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.createNew = async (req, res) => {
  try {
    const { breakdown, isShared = false } = req.body;
    const row = await Breakdown.create({
      title: breakdown.title,
      content: breakdown.content,
      userId: req.user.id,
      transcription: breakdown.transcription,
      isShared: isShared,
      shareId: generateRandomString(),
      commenters: null,
    });
    res.status(200).json({ data: row });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const { breakdown } = req.body;
    let commenters = "";
    if (breakdown.commenters && breakdown.commenters.length > 0) {
      commenters = breakdown.commenters.join(", ");
    }

    await Breakdown.update(
      {
        title: breakdown.title,
        content: breakdown.content,
        transcription: breakdown.transcription,
        isShared: breakdown.isShared,
        commenters: commenters,
      },
      { where: { id: breakdown.id } }
    );
    const row = await Breakdown.findOne({
      where: { id: breakdown.id },
    });
    if (row.commenters) {
      row.commenters = row.commenters.split(",").map((item) => item.trim());
    }
    res.status(200).json({ data: row });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeOne = async (req, res) => {
  try {
    const { id } = req.params;
    await Breakdown.destroy({ where: { id } });
    const rows = await Breakdown.findAll({
      where: { userId: req.user.id },
      order: [["updatedAt", "DESC"]],
    });
    rows.forEach((row) => {
      if (row.commenters) {
        row.commenters = row.commenters.split(",").map((item) => item.trim());
      }
    });
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const generateRandomString = (length = 16) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
