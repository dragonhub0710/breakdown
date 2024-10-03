const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Connect Database
const db = require("./models");
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Middleware
app.use(cors());
app.use(express.json({ limit: "Infinity" }));
process.setMaxListeners(0);

// Define Routes
app.use("/api/summary", require("./routers/summary.router"));
app.use("/api/record", require("./routers/record.router"));
app.use("/api/auth", require("./routers/auth.router"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
