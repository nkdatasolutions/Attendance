const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRouter = require('./routes/userRoutes');
// const adminRouter = require('./routes/adminRoutes');
const cors = require('cors');
const globalRouter = require('./routes/globalRoutes');
const adminRouter = require('./routes/adminRoutes');
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware to handle multipart/form-data
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use('/api/users', userRouter);
app.use('/api/public', globalRouter);
app.use('/api/admin', adminRouter);


// Serve static files from the React app
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 