const express = require('express');
const adminRouter = express.Router();

const { EmployeeAdd } = require('../middlewares/admin/EmployeeAdd');
const { createEmployee, deleteEmployee, getAllEmployees, getEmployeeById, updateEmployee } = require('../controllers/admin/EmployeeAdd');

// Registration route
adminRouter.post("/employee-add", EmployeeAdd, createEmployee); // ✅ Both are functions
adminRouter.get("/employee", getAllEmployees);
adminRouter.get("/employee/:id", getEmployeeById);
adminRouter.put("/employee-update/:id", updateEmployee);
adminRouter.delete("/employee-drop/:id", deleteEmployee);

module.exports = adminRouter; 
