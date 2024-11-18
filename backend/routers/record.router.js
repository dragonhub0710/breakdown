const express = require("express");
const multer = require("multer");
const router = express.Router();
const recordController = require("../controllers/record.controller");

// Configure Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Define article routes
router.post("/", upload.single("file"), recordController.summarize);

module.exports = router;
