// models/TempUser.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TempUserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    phoneNo: String,
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    createdAt: { type: Date, default: Date.now, expires: 600 } // TTL: 10 minutes
});

TempUserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('TempUser', TempUserSchema);
