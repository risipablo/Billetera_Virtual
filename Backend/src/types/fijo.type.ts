import { Document, Types } from "mongoose";

export interface IFijo extends Document {
  dia: number;
  nombre: string;
  monto: number;
  categoria: string;
  estado: 'activo' | 'pagado' | 'vencido';
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}