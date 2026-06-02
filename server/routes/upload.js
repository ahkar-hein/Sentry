const express = require("express");
const { uploadFile } = require("../controllers/uploadController");
const { protect } = require("../middleware/auth");
const upload = require("../config/multer");
const router = express.Router();

router.post("/", protect, upload.single("file"), uploadFile);

module.exports = router;
