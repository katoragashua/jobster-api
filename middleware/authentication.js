const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError, BadRequestError } = require("../errors");

const authenticateUser = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach the user to the job routes
    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

const testUser = async (req, res, next) => {
  if (req.user.userId === "6409e8f57946ae18405e2989") {
    throw new BadRequestError("Test User. Read only.");
  }
  next()
};

module.exports = { authenticateUser, testUser };
