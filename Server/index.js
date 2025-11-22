
const express = require('express');
const connectDB = require('./config/dataBase');
const cors = require('cors'); 
const gastoRoutes = require('./Routes/gastosRoutes');
const notaRoutes = require('./Routes/notaRoutes');
const noteRoutes = require('./Routes/noteRoutes')
const authRoutes = require('./Routes/authRoutes');
const listRoutes = require('./Routes/listRoutes');
const tokenValidate = require('./Routes/validateRoutes')
const errorHandler = require('./Middleware/gastosMiddleware');
const cookieParser = require('cookie-parser')
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());


const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5176', 'http://localhost:5175', 'https://billetera-virtual-nine.vercel.app', 'https://billetera-virtual-1.onrender.com'],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,DELETE,PUT,PATCH',
    credentials: true,
    // allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));

connectDB();

app.use('/api', gastoRoutes);
app.use('/api', notaRoutes);
app.use('/api', noteRoutes);
app.use('/api', listRoutes);
app.use('/api/auth', tokenValidate)
app.use('/api/auth', authRoutes);
app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server corriendo en el puerto ${port}`);
});