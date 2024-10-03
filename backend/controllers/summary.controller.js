const db = require("../models");
const Summary = db.summary;
require("dotenv").config();

exports.getAll = async (req, res) => {
  try {
    const rows = await Summary.findAll({
      where: { userId: req.user.id.toString() },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const row = await Summary.findOne({ where: { shareId: id } });
    res.status(200).json({ data: row });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateOne = async (req, res) => {
  try {
    const { title, transcription } = req.body;
    const { id } = req.params;
    await Summary.update({ title, transcription }, { where: { id } });
    const rows = await Summary.findAll({
      where: { userId: req.user.id.toString() },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ data: rows });
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
      where: { userId: req.user.id.toString() },
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json({ data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
