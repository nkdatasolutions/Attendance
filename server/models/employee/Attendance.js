const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    id: { type: String, required: true },
    date: { type: String, required: true }, // Format: "YYYY-MM-DD"
    checkin: { type: Boolean, default: false },
    checkintime: { type: Date, default: null },
    checkout: { type: Boolean, default: false },
    checkouttime: { type: Date, default: null },
    absent: { type: Boolean, default: true },
    insts: { type: String, default: "" },
    outsts: { type: String, default: "" },
    prodsts: { type: String, default: "" },
}, { timestamps: true });

AttendanceSchema.index({ id: 1, date: 1 }, { unique: true });

AttendanceSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (_, ret) {
        delete ret._id;
    },
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
