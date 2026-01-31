require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


// Load models
require("./models/User");
require("./models/UploadJob");
require("./models/Record");
require("./models/AuditLog");
require("./models/ReconciliationResult");

const app = express();

// ✅ VERY IMPORTANT: enable CORS
app.use(cors());
app.use(express.json());

// Routes
app.use("/upload", require("./routes/upload"));
app.use("/reconciliation", require("./routes/reconciliation"));
app.use("/dashboard", require("./routes/dashboard"));

// Health check
app.get("/", (req, res) => {
  res.send("Backend working");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
