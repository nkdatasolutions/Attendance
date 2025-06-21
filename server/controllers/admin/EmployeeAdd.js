const Employee = require("../../models/admin/EmployeeAdd");
const Counter = require("../global/Counter");

// ✅ Create a new employee
const createEmployee = async (req, res) => {
    try {
        const photoPath = req.file ? req.file.path : null;
        const photoUrl = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;

        const counter = await Counter.findOneAndUpdate(
            { id: "employeeId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const paddedId = String(counter.seq).padStart(3, "0"); // e.g., 001
        const id = `nk${paddedId}`;

        const newEmployee = new Employee({ ...req.body, id, 
            photo: photoPath,
            photo: photoUrl, // ✅ public-accessible URL
        });
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
        const employee = await Employee.findOne({ id: req.params.id }); // Use id field for lookup
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
        const updated = await Employee.findOneAndUpdate(
            { id: req.params.id },   // 🔧 FIXED
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
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
        const deleted = await Employee.findOneAndDelete({ id: req.params.id });
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
