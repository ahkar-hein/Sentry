const express = require("express");
const { fireAlert, getAlerts } = require("../controllers/alertController");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/", protect, fireAlert);           // fire alert (home city only)
router.get("/:city", getAlerts);                // get alerts for any city (read-only)
module.exports = router;
