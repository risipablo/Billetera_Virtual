
const mongoose = require('mongoose')

const gastosSchema = new mongoose.Schema({
    fecha:{
           type: String,  
        required: true
    },

    producto:{
        type:String,
        required:true
    },

    monto:{
        type: Number,
        required: true
    },

    categoria:{
        type:String,
        required: true
    },

    
    metodo:{
        type:String,
        required:true
    }, 

    
    condicion:{
        type:String,
        required:true
    }, 
    
    
    estado:{
        type:String,
        required:true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const GastosModel = mongoose.model('Gasto', gastosSchema);
module.exports = GastosModel