const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  entityType: {
    type: String,
    enum: ["RECORD", "RECONCILIATION"]
  },
  entityId: mongoose.Schema.Types.ObjectId,
  action: String,
  oldValue: Object,
  newValue: Object,
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  source: {
    type: String,
    enum: ["SYSTEM", "USER"]
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// 🚫 Do NOT allow updates or deletes
auditLogSchema.pre('updateOne', () => {
  throw new Error("Audit logs are immutable");
});

auditLogSchema.pre('deleteOne', () => {
  throw new Error("Audit logs are immutable");
});

console.log("AuditLog model loaded");

module.exports = mongoose.model("AuditLog", auditLogSchema);
