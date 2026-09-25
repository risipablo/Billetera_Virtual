import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model';
import { IJwtPayload } from '../types/index.types';

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ error: 'No autorizado. Token no proporcionado.' });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as IJwtPayload;

    const user = await UserModel.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({ error: 'Usuario no encontrado.' });
      return;
    }

    if (decoded.tokenVersion !== user.tokenVersion) {
      res.status(401).json({ error: 'Sesión cerrada. Volvé a iniciar sesión.' });
      return;
    }

    req.user = user;  
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token no válido. Acceso denegado.' });
  }
};