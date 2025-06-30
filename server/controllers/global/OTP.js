// controllers/auth/sendOtp.js
const { OTP, Register, TempUser } = require('../../models');
const { sendOtpEmail, sendToken } = require('../../utils');
const bcrypt = require('bcryptjs');

exports.sendOtpToEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set expiry to 10 mins
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Upsert OTP record (one per email)
        await OTP.findOneAndUpdate(
            { email },
            { otp, expiresAt },
            { upsert: true, new: true }
        );

        await sendOtpEmail(email, otp);

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        // console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
};

// controllers/auth/verifyOtp.js
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpRecord = await OTP.findOne({ email });

        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP not found' });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Optional: delete used OTP
        await OTP.deleteOne({ email });

        res.status(200).json({ message: 'OTP verified' });
    } catch (error) {
        // console.error('OTP Verification Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// controllers/auth/verifyOtp.js
exports.verifyHashedOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) return res.status(400).json({ message: 'OTP not found' });

        const isMatch = await bcrypt.compare(otp, otpRecord.otp);
        if (!isMatch) return res.status(400).json({ message: 'Invalid OTP' });

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Fetch temp user
        const tempUser = await TempUser.findOne({ email });
        if (!tempUser) return res.status(400).json({ message: 'User session expired' });

        // Move to permanent users
        const user = await Register.create({
            name: tempUser.name,
            email: tempUser.email,
            username: tempUser.username,
            phoneNo: tempUser.phoneNo,
            password: tempUser.password,
            role: tempUser.role
        });

        // Clean up
        await TempUser.deleteOne({ email });
        await OTP.deleteOne({ email });

        sendToken(user, 201, res);
    } catch (error) {
        // console.error('OTP Verification Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyOtpAndRegister = async (req, res) => {
    const { name, email, username, password, otp } = req.body;

    try {
        const otpRecord = await OTP.findOne({ email });
        if (!otpRecord) return res.status(400).json({ message: 'OTP not Created for this Email' });

        if (otpRecord.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
        if (otpRecord.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });

        // Clean OTP record
        await OTP.deleteOne({ email });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Assign role
        const adminEmail = process.env.ADMIN_MAIL;
        const employeeEmail = process.env.EMP_MAIL;
        const role =
            email === adminEmail ? 'admin' :
                email === employeeEmail ? 'employee' : 'user';

        // Save user
        const user = await Register.create({
            name,
            email,
            username,
            password: hashedPassword,
            role,
        });

        // Send token response
        sendToken(user, 201, res);
    } catch (error) {
        // console.error('Error in verifyOtpAndRegister:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
