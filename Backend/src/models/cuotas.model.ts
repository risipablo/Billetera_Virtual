import mongoose, { Schema, Model } from 'mongoose';
import { ICuota } from '../types/cuotas.type';



const CuotaSchema = new Schema<ICuota>({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  cuotas: {
    type: Number,
    required: true,
    min: 1
  },
  montoTotal: {
    type: Number,
    required: true,
    min: 0
  },
  fechaCompra: {
    type: Date,
    required: true
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: [String],
    default: []
  },
  precio: {
    type: [Number],
    default: []
  },
  fecha: {
    type: [Date],
    default: []
  },
  fechaPrimeraCuota: {
    type: String,
    required: true
  },
  completedItems: {
    type: [Boolean],
    default: []
  },
  completed: {
    type: Boolean,
    default: false
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

export const CuotaModel: Model<ICuota> = mongoose.model<ICuota>('Note', CuotaSchema);