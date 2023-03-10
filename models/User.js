const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Isemail = require("isemail")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "An email is required to continue."],
    maxlength: [50, "Email must not exceed 50 characters"],
    minlength: [3, "Email must not not be less than 3 characters"],
    unique: [true],
    lowercase: true,
    trim: true,
    validate: [(val) => Isemail.validate(val), "Enter a valid email address."],
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
  },
  lastName: {
    type: String,
    trim: true,
    default: "Lastname",
    maxlength: 20,
  },
  location: {
    type: String,
    trim: true,
    default: "My City",
    maxlength: 20,
  },
});

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name},
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  )
}

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('User', UserSchema)
