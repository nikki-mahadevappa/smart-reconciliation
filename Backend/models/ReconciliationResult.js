const mongoose = require('mongoose');

const reconciliationSchema = new mongoose.Schema({
  uploadJobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UploadJob"
  },
  uploadedRecordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Record"
  },
  systemRecordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Record"
  },
  status: {
    type: String,
    enum: ["MATCHED", "PARTIAL", "UNMATCHED", "DUPLICATE"]
  },
  mismatchedFields: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

console.log("ReconciliationResult model loaded");

module.exports = mongoose.model("ReconciliationResult", reconciliationSchema);
