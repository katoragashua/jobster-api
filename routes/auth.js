const express = require("express");
const router = express.Router();
const rateLimiter = require("express-rate-limit") 
const { register, login, updateUser } = require("../controllers/auth");
const {authenticateUser, testUser} = require("../middleware/authentication");

const apiRateLimiter = rateLimiter({
    windowMs: 15 * 60 * 60 * 1000,
    max: 10,
    message: {
        msg: "Rate limit exceeded: Too many requests from this IP. Wait 15 mins."
    }
}) 

router.post("/register", apiRateLimiter, register);
router.post("/login", apiRateLimiter, login);
router.patch("/updateUser", authenticateUser, testUser, updateUser);

module.exports = router;
