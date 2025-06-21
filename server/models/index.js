const Register = require('./global/Authentication');
const Contact = require('./global/Contact');
const OTP = require('./global/OTP');
const Enrollment = require('./user/Enrollment');
const TempUser = require('./global/TempUser');

module.exports = {
    Register, Contact, OTP, TempUser,
    
    Enrollment,
}