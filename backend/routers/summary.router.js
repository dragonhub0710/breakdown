const express = require("express");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();
const summaryController = require("../controllers/summary.controller");

router.get("/", auth, summaryController.getAll);
router.get("/:id", summaryController.getOne);
router.post("/update/:id", auth, summaryController.updateOne);
router.delete("/:id", auth, summaryController.removeOne);

module.exports = router;
