const moongose = require('mongoose')

const noteSchema = new moongose.Schema({
    titulo:{
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },  
    // fecha: {
    //     type: Date,
    //     required: true
    // },
    userId: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const NoteModel = moongose.model('Note', noteSchema);
module.exports = NoteModel