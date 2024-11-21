const express = require("express");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();
const feedbackController = require("../controllers/feedback.controller");

router.post("/", feedbackController.createNew);
router.post("/approve", auth, feedbackController.approve);
router.post("/delete", auth, feedbackController.removeOne);
router.get("/:id", feedbackController.getList);

module.exports = router;
