import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = env.MONGODB;

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
    console.log(`Base de datos: ${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('Error de MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB desconectado');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB conexión cerrada por terminación de la app');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};