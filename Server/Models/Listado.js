const { text } = require('body-parser')
const moongose = require('mongoose')

const listSchema = new moongose.Schema({
    titulo:{
        type:String,
        required: true
    },
    fecha:{
        type:Date,
        required: true
    },
    // colocar el completed dentro de las descripciones para que marquen una por una
    descripcion:{
        type: [{
            text:String,
            completed: {type: Boolean, default:false}
        }],
        required:true
    },
    userId: {
        type: moongose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
})

const ListModel = moongose.model('List', listSchema)
module.exports = ListModel