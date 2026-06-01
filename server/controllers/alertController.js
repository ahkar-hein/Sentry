const twilio = require("twilio");
const Alert = require("../models/Alert");
const Message = require("../models/Message");
const { getIO } = require("../socket/socketManager");

// POST /api/alerts — fire an emergency alert
const fireAlert = async (req, res) => {
  const { type, trigger, location } = req.body;
  const city = req.user.homeCity;

  try {
    // Save alert to database
    const alert = await Alert.create({
      reporter: req.user.id,
      city,
      type: type || "general",
      trigger,
      location,
    });

    // Broadcast to all neighbors in the city via Socket.io
    const io = getIO();
    io.to(city).emit("new_emergency_alert", {
      alertId: alert._id,
      type: alert.type,
      location: alert.location,
      city,
      createdAt: alert.createdAt,
    });

    // Post alert as a message in group chat automatically
    await Message.create({
      sender: req.user.id,
      city,
      content: `EMERGENCY ALERT: ${alert.type.toUpperCase()} reported nearby. Stay safe.`,
      type: "alert",
    });

    // Send SMS to police via Twilio
    try {
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: `SENTRY ALERT - ${city}, CA\nType: ${alert.type}\nLocation: ${location.address || `${location.lat},${location.lng}`}\nTime: ${new Date().toLocaleTimeString()}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.POLICE_PHONE_NUMBER,
      });
      await Alert.findByIdAndUpdate(alert._id, { policeSMSSent: true });
    } catch (twilioErr) {
      console.warn("Twilio SMS failed:", twilioErr.message);
    }

    res.status(201).json({ message: "Alert sent", alert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/alerts/:city — get recent alerts for a city
const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ city: req.params.city })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { fireAlert, getAlerts };
