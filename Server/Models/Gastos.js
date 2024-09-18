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

    producto:{
        type:String,
        required:true
    },

    metodo:{
        type:String,
        required:true
    }, // Metodo de pago

    condicion:{
        type:String,
        required:true
    }, // Si entra este mes o en el proximo mes

    monto:{
        type: Number,
        required: true
    },
})

const GastosModel = mongoose.model('Gastos', gastosSchema);
module.exports = GastosModel