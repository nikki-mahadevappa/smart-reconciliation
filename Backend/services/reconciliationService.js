const Record = require('../models/Record');
const ReconciliationResult = require('../models/ReconciliationResult');

async function runExactMatch(uploadJobId) {
  // 1️⃣ Get uploaded records for this job
  const uploadedRecords = await Record.find({
    uploadJobId,
    source: "UPLOADED"
  });

  for (const uploaded of uploadedRecords) {
    // 2️⃣ Find matching system record
    const systemRecord = await Record.findOne({
      transactionId: uploaded.transactionId,
      amount: uploaded.amount,
      source: "SYSTEM"
    });

    if (!systemRecord) continue;

    // 3️⃣ Save reconciliation result
    await ReconciliationResult.create({
      transactionId: uploaded.transactionId,
      systemRecordId: systemRecord._id,
      uploadedRecordId: uploaded._id,
      status: "MATCHED",
      matchedFields: ["transactionId", "amount", "date"]
    });
  }
}

module.exports = { runExactMatch };
