const express = require("express");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();
const breakdownController = require("../controllers/breakdown.controller");

router.post("/", auth, breakdownController.createNew);
router.put("/", auth, breakdownController.updateOne);
router.get("/", auth, breakdownController.getMylist);
router.get("/public", auth, breakdownController.getPubliclist);
router.get("/:id", breakdownController.getOne);
router.delete("/:id", auth, breakdownController.removeOne);

module.exports = router;
