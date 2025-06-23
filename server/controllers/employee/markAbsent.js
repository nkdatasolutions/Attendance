const cron = require('node-cron');
const moment = require('moment-timezone');
const Employee = require('../../models/admin/EmployeeAdd');
const Attendance = require('../../models/employee/Attendance');

// Schedule the job to run at 8:00 AM IST
cron.schedule('0 8 * * *', async () => {
    const today = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
    console.log(`[Cron] Marking absent entries at ${today} 8:00 AM IST`);

    try {
        const employees = await Employee.find();

        for (const emp of employees) {
            const exists = await Attendance.findOne({ id: emp.id, date: today });
            if (!exists) {
                await Attendance.create({
                    id: emp.id,
                    date: today,
                    checkin: false,
                    insts: "Absent",
                    prodsts: "No activity"
                });
            }
        }

        console.log(`[Cron] Absent marked for all employees.`);
    } catch (err) {
        console.error(`[Cron Error] Failed to mark absent:`, err.message);
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});
