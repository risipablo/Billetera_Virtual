import mongoose, { Model, Schema } from "mongoose";
import { IGasto } from "../types/gastos.type";

const GastosSchema = new Schema<IGasto>({
  fecha: {
    type: String,
    required: true
  },
  producto: {
    type: String,
    required: true,
    trim: true
  },
  monto: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  metodo: {
    type: String,
    required: true,
    trim: true
  },
  condicion: {
    type: String,
    required: true,
    trim: true
  },
  estado: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

export const GastosModel: Model<IGasto> = mongoose.model<IGasto>('Gasto', GastosSchema);