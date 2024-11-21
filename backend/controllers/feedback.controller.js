const db = require("../models");
const Feedback = db.feedback;
const Breakdown = db.breakdown;
const User = db.user;
require("dotenv").config();

exports.createNew = async (req, res) => {
  try {
    const { content, userId, breakdownId } = req.body;
    let row = await Feedback.create({
      content,
      userId,
      breakdownId,
      isApproved: false,
    });
    const breakdown = await Breakdown.findOne({
      where: { id: breakdownId },
    });

    let name = "";
    const user = await User.findOne({
      where: { id: userId },
    });
    name = user.username[0];
    if (!breakdown.commenters) {
      breakdown.commenters = name.toUpperCase();
    } else {
      breakdown.commenters += ", " + name.toUpperCase();
    }
    await Breakdown.update(
      { commenters: breakdown.commenters },
      { where: { id: breakdownId } }
    );
    row = await Breakdown.findOne({
      where: { id: breakdownId },
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

exports.approve = async (req, res) => {
  try {
    const { id, breakdownId } = req.body;

    await Feedback.update(
      {
        isApproved: true,
      },
      { where: { id } }
    );
    const rows = await Feedback.findAll({
      where: { breakdownId },
      order: [["updatedAt", "DESC"]],
    });
    let list = [];
    list = await Promise.all(
      rows.map(async (item) => {
        const user = await User.findOne({
          where: { id: item.userId },
        });
        return {
          id: item.id,
          content: item.content,
          username: user.username,
          breakdownId: item.breakdownId,
          isApproved: item.isApproved,
        };
      })
    );
    res.status(200).json({ data: list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getList = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await Feedback.findAll({
      where: { breakdownId: id },
      order: [["updatedAt", "DESC"]],
    });
    let list = [];
    list = await Promise.all(
      rows.map(async (item) => {
        const user = await User.findOne({
          where: { id: item.userId },
        });
        return {
          id: item.id,
          content: item.content,
          username: user.username,
          breakdownId: item.breakdownId,
          isApproved: item.isApproved,
        };
      })
    );
    res.status(200).json({ data: list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.removeOne = async (req, res) => {
  try {
    const { id, breakdownId } = req.body;
    const row = await Feedback.findOne({
      where: { id },
    });
    await Feedback.destroy({ where: { id } });
    const rows = await Feedback.findAll({
      where: { breakdownId },
      order: [["updatedAt", "DESC"]],
    });
    const user = await User.findOne({
      where: { id: row.userId },
    });
    const username = user.username[0].toUpperCase();
    const breakdown = await Breakdown.findOne({
      where: { id: breakdownId },
    });
    let commenters = breakdown.commenters.split(",").map((item) => item.trim());
    let foundOne = false;
    commenters = commenters.filter((item) => {
      if (item == username && !foundOne) {
        foundOne = true;
        return true;
      }
      return item != username;
    });
    if (commenters.length == 0) {
      breakdown.commenters = null;
    } else {
      breakdown.commenters = commenters.join(",");
    }
    await Breakdown.update(
      { commenters: breakdown.commenters },
      { where: { id: breakdownId } }
    );
    let list = [];
    list = await Promise.all(
      rows.map(async (item) => {
        const user = await User.findOne({
          where: { id: item.userId },
        });
        return {
          id: item.id,
          content: item.content,
          username: user.username,
          breakdownId: item.breakdownId,
          isApproved: item.isApproved,
        };
      })
    );
    res.status(200).json({ data: list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
