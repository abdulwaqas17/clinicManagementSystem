let express = require('express');
let app = express();
require('dotenv').config();
let connectDB = require('./config/db');
let authRoutes = require('./routes/auth.routes');
let userRoutes = require('./routes/user.routes');
let dashboardRoutes = require('./routes/dashboard.routes');
let roomRoutes = require('./routes/room.routes');
let appointmentRoutes = require('./routes/appointment.routes');

let cors = require('cors'); 

app.use(express.json()); 


// const corsOptions = {
//   origin: 'http://localhost:3000'
// };

app.use(cors());

// to connect mongo db
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> console.log('server is running on port',PORT));