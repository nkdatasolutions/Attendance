const { Register, OTP, TempUser } = require('./../../models');
const bcrypt = require('bcryptjs'); // For password hashing and comparison
const { sendOtpEmail, sendToken } = require('../../utils');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { name, email, phoneNo, username, password } = req.body;

        // Validate required fields
        if (!name || !email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if email exists
        const emailExists = await Register.findOne({ email });
        if (emailExists) {
            return res.status(409).json({ message: 'Email is already registered' });
        }

        // Check if username exists
        const usernameExists = await Register.findOne({ username });
        if (usernameExists) {
            return res.status(409).json({ message: 'Username is already taken' });
        }

        // Check if phone number exists
        // const phoneExists = await Register.findOne({ phoneNo });
        // if (phoneExists) {
        //     return res.status(409).json({ message: 'Phone number is already registered' });
        // }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Assign role based on email
        const adminEmail = process.env.ADMIN_MAIL;
        const employeeEmail = process.env.EMP_MAIL;
        const role =
            email === adminEmail
                ? 'admin'
                : email === employeeEmail
                    ? 'employee'
                    : 'user';

        // Create new user
        const user = await Register.create({
            name,
            email,
            phoneNo,
            username,
            password: hashedPassword,
            role,
        });

        // Send token response
        sendToken(user, 201, res);
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message,
        });
    }
};

exports.tempRegisterUser = async (req, res) => {
    try {
        const { name, email, username, phoneNo, password } = req.body;

        if (!name || !email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check for duplicates in TempUser or Register
        const emailExists = await TempUser.findOne({ email }) || await Register.findOne({ email });
        const usernameExists = await TempUser.findOne({ username }) || await Register.findOne({ username });

        if (emailExists) return res.status(409).json({ message: 'Email already registered' });
        if (usernameExists) return res.status(409).json({ message: 'Username already taken' });

        // Assign role
        const role =
            email === process.env.ADMIN_MAIL ? 'admin' :
                email === process.env.EMP_MAIL ? 'employee' : 'user';

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);

        // Set expiry to 10 minutes
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Save hashed OTP in DB
        await OTP.findOneAndUpdate(
            { email },
            { otp: hashedOtp, expiresAt },
            { upsert: true, new: true }
        );

        // ✅ Send plain OTP (not hashed) to user's email
        await sendOtpEmail(email, otp);  // just use the original otp here

        const hashedPassword = await bcrypt.hash(password, 10);

        // Save to TempUser
        await TempUser.create({ name, email, username, password: hashedPassword, role });

        res.status(201).json({ message: "Registered temporarily. Please verify OTP.", userData: { name, email, username } });
    } catch (err) {
        console.error("Temp Register Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAuthData = async (req, res) => {
    const { email } = req.params;
    try {
        const user = await Register.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const { img } = req.body;

        if (!img) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const updateIMG = await Register.findOneAndUpdate(
            { email },
            { $set: { img } }, // Use $set to specifically update the img field
            { new: true, runValidators: true }
        );

        if (!updateIMG) {
            return res.status(404).json({ message: 'image not found' });
        }

        res.status(200).json({ message: 'image updated successfully', updateIMG });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Register a new user

// Check if user exists (Login)
exports.signinUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Try finding user by username or email
        const user = await Register.findOne({
            $or: [{ username }, { email: username }],
        }).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Incoming password:', password);
        console.log('Stored hashed password:', user.password);

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        sendToken(user, 200, res);
    } catch (error) {
        console.error('Error in signinUser:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.getUserNameByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        // Find the user by email
        const user = await Register.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user's name
        res.status(200).json({ name: user.name });
    } catch (error) {
        console.error('Error in getUserNameByEmail:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.checkUserExistence = async (req, res) => {
    try {
        const { identifier } = req.body; // identifier can be email or username

        // Find by email OR username
        const user = await Register.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });

        if (user) {
            return res.status(200).json({
                exists: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                }
            });
        } else {
            return res.status(404).json({ exists: false, message: "User not found" });
        }
    } catch (error) {
        console.error('Error in checkUserExistence:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.initiateRegistration = async (req, res) => {
    const { name, email, phoneNo, username, password } = req.body;

    try {
        if (!name || !email || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check email & username
        const emailExists = await Register.findOne({ email });
        if (emailExists) return res.status(409).json({ message: 'Email is already registered' });

        const usernameExists = await Register.findOne({ username });
        if (usernameExists) return res.status(409).json({ message: 'Username is already taken' });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Save OTP
        await OTP.findOneAndUpdate(
            { email },
            { otp, expiresAt },
            { upsert: true, new: true }
        );

        // Send OTP
        await sendOtpEmail(email, otp);

        res.status(200).json({
            message: 'OTP sent to email. Please verify to complete registration.',
            userData: { name, email, phoneNo, username, password } // frontend will use this
        });
    } catch (error) {
        console.error('Error in initiateRegistration:', error);
        res.status(500).json({ message: 'Failed to initiate registration' });
    }
};
