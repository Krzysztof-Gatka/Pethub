const express = require('express')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3000
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/authRoutes')
const testRoutes = require('./routes/testRoutes')
const animalRoutes = require('./routes/animalRoutes')
const dotenv = require('dotenv').config()
const {connectDB} = require('./config/db')
const followRoutes = require('./routes/followRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const walkRoutes = require('./routes/walkRoutes')
const profileRoutes = require('./routes/profileRoutes')
const shelterRoutes = require('./routes/shelterRoutes')
const adoptionRoutes = require('./routes/adoptionRoutes');

app.use(cookieParser());
app.use(morgan('dev'))
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true, // Allow cookies to be sent
}))
app.use(bodyParser.json())

app.use(express.json());

app.use('/api/profiles', profileRoutes);

connectDB();

app.use('/auth', authRoutes)
app.use('/test', testRoutes)

app.use('/api/animals', animalRoutes)
app.use('/api/follows', followRoutes);
app.use('/api/walks', walkRoutes)
app.use('/api/notifications', notificationRoutes);
app.use('/api/profiles', profileRoutes)
app.use('/api/shelter', shelterRoutes);
app.use('/api', shelterRoutes);
app.use('/api/adoptions', adoptionRoutes);



app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});