const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the user schema
const Register = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: false },
    password: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: ["admin", "employee", "user"],
        default: "user",
        required: false,
    },
}, { timestamps: true });

// Define the existing user schema
const signinSchema = new mongoose.Schema({
    // email: {
    //     type: String,
    //     unique: true,
    //     match: [
    //         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    //         "Please provide a valid email",
    //     ],
    // },
    username: {
        type: String,
        unique: true,
        // match: [
        //     /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        //     "Please provide a valid username",
        // ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
        select: false,
    },
});

// Hash the password before saving for `userSchema`
// Register.pre("save", async function (next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
// });

// Hash the password before saving for `userAddSchema`
signinSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model("Authentication", Register);
