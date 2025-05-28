// Recordatorios de notas 

const mongoose = require('mongoose')

const notaSchema = new mongoose.Schema({
    titulo:{
        type: String,
        required: true
    },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
})

const NotasModel = mongoose.model('Nota', notaSchema);
module.exports = NotasModel