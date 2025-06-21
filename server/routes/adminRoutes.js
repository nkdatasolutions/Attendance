const express = require('express');
const adminRouter = express.Router();

const { EmployeeAdd } = require('../middlewares/admin/EmployeeAdd');
const { createEmployee, deleteEmployee, getAllEmployees, getEmployeeById, updateEmployee } = require('../controllers/admin/EmployeeAdd');
const upload = require("../middlewares/global/Upload");

// Registration route
adminRouter.post("/employee-add", upload.single("photo"), EmployeeAdd, createEmployee); // ✅ Both are functions
adminRouter.get("/employee", getAllEmployees);
adminRouter.get("/employee/:id", getEmployeeById);
adminRouter.put("/employee-update/:id", updateEmployee);
adminRouter.delete("/employee-drop/:id", deleteEmployee);

module.exports = adminRouter; 
