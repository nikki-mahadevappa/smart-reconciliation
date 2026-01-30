const express = require('express');
const router = express.Router();
const ReconciliationResult = require('../models/ReconciliationResult');

// Get all reconciliation results
router.get('/', async (req, res) => {
  try {
    const results = await ReconciliationResult.find()
      .populate('systemRecordId')
      .populate('uploadedRecordId');

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
