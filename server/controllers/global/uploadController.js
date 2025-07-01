const cloudinary = require('./../../config/cloudinaryConfig');
const fs = require('fs');

const uploadImage = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "attendance-images" // optional folder
        });

        // Delete file locally after upload
        fs.unlinkSync(req.file.path);

        res.status(200).json({ url: result.secure_url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { uploadImage };
