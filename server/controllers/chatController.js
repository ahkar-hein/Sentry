const Message = require("../models/Message");

// GET /api/chat/group/:city — load group chat history
const getGroupMessages = async (req, res) => {
  try {
    const messages = await Message.find({ city: req.params.city })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 })
      .limit(50);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/chat/private/:userId — load private chat history
const getPrivateMessages = async (req, res) => {
  const myId = req.user.id;
  const otherId = req.params.userId;
  try {
    const messages = await Message.find({
      city: null,
      $or: [
        { sender: myId, recipient: otherId },
        { sender: otherId, recipient: myId },
      ],
    })
      .populate("sender", "name avatar")
      .sort({ createdAt: 1 })
      .limit(50);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/chat/group — save group message to DB
const saveGroupMessage = async (req, res) => {
  const { content, city } = req.body;
  try {
    const message = await Message.create({
      sender: req.user.id,
      city,
      content,
    });
    await message.populate("sender", "name avatar");
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/chat/private — save private message to DB
const savePrivateMessage = async (req, res) => {
  const { content, recipientId } = req.body;
  try {
    const message = await Message.create({
      sender: req.user.id,
      recipient: recipientId,
      content,
    });
    await message.populate("sender", "name avatar");
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getGroupMessages, getPrivateMessages, saveGroupMessage, savePrivateMessage };
