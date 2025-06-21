const { sendOtpEmail } = require('./MailHelper');
const { sendToken } = require('./jwtHelper')

module.exports = {
    sendOtpEmail, sendToken,
};