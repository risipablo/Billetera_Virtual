const mongoose = require('mongoose');

const AporteSchema = new mongoose.Schema({
    monto: { type: Number, required: true, min: 0 },
    fecha: { type: Date, default: Date.now },
    nota: { type: String, trim: true, maxlength: 200 }
}, { _id: true });

const MetaSchema = new mongoose.Schema({
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
}, { timestamps: true });

MetaSchema.virtual('montoActual').get(function () {
    return this.aportes.reduce((sum, a) => sum + a.monto, 0);
});

MetaSchema.virtual('progreso').get(function () {
    if (!this.montoObjetivo) return 0;
    return Math.min(100, (this.montoActual / this.montoObjetivo) * 100);
});

MetaSchema.set('toJSON', { virtuals: true });
MetaSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Meta', MetaSchema);