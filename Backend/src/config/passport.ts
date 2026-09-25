import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { IUser, UserModel } from '../models/user.model';
import { IJwtPayload } from '../types/index.types';

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ): Promise<void> => {
      console.log('Perfil de Google recibido:', profile.emails?.[0]?.value);

      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const avatarUrl = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        let user = await UserModel.findOne({ email });

        if (!user) {
          user = new UserModel({
            email,
            name,
            avatarUrl,
            isGoogleUser: true
          });
          await user.save();
        } else {
          if (!user.avatarUrl && avatarUrl) {
            user.avatarUrl = avatarUrl;
            await user.save();
          }
        }

        return done(null, user);
      } catch (error) {
        console.error('Error en estrategia de Google:', error);
        return done(error as Error, undefined);
      }
    }
  )
);

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (
      email: string,
      password: string,
      done: (error: unknown, user?: IUser | false, info?: { message: string }) => void
    ): Promise<void> => {
      try {
        const user = await UserModel.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'Credenciales inválidas' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

const jwtOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string
};

passport.use(
  'jwt',
  new JwtStrategy(
    jwtOptions,
    async (payload: IJwtPayload, done): Promise<void> => {
      try {
        const user = await UserModel.findById(payload.id).select('-password');

        if (user) {
          return done(null, user);
        }

        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export const authGuard = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error | null, user: IUser | false | null) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        res.status(401).json({ error: 'No autorizado. Token inválido o expirado' });
        return;
      }

      req.user = user;  
      next();
    }
  )(req, res, next);
};
export { passport };