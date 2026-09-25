import { Document, Types } from "mongoose";

export interface IGasto extends Document {
  fecha: string;
  producto: string;
  monto: number;
  categoria: string;
  metodo: string;
  condicion: string;
  estado: string;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  dia?: string;
  mes?: string;
  año?: string;
}