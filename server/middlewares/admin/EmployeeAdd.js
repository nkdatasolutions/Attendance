exports.EmployeeAdd = (req, res, next) => {
    const { name, position, accountno, photo, email, phone, joiningdate, experience } = req.body;

    if (!name || !position || !accountno || !photo || !email || !phone || !joiningdate || !experience) {
        return res.status(400).json({ message: "All fields are required" });
    }

    next();
};
