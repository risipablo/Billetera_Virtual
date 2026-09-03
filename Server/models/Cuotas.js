const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
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
         type: Date
    },
    categoria:{
        type: String,
        required:true
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
        required: true
    }
}, { timestamps: true });

const NoteModel = mongoose.model('Note', noteSchema);
module.exports = NoteModel;