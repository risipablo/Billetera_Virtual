import { Document, Types } from "mongoose";

export interface IAporte extends Document {
  monto: number;
  fecha: Date;
  nota?: string;
}

export interface IMeta extends Document {
  userId: Types.ObjectId;
  nombre: string;
  descripcion?: string;
  montoObjetivo: number;
  fecha: Date;
  categoria: string;
  estado: 'activa' | 'completada' | 'pausada' | 'cancelada';
  aportes: Types.DocumentArray<IAporte>;
  createdAt: Date;
  updatedAt: Date;
  montoActual: number;
  progreso: number;
}
