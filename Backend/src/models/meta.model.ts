import mongoose, { Model, Schema } from "mongoose";
import { IAporte, IMeta } from "../types/meta.type";

const AporteSchema = new Schema<IAporte>({
  monto: {
    type: Number,
    required: true,
    min: 0
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  nota: {
    type: String,
    trim: true,
    maxlength: 200
  }
}, {
  _id: true
});

const MetaSchema = new Schema<IMeta>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: 300
  },
  montoObjetivo: {
    type: Number,
    required: true,
    min: 1
  },
  fecha: {
    type: Date,
    required: true
  },
  categoria: {
    type: String,
    required: true,
    trim: true
  },
  estado: {
    type: String,
    enum: ['activa', 'completada', 'pausada', 'cancelada'],
    default: 'activa'
  },
  aportes: [AporteSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

MetaSchema.virtual('montoActual').get(function (this: IMeta) {
  return this.aportes.reduce((sum, a) => sum + a.monto, 0);
});

MetaSchema.virtual('progreso').get(function (this: IMeta) {
  if (!this.montoObjetivo) return 0;
  return Math.min(100, (this.montoActual / this.montoObjetivo) * 100);
});

export const MetaModel: Model<IMeta> = mongoose.model<IMeta>('Meta', MetaSchema);