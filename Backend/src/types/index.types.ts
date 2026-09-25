import { Request } from 'express';
import { IUser } from '../models/user.model';


export interface IRegisterData {
  email: string;
  password: string;
  name: string;
}

export interface ILoginData {
  email: string;
  password: string;
}

export interface IResetPasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface IVerifyEmailData {
  email: string;
}

export interface IForgotPasswordData {
  email: string;
}

export interface IResetPasswordTokenData {
  token: string;
  newPassword: string;
}

export interface IChangeNameData {
  newName: string;
}

export interface IAuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
}

export interface IAuthRequest extends Request {
  user?: IUser;
}

export interface IApiError {
  error: string;
  status?: number;
}

export interface IGoogleProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string }>;
  photos: Array<{ value: string }>;
}

export interface IJwtPayload {
  id: string;
  role: string;
  name?: string;
  tokenVersion: number;
}