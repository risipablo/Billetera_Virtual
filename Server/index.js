
const express = require('express');
const connectDB = require('./Config/dataBase');
const cors = require('cors'); 
const gastoRoutes = require('./Routes/gastosRoutes');
const notaRoutes = require('./Routes/notaRoutes');
const authRoutes = require('./Routes/authRoutes')
const errorHandler = require('./Middleware/gastosMiddleware');
const cookieParser = require('cookie-parser')
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cookieParser());


const corsOptions = {
    origin: ['http://localhost:5173', 'https://billetera-virtual-nine.vercel.app','https://billetera-virtual-1.onrender.com' ],
    optionsSuccessStatus: 200,
    methods: 'GET,POST,DELETE,PATCH',
    credentials: true,
};

app.use(cors(corsOptions));

connectDB();

app.use('/api', gastoRoutes);
app.use('/api', notaRoutes);
app.use('/api/auth', authRoutes)
app.use(errorHandler);

app.listen(3001, () => {
    console.log("Servidor corriendo en el puerto 3001");
});
