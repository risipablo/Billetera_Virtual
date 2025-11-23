
const express = require('express');
const connectdb = require("./config/database")
const fs = require('fs');
console.log('🔍 Buscando archivos de base de datos...');
try {
    const files1 = fs.readdirSync('./config');
    console.log('📁 config/:', files1);
} catch (e) {
    console.log('❌ No existe ./config');
}

const cors = require('cors'); 
const gastoRoutes = require('./routes/gastosRoutes');
const notaRoutes = require('./routes/notaRoutes');
const noteRoutes = require('./routes/noteRoutes')
const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes');
const tokenValidate = require('./routes/validateRoutes')
const errorHandler = require('./middleware/gastosMiddleware');
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

connectdb();

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