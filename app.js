const express = require('express');
const morgan = require('morgan');
const { protect } = require('./middlewares/protect');
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const recordRoute = require('./routes/recordRoute')
const multer = require('multer')
const path = require('path')
const cors = require('cors')
const roomRoute = require('./routes/roomRoute')
const messageRoute = require('./routes/messageRoute');
const { globalErrroHandler } = require('./controllers/errorController');
const verifyPhotoRoute = require('./routes/verifyPhotoRoute')
const realtimeCompareRoute = require('./routes/realtimecompareRoute')
const app = express();


app.use(cors({
  origin: "*", // Allow all origins
  methods: ["GET", "POST"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type"], // Optional: custom headers
  credentials: true, // Optional: allow cookies or authorization headers
}));

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/room', roomRoute)
app.use('/api/messages', messageRoute);

app.use('/api/auth', authRoute);


app.use('/api/records', recordRoute)


app.use('/api/users', userRoute)


app.use('/api/users/verify/photo', verifyPhotoRoute)

app.use('/api/realtime/compare', realtimeCompareRoute)

// app.use('/chat', protect, (req, res, next)=>{
//     res.status(200).json(
// {        message: "middleware testing success"
// }    )
// })


app.use(globalErrroHandler)


module.exports = app;   