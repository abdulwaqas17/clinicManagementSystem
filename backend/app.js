let express = require('express');
let app = express();

require('dotenv').config();

let connectDB = require('./config/db');

let authRoutes = require('./routes/auth.routes');
let userRoutes = require('./routes/user.routes');
let dashboardRoutes = require('./routes/dashboard.routes');
let roomRoutes = require('./routes/room.routes');
let appointmentRoutes = require('./routes/appointment.routes');
let caseHistoryRoutes = require('./routes/caseHistory.routes');

let cors = require('cors');

app.use(express.json());

app.use(cors());


// MongoDB connection
connectDB();


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/case-history', caseHistoryRoutes);


// REMOVE THIS ❌
// app.listen(PORT)


// EXPORT APP ✅
module.exports = app;