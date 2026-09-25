import { Document, Types } from "mongoose";

export interface ICuota extends Document {
  titulo: string;
  cuotas: number;
  montoTotal: number;
  fechaCompra: Date;
  categoria: string;
  descripcion: string[];
  precio: number[];
  fecha: Date[];
  fechaPrimeraCuota: string;
  completedItems: boolean[];
  completed: boolean;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}