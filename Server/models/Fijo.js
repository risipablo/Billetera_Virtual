
const mongoose = require('mongoose');

const fijoSchema = new mongoose.Schema({
    dia: {
        type: Number, 
        required: true,
        min: 1,
        max: 31
    },
    nombre: {
        type: String,
        required: true
    },
    monto: {
        type: Number,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        required: true,
        enum: ['activo', 'pagado', 'vencido']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Fijo', fijoSchema);