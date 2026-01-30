const express = require('express');
const router = express.Router();

const Record = require('../models/Record');
const ReconciliationResult = require('../models/ReconciliationResult');

// Dashboard summary
router.get('/summary', async (req, res) => {
  try {
    const totalUploaded = await Record.countDocuments({ source: "UPLOADED" });
    const matched = await ReconciliationResult.countDocuments({ status: "MATCHED" });

    const unmatched = Math.max(totalUploaded - matched, 0);
    const accuracy = totalUploaded > 0
      ? Math.round((matched / totalUploaded) * 100)
      : 0;

    res.json({
      totalUploaded,
      matched,
      unmatched,
      accuracyPercentage: accuracy
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
