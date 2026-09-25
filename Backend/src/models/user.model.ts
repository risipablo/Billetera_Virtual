import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  tokenVersion: number;
  sessionVersion: number;
  role: 'admin' | 'user';
  isGoogleUser: boolean;
  avatarUrl?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLoginAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generatePasswordResetToken(): string;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres']
  },
  password: {
    type: String,
    required: function(this: IUser) {
      return !this.isGoogleUser;
    },
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    validate: {
      validator: function(this: IUser, value: string) {
        if (this.isGoogleUser) return true;
        return /[A-Z]/.test(value);
      },
      message: 'La contraseña debe contener al menos una letra mayúscula'
    }
  },
  tokenVersion: {
    type: Number,
    default: 0
  },
  sessionVersion: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  isGoogleUser: {
    type: Boolean,
    default: false
  },
  avatarUrl: {
    type: String
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLoginAt: Date
}, {
  timestamps: true
});

UserSchema.pre<IUser>('save', async function() {
  if (this.isGoogleUser) {
    return;
  }

  if (!this.isModified('password') || !this.password) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

UserSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generatePasswordResetToken = function(): string {
  const token = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = token;
  this.resetPasswordExpires = new Date(Date.now() + 3600000);
  return token;
};

export const UserModel: Model<IUser> = mongoose.model<IUser>('User', UserSchema);