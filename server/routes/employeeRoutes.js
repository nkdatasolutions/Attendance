const express = require('express');
const Attendance = require('../models/employee/Attendance');
const controller  = require('../controllers/employee/Attendance');
const AttendanceReq = require('../middlewares/employee/Attendance');

const employeeRouter = express.Router();

// Attendance routes
employeeRouter.post('/attendance', AttendanceReq, controller.createAttendance);
employeeRouter.get('/attendance-all', controller.getAllAttendance);
employeeRouter.get('/attendance/:id', controller.getAttendanceById);
employeeRouter.put('/attendance-update/:id', AttendanceReq, controller.updateAttendance);
employeeRouter.delete('/attendance-drop/:id', controller.deleteAttendance);
employeeRouter.get('/attendance-range/:id', controller.getAttendanceByDateRange);
employeeRouter.get('/attendance-byall', controller.getCurrentYearMonthWeekAttendance);
employeeRouter.get('/attendance-dateall/:date', controller.getSingleDateAttendance);

module.exports = employeeRouter; 
