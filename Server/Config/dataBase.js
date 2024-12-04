
const mongoose = require('mongoose')
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("Conexión exitosa con MongoDB");
    } catch (err) {
        console.error("Conexión fallida: " + err);
    }
};

module.exports = connectDB;
