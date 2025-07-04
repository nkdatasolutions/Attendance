const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, "../../uploads");
        cb(null, uploadPath); // ✅ correct
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g. 1234567890.png
    }
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Only .jpg, .jpeg, and .png formats are allowed!"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fieldSize: 5 * 1024 * 1024, // 5 MB per field (you can increase if needed)
        fields: 100,                // Max number of non-file fields
        fileSize: 5 * 1024 * 1024   // Max file size: 5MB
    }
});


module.exports = upload;
