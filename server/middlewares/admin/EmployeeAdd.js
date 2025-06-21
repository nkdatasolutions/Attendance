exports.EmployeeAdd = (req, res, next) => {
    const requiredFields = [
        "name",
        "position",
        "accountno",
        "photo",
        "email",
        "phone",
        "joiningdate",
        "experience",
    ];

    const missingFields = requiredFields.filter((field) => {
        // Handle both form-data (req.body) and file (photo via req.file)
        if (field === "photo") {
            return !req.file;
        }
        return !req.body[field];
    });

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Missing required field(s): ${missingFields.join(", ")}`,
        });
    }

    next();
};
