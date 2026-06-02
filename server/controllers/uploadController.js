const cloudinary = require("../config/cloudinary");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const isVideo = req.file.mimetype.startsWith("video/");
    const base64 = req.file.buffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "sentry",
      resource_type: isVideo ? "video" : "image",
      transformation: isVideo
        ? [{ quality: "auto" }]
        : [{ quality: "auto", fetch_format: "auto" }],
    });

    res.json({
      url: result.secure_url,
      type: isVideo ? "video" : "photo",
      public_id: result.public_id,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed: " + err.message });
  }
};

module.exports = { uploadFile };
