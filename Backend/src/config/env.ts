import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  MONGODB: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  FRONTEND_URL: string;
  BACKEND_URL: string;
  EMAIL_USER?: string;
  EMAIL_PASS?: string;
  EMAIL_HOST?: string;
  EMAIL_PORT?: number;
  RESEND_API_KEY?: string;
  CLIENT_EMAIL?: string;
  APP_NAME: string;
  FROM_EMAIL: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_CALLBACK_URL?: string;
}

const getEnvVar = (key: string, required: boolean = true): string => {
  const value = process.env[key];

  if (!value && required) {
    throw new Error(`Variable de entorno requerida no encontrada: ${key}`);
  }

  return value || '';
};

export const env: EnvConfig = {
  PORT: parseInt(getEnvVar('PORT', false) || '3001', 10),
  NODE_ENV: (getEnvVar('NODE_ENV', false) || 'development') as EnvConfig['NODE_ENV'],
  MONGODB: getEnvVar('MONGODB'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', false) || '1h',
  FRONTEND_URL: getEnvVar('FRONTEND_URL', false) || 'http://localhost:5173',
  BACKEND_URL: getEnvVar('BACKEND_URL', false) || 'http://localhost:3001',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : undefined,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  CLIENT_EMAIL: process.env.CLIENT_EMAIL,
  APP_NAME: getEnvVar('APP_NAME', false) || 'Billetera Virtual',
  FROM_EMAIL: getEnvVar('FROM_EMAIL', false) || 'serveraplicacion@gmail.com',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL
};