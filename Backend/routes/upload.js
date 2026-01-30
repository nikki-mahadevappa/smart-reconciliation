const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const UploadJob = require('../models/UploadJob');
const Record = require('../models/Record');
const { runExactMatch } = require('../services/reconciliationService');

// Multer config
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    // 1️⃣ Create upload job
    const job = await UploadJob.create({
      fileName: req.file.originalname,
      status: "PROCESSING"
    });

    const records = [];

    // 2️⃣ Read CSV safely (Excel-friendly)
    fs.createReadStream(req.file.path)
      .pipe(
        csv({
          mapHeaders: ({ header }) =>
            header.trim().toLowerCase()
        })
      )
      .on('data', (row) => {
        // Expected headers after normalize:
        // transactionid, referencenumber, amount, date

        if (!row.transactionid || !row.amount || !row.date) {
          console.log("Skipping bad row:", row);
          return;
        }

        const amount = Number(row.amount);
        const date = new Date(row.date);

        if (isNaN(amount) || isNaN(date)) {
          console.log("Invalid amount/date:", row);
          return;
        }

        records.push({
          uploadJobId: job._id,
          transactionId: row.transactionid.trim(),
          referenceNumber: row.referencenumber
            ? row.referencenumber.trim()
            : null,
          amount,
          date,
          source: "UPLOADED"
        });
      })
      .on('end', async () => {
        try {
          // 3️⃣ Save uploaded records
          await Record.insertMany(records);
          console.log("CSV rows saved:", records.length);

          // 4️⃣ Update job
          job.status = "COMPLETED";
          job.totalRecords = records.length;
          await job.save();

          // 5️⃣ AUTO reconciliation (MATCHED)
          await runExactMatch(job._id);
          console.log("Exact match reconciliation done");

        } catch (err) {
          console.error("Processing error:", err.message);
        }
      });

    // 6️⃣ Respond immediately
    res.json({
      message: "Upload accepted",
      jobId: job._id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;