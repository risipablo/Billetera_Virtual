const { text } = require('body-parser')
const mongose = require('mongoose')

const listSchema = new mongose.Schema({
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
     completed: {
        type: Boolean,
        default: false,
    },
    userId: {
        type: mongose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    }
})

const ListModel = mongose.model('List', listSchema)
module.exports = ListModel