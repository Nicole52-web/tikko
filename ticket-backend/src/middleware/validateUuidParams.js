const { isValidUuid } = require("../utils/uuid");

/** Reject route params that must be UUIDs (e.g. :id, :ticketId). */
const validateUuidParams = (...paramNames) => (req, res, next) => {
  for (const name of paramNames) {
    const value = req.params[name];
    if (value != null && value !== "" && !isValidUuid(value)) {
      return res.status(400).json({ message: `Invalid ${name}` });
    }
  }
  next();
};

module.exports = validateUuidParams;
