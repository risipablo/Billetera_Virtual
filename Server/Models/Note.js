// Seccion de notas


const moongose = require('mongoose')

const noteSchema = new moongose.Schema({
    titulo:{
        type: String,
        required: true
    },

    cuotas:{
        type: String,
        required: true
    },
      
    descripcion:{
        type: [String],
        required: true
    },  
    precio:{
        type: [Number],
        required: true
    },
      
    fecha: {
        type: [Date],
        required: true,
        default: []
    },
    completed: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const NoteModel = moongose.model('Note', noteSchema);
module.exports = NoteModel