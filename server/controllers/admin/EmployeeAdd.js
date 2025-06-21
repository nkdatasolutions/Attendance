const Employee  = require("../../models/admin/EmployeeAdd");

// ✅ Create a new employee
const createEmployee = async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        const saved = await newEmployee.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ✅ Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Get single employee by ID
const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Update employee by ID
const updateEmployee = async (req, res) => {
    try {
        const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ✅ Delete employee by ID
const deleteEmployee = async (req, res) => {
    try {
        const deleted = await Employee.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: "Employee not found" });
        }
        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
};
