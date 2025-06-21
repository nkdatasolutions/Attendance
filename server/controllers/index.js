const { getAuthData, getUserNameByEmail, registerUser, signinUser, updateUserProfile, checkUserExistence, initiateRegistration, tempRegisterUser } = require('./global/Authentication');
const { postContact, getContact, getContactByEmail, updateContact, deleteContact } = require('./global/Contact');
const { sendOtpToEmail, verifyOtp, verifyOtpAndRegister, verifyHashedOtp } = require('./global/OTP');
const { postEnrollment, getEnrollment, getEnrollmentByEmail, deleteEnrollment, updateEnrollment } = require('./user/Enrollment');

module.exports = { 
    getAuthData,
    getUserNameByEmail,
    registerUser,
    signinUser,
    updateUserProfile,
    checkUserExistence, initiateRegistration, tempRegisterUser,

    postContact, getContact, getContactByEmail, updateContact, deleteContact,

    postEnrollment, getEnrollment, getEnrollmentByEmail, deleteEnrollment, updateEnrollment,

    sendOtpToEmail, verifyOtp, verifyOtpAndRegister, verifyHashedOtp,
};