import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { IAuthRequest, IChangeNameData, IForgotPasswordData, IJwtPayload, ILoginData, IRegisterData, IResetPasswordData, IResetPasswordTokenData, IVerifyEmailData } from '../types/index.types';
import { UserModel } from '../models/user.model';


const generateToken = (user: {
  _id: unknown;
  role: string;
  name?: string;
  tokenVersion: number;
}): string => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name,
      tokenVersion: user.tokenVersion
    },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );
};

export const registerUser = async (
  req: Request<{}, {}, IRegisterData>,
  res: Response
): Promise<void> => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ error: 'Todos los campos son obligatorios' });
    return;
  }

  try {
    const userExists = await UserModel.findOne({ email });
    const nameExists = await UserModel.findOne({ name });

    if (userExists) {
      res.status(400).json({ error: 'El email ya está registrado' });
      return;
    }

    if (nameExists) {
      res.status(400).json({ error: 'El nombre ya está registrado' });
      return;
    }

    const newUser = new UserModel({ email, password, name });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const loginUser = async (
  req: Request<{}, {}, ILoginData>,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Todos los campos son obligatorios' });
    return;
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: 'Credenciales incorrectas' });
      return;
    }

    const token = generateToken({
      _id: user._id,
      role: user.role,
      tokenVersion: user.tokenVersion
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor: ' + (err as Error).message });
  }
};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as IJwtPayload;

      await UserModel.findByIdAndUpdate(decoded.id, {
        $inc: { tokenVersion: 1 }
      });
    }
  } catch (err) {
    // Token inválido nos pai el login
  }

  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/'
  });

  res.json({ message: 'Cierre de sesión exitoso' });
};

export const verifyEmail = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  const { email } = req.body as IVerifyEmailData;

  try {
    const user = await UserModel.findOne({ email, _id: req.user?._id });

    if (!user) {
      res.status(404).json({ message: 'Incorrect Email' });
      return;
    }

    res.status(200).json({ message: 'Verified Email', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error in the server' });
  }
};

export const changeUserName = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  const { newName } = req.body as IChangeNameData;
  const userId = req.user?._id;

  if (!newName) {
    res.status(400).json({ error: 'El nuevo nombre es requerido.' });
    return;
  }

  if (newName.length < 3) {
    res.status(400).json({ error: 'El nombre debe tener al menos 3 caracteres.' });
    return;
  }

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    const nameExists = await UserModel.findOne({
      name: newName,
      _id: { $ne: userId }
    });

    if (nameExists) {
      res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
      return;
    }

    user.name = newName;
    await user.save();

    const token = generateToken({
      _id: user._id,
      role: user.role,
      name: user.name,
      tokenVersion: user.tokenVersion
    });

    res.status(200).json({
      message: 'Nombre de usuario actualizado exitosamente',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const changePassword = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  const { currentPassword, newPassword } = req.body as IResetPasswordData;
  const userId = req.user?._id;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'both password are required' });
    return;
  }

  if (newPassword.length < 9) {
    res.status(400).json({ error: 'The new password must have equal o more 9 letters' });
    return;
  }

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'user not found' });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      res.status(401).json({ error: 'Password incorrect' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfull' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const forgotPassword = async (
  req: Request<{}, {}, IForgotPasswordData>,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 360000);
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    console.log(`Enlace de restablecimiento: ${resetLink}`);

    res.json({ message: 'Correo de restablecimiento enviado' });
  } catch (error) {
    res.status(500).json({
      message: 'error del servidor',
      error: (error as Error).message
    });
  }
};

export const resetPassword = async (
  req: Request<{}, {}, IResetPasswordTokenData>,
  res: Response
): Promise<void> => {
  const { token, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400).json({ message: 'Token inválido o expirado' });
      return;
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({
      message: 'Error del servidor',
      error: (error as Error).message
    });
  }
};

export const userName = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  try {
    const user = await UserModel.findById(req.user?._id).select('name email');

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const validateToken = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  res.status(200).json({
    valid: true,
    user: {
      id: req.user?._id,
      name: req.user?.name,
      email: req.user?.email
    }
  });
};

export const deleteAccount = async (
  req: IAuthRequest,
  res: Response
): Promise<void> => {
  const userId = req.user?._id;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    await UserModel.findByIdAndDelete(userId);

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/'
    });

    res.status(200).json({ message: 'Cuenta eliminada exitosamente' });
  } catch (err) {
    console.error('Error al eliminar cuenta:', err);
    res.status(500).json({ error: (err as Error).message });
  }
};