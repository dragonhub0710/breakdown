const express = require("express");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();
const summaryController = require("../controllers/summary.controller");

router.get("/", auth, summaryController.getMylist);
router.get("/public", auth, summaryController.getPubliclist);
router.post("/", auth, summaryController.createNew);
router.get("/:id", auth, summaryController.getOne);
router.put("/", auth, summaryController.updateOne);
router.post("/update/:id", auth, summaryController.updateOne);
router.delete("/:id", auth, summaryController.removeOne);

module.exports = router;
