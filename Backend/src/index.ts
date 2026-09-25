import app from './app';
import { connectDB } from './config/dataBase';
import { env } from './config/env';

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    app.set('trust proxy', 1);

    const server = app.listen(env.PORT, () => {
      console.log('');
      console.log('════════════════════════════════════════');
      console.log(`Servidor corriendo en puerto ${env.PORT}`);
      console.log(`Entorno: ${env.NODE_ENV}`);
      console.log(`URL: http://localhost:${env.PORT}`);
      console.log(`Health: http://localhost:${env.PORT}/health`);
      console.log('════════════════════════════════════════');
      console.log('');
    });

    const gracefulShutdown = (signal: string): void => {
      console.log(`\n${signal} recibido. Cerrando servidor...`);

      server.close(() => {
        console.log('Servidor cerrado correctamente');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('Forzando cierre del servidor');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason: Error) => {
      console.error('Unhandled Rejection:', reason);
      server.close(() => process.exit(1));
    });

    process.on('uncaughtException', (error: Error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('Error iniciando el servidor:', error);
    process.exit(1);
  }
};

startServer();