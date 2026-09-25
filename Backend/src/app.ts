import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from '@exortek/express-mongo-sanitize';
import { env } from './config/env';
import './config/passport';
import authRoutes from './routes/auth.routes';
import validateRoutes from './routes/validate.routes';
import gastosRoutes from './routes/gastos.routes';
import fijoGastos from './routes/fijo.routes';
import cuotaRoutes from './routes/cuotas.routes';
import metasRoutes from './routes/meta.routes';
import listadoRoutes from './routes/list.route';
import errorHandler from './middleware/errorMiddleware';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errorHandlers();
  }

  private middlewares(): void {
    this.app.use(helmet({
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' } 
    }));
    this.app.use(mongoSanitize())

    const globalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: env.NODE_ENV === 'production' ? 30 : 1000, 
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: 'Demasiadas solicitudes. Intenta nuevamente más tarde.'
      }
    });

     const authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: (req) => req.path.includes('/google') ? 30 : 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: 'Demasiados intentos de autenticación. Intenta nuevamente más tarde.'
      }
    });

    this.app.use('/api', globalLimiter);
    this.app.use('/api/auth', authLimiter);

    this.app.use(cors({
      origin: [
        'http://localhost:5173',
        'http://localhost:5176',
        'http://localhost:5175',
        'https://billetera-virtual-1.onrender.com',
        'https://billetera-virtual-teal.vercel.app',
        'https://billetera-virtual-nine.vercel.app',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(cookieParser());
    this.app.use(mongoSanitize());

    this.app.use(helmet({
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' }
    }));
  }

  private routes(): void {
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        environment: env.NODE_ENV
      });
    });

    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/auth', validateRoutes);
    this.app.use('/api', gastosRoutes);
    this.app.use('/api', fijoGastos);
    this.app.use('/api', cuotaRoutes);
    this.app.use('/api/metas', metasRoutes);
    this.app.use('/api', listadoRoutes);
  }

  private errorHandlers(): void {
    this.app.use(errorHandler);

    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.path
      });
    });

    this.app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Error:', err.message);
      console.error(err.stack);

      res.status(500).json({
        error: env.NODE_ENV === 'production'
          ? 'Error interno del servidor'
          : err.message
      });
    });
  }
}

export default new App().app;