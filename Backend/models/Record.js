const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  uploadJobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UploadJob"
  },
  transactionId: {
    type: String,
    required: true
  },
  referenceNumber: String,
  amount: Number,
  date: Date,
  source: {
    type: String,
    enum: ["SYSTEM", "UPLOADED"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Required indexes (assignment requirement)
recordSchema.index({ transactionId: 1 });
recordSchema.index({ referenceNumber: 1 });
recordSchema.index({ uploadJobId: 1 });

console.log("Record model loaded");

module.exports = mongoose.model("Record", recordSchema);
