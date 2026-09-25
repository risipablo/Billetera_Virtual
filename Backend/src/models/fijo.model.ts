import mongoose, { Model, Schema } from "mongoose";
import { IFijo } from "../types/fijo.type";

const FijoSchema = new Schema<IFijo>({
  dia: {
    type: Number,
    required: true,
    min: 1,
    max: 31
  },
  nombre: {
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
  estado: {
    type: String,
    required: true,
    enum: ['activo', 'pagado', 'vencido'],
    default: 'activo'
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

export const FijoModel: Model<IFijo> = mongoose.model<IFijo>('Fijo', FijoSchema);