// Middleware to check if user can WRITE to a community
// Users can only post/chat in their home city
const requireHomeCommunity = (req, res, next) => {
  const targetCity = req.body.city || req.params.city;

  if (!targetCity) return next();

  if (req.user.homeCity.toLowerCase() !== targetCity.toLowerCase()) {
    return res.status(403).json({
      message: "You can only post in your home community"
    });
  }
  next();
};

module.exports = { requireHomeCommunity };
