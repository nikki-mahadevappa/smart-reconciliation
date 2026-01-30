const mongoose = require('mongoose');

const uploadJobSchema = new mongoose.Schema({
  fileName: String,
  fileHash: String,
  status: {
    type: String,
    enum: ["PROCESSING", "COMPLETED", "FAILED"],
    default: "PROCESSING"
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  totalRecords: Number,
  processedRecords: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

console.log("UploadJob model loaded");

module.exports = mongoose.model("UploadJob", uploadJobSchema);
