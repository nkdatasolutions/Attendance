const Attendance = require('../../models/employee/Attendance');
const Employee = require('../../models/admin/EmployeeAdd');
const moment = require('moment');

// CREATE attendance (already handled in middleware)
exports.createAttendance = async (req, res) => {
    const { id } = req.body;
    const today = moment().format('YYYY-MM-DD');

    try {
        const employeeExists = await Employee.findOne({ id });
        if (!employeeExists) {
            return res.status(404).json({ message: 'Employee not found' }); // ✅ 404 Not Found
        }

        const existing = await Attendance.findOne({ id, date: today });
        if (existing) {
            return res.status(409).json({ message: "Attendance already exists for today", data: existing }); // ✅ 409 Conflict
        }

        const newRecord = await Attendance.create({
            id,
            date: today,
            ...req.body
        });

        return res.status(201).json(newRecord); // ✅ 201 Created
    } catch (error) {
        return res.status(500).json({ error: error.message }); // ✅ 500 Internal Server Error
    }
};

// GET all attendance
exports.getAllAttendance = async (req, res) => {
    try {
        const records = await Attendance.find();
        return res.status(200).json(records); // ✅ 200 OK
    } catch (error) {
        return res.status(500).json({ error: error.message }); // ✅ 500 Internal Server Error
    }
};

// GET attendance by ID
exports.getAttendanceById = async (req, res) => {
    const { id } = req.params;

    try {
        const employeeExists = await Employee.findOne({ id });
        if (!employeeExists) {
            return res.status(404).json({ message: 'Employee not found' }); // ✅ 404 Not Found
        }

        const records = await Attendance.find({ id });
        return res.status(200).json(records); // ✅ 200 OK
    } catch (error) {
        return res.status(500).json({ error: error.message }); // ✅ 500 Internal Server Error
    }
};

// UPDATE attendance (check-in / check-out)
exports.updateAttendance = async (req, res) => {
    const { id } = req.params;
    const today = moment().format('YYYY-MM-DD');
    const { checkin, checkout, insts, outsts, prodsts } = req.body;

    try {
        const employeeExists = await Employee.findOne({ id });
        if (!employeeExists) {
            return res.status(404).json({ message: 'Employee not found' }); // ✅ 404 Not Found
        }

        const attendance = await Attendance.findOne({ id, date: today });
        if (!attendance) {
            return res.status(404).json({ message: "Attendance not found for today." }); // ✅ 404 Not Found
        }

        if (checkin) {
            attendance.checkin = true;
            attendance.insts = insts || attendance.insts;
            attendance.absent = false;
        }

        if (checkout) {
            attendance.checkout = true;
            attendance.outsts = outsts || attendance.outsts;
        }

        if (prodsts) {
            attendance.prodsts = prodsts;
        }

        await attendance.save();
        return res.status(200).json(attendance); // ✅ 200 OK
    } catch (error) {
        return res.status(500).json({ error: error.message }); // ✅ 500 Internal Server Error
    }
};

// DELETE attendance
exports.deleteAttendance = async (req, res) => {
    const { id } = req.params;
    const today = req.query.date || moment().format('YYYY-MM-DD');

    try {
        const employeeExists = await Employee.findOne({ id });
        if (!employeeExists) {
            return res.status(404).json({ message: 'Employee not found' }); // ✅ 404 Not Found
        }

        const deleted = await Attendance.findOneAndDelete({ id, date: today });
        if (!deleted) {
            return res.status(404).json({ message: "Attendance not found for today" }); // ✅ 404 Not Found
        }

        return res.status(200).json({ message: "Deleted successfully", data: deleted }); // ✅ 200 OK
    } catch (error) {
        return res.status(500).json({ error: error.message }); // ✅ 500 Internal Server Error
    }
};

// GET attendance by date range
exports.getAttendanceByDateRange = async (req, res) => {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    console.log("ID:", id);
    console.log("startDate:", startDate);
    console.log("endDate:", endDate);

    try {
        const employeeExists = await Employee.findOne({ id });
        if (!employeeExists) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required" });
        }

        const records = await Attendance.find({
            id,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        return res.status(200).json(records);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Get all attendance from current month and current week
exports.getCurrentYearMonthWeekAttendance = async (req, res) => {
    try {
        // Current Date
        const today = moment();

        // Start of the current year
        const startOfYear = today.clone().startOf('year').format('YYYY-MM-DD');

        // Start of the current month
        const startOfMonth = today.clone().startOf('month').format('YYYY-MM-DD');

        // Start of the current week (Monday)
        const startOfWeek = today.clone().startOf('isoWeek').format('YYYY-MM-DD');

        // Yearly Attendance
        const yearlyAttendance = await Attendance.find({
            date: { $gte: startOfYear }
        });

        // Monthly Attendance
        const monthlyAttendance = await Attendance.find({
            date: { $gte: startOfMonth }
        });

        // Weekly Attendance
        const weeklyAttendance = await Attendance.find({
            date: { $gte: startOfWeek }
        });

        return res.status(200).json({
            yearStart: startOfYear,
            monthStart: startOfMonth,
            weekStart: startOfWeek,
            yearlyAttendance,
            monthlyAttendance,
            weeklyAttendance
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
