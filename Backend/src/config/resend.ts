import { Resend } from 'resend';
import { env } from './env';

const apiKey = env.RESEND_API_KEY;

if (!apiKey && env.NODE_ENV) {
  console.log('Resend en modo desarrollo - Los emails se simularán en consola');
}

export const resend = new Resend(apiKey);