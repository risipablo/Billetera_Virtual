
const mongoose = require('mongoose')

const gastosSchema = new mongoose.Schema({

    dia:{
        type: String,
        required: true
    },

    mes:{
        type: String,
        required: true
    },

    año:{
        type: String,
        required: true
    },

    producto:{
        type:String,
        required:true
    },
    metodo:{
        type:String,
        required:true
    }, 

    condicion:{
        type:String,
        required:true
    }, 

    monto:{
        type: Number,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const GastosModel = mongoose.model('Gasto', gastosSchema);
module.exports = GastosModel