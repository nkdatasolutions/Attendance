const express = require('express');
const globalRouter = express.Router();

const { registerUser, getAuthData, updateUserProfile, signinUser, postContact, getContact, getContactByEmail, deleteContact, updateContact, sendOtpToEmail, verifyOtp, checkUserExistence, verifyOtpAndRegister, initiateRegistration, tempRegisterUser, verifyHashedOtp, getCounter, incrementCounter, updateCounter, deleteCounter, updateSeqBySeq } = require('../controllers');
const { registerRequest, signinRequest, ContactRequest } = require('../middlewares');

// Counter routes
globalRouter.get('/counter/get', getCounter);
// globalRouter.post('/counter/inc/:id/', incrementCounter);
globalRouter.put('/:id', updateCounter);
globalRouter.put('/counter/update/:seq', updateSeqBySeq);
globalRouter.delete('/:id', deleteCounter);

// Registration route
globalRouter.post('/register', registerRequest, registerUser);
// globalRouter.post('/register', registerRequest, tempRegisterUser);
globalRouter.post('/register-with-otp', registerRequest, initiateRegistration);
globalRouter.post('/identifier', checkUserExistence); 
globalRouter.get('/register/data/:email', getAuthData);
globalRouter.put('/register/update/:email', updateUserProfile);

// Sign-in route
globalRouter.post('/signin', signinRequest, signinUser);

// OTP routes
globalRouter.post('/send-otp', sendOtpToEmail);
globalRouter.post('/verify-otp', verifyOtp);
globalRouter.post('/verify-hashedotp', verifyHashedOtp);
globalRouter.post('/verify-otp-and-register', verifyOtpAndRegister);

// Contact routes
globalRouter.post('/contact', ContactRequest, postContact);
globalRouter.get('/contact/all', getContact ); // Assuming you want to get all contacts
globalRouter.get('/contact/one/:email', getContactByEmail ); // Assuming you want to get all contacts
globalRouter.delete('/contact/one/:id', deleteContact ); // Assuming you want to get all contacts
globalRouter.put('/contact/update/:id', updateContact ); // Assuming you want to get all contacts

module.exports = globalRouter;