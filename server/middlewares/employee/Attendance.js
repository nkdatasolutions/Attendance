// middlewares/ensureDailyAttendance.js
const Attendance = require('./../../models/employee/Attendance');
const moment = require('moment');

const AttendanceReq = async (req, res, next) => {
    const id = req.body.id || req.params.id;
    const today = moment().format('YYYY-MM-DD');

    if (!id) {
        return res.status(400).json({ message: "Employee ID is required" });
    }

    try {
        const existing = await Attendance.findOne({ id, date: today });

        if (!existing) {
            await Attendance.create({ id, date: today });
        }

        next();
    } catch (error) {
        // console.error("Middleware error:", error);
        res.status(500).json({ message: "Server error during daily attendance check." });
    }
};

module.exports = AttendanceReq;
