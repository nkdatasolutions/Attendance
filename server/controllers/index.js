const { getAuthData, getUserNameByEmail, registerUser, signinUser, updateUserProfile, checkUserExistence, initiateRegistration, tempRegisterUser } = require('./global/Authentication');
const { postContact, getContact, getContactByEmail, updateContact, deleteContact } = require('./global/Contact');
const { sendOtpToEmail, verifyOtp, verifyOtpAndRegister, verifyHashedOtp } = require('./global/OTP');
const { postEnrollment, getEnrollment, getEnrollmentByEmail, deleteEnrollment, updateEnrollment } = require('./user/Enrollment');

const { getCounter, incrementCounter, updateCounter, deleteCounter, updateSeqBySeq } = require('./admin/Sequence');

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

    getCounter, incrementCounter, updateCounter, deleteCounter, updateSeqBySeq,
};