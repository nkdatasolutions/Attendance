const cron = require('node-cron');
const moment = require('moment-timezone');
const Employee = require('../../models/admin/EmployeeAdd');
const Attendance = require('../../models/employee/Attendance');

// // console.log("[Cron] markAbsent.js loaded");
// console.log("[Cron] Scheduling job...");
// console.log(`[Cron] Running now:`, moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'));

cron.schedule('20 8 * * *', async () => {
    const today = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
    // console.log(`[Cron] Marking absent entries at ${today} 8:00 AM IST`);
    // console.log(`[Cron] Running now:`, moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss'));

    try {
        const employees = await Employee.find();

        for (const emp of employees) {
            const exists = await Attendance.findOne({ id: emp.id, date: today });
            if (!exists) {
                await Attendance.create({
                    id: emp.id,
                    date: today,
                    checkin: false,
                    checkout: false,
                });
            }
        }

        // console.log(`[Cron] Absent marked for all employees.`);
    } catch (err) {
        // console.error(`[Cron Error] Failed to mark absent:`, err.message);
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});
