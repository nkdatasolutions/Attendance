const Employee = require("../../models/admin/EmployeeAdd");
const Attendance = require("../../models/employee/Attendance");
const Counter = require("../global/Counter");
const mongoose = require('mongoose');
const cloudinary = require("../../config/cloudinaryConfig");
const fs = require("fs");

// ✅ Create a new employee
const createEmployee = async (req, res) => {
    let counter = null;

    try {
        let photoUrl = null;

        // Step 1: Upload to Cloudinary if file exists
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "employee_photos"
            });
            photoUrl = result.secure_url;

            // Delete temp file after upload
            fs.unlinkSync(req.file.path);
        }

        // Step 2: Safely increment the counter
        counter = await Counter.findOneAndUpdate(
            { id: "employeeId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        const paddedId = String(counter.seq).padStart(3, "0");
        const id = `NK${paddedId}`;

        // Step 3: Create and save employee
        const newEmployee = new Employee({
            ...req.body,
            id,
            photo: photoUrl, // Use Cloudinary URL
        });

        const saved = await newEmployee.save();
        res.status(201).json(saved);

    } catch (err) {
        res.status(400).json({
            error: err.message,
            ...(err.errors && { validationErrors: err.errors }),
            ...(counter && { seq: counter.seq }),
        });
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
        const updateData = { ...req.body };

        // If a new photo was uploaded, update photo URL
        if (req.file) {
            updateData.photo = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
        }

        const updated = await Employee.findOneAndUpdate(
            { id: req.params.id },
            updateData,
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
        const ateDeleted = await Attendance.findOneAndDelete({ id: req.params.id });
        if (!deleted) {
            return res.status(404).json({ error: "Employee not found" });
        }
        if (!ateDeleted) {
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
