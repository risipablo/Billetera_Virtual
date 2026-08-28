
const FijoModel = require('../models/Fijo')

exports.getFijo = async(req,res) => {
    try{
        const fijo = await FijoModel.find({userId:req.user.id})
        res.json(fijo)
    } catch (err){
        res.status(500).json({error: err.message})
    }
}

exports.addFijo = async (req, res) => {
    const { dia, nombre, monto, categoria, estado } = req.body;

   
    if (!dia  || !nombre || monto === undefined || !categoria || !estado) {
        return res.status(400).json({ 
            messages: 'Completar todos los campos requeridos' 
        });
    }
   
    if (dia < 1 || dia > 31) {
        return res.status(400).json({ 
            messages: 'El día debe estar entre 1 y 31' 
        });
    }


    try {
        const newFijo = new FijoModel({
            dia,
            nombre,
            monto,
            categoria,
            estado,
            userId: req.user.id
        });

        const result = await newFijo.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editFijo = async (req, res) => {
    const { id } = req.params;
    const { dia, nombre, monto, categoria, estado } = req.body;

    try {
        const fijo = await FijoModel.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { dia, nombre, monto, categoria, estado },
            { new: true }
        );

        if (!fijo) {
            return res.status(404).json({ error: 'Gasto fijo no encontrado' });
        }

        res.json(fijo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteFijo = async (req, res) => {
    const { id } = req.params;

    try {
        const fijo = await FijoModel.findOneAndDelete({ _id: id, userId: req.user.id }); 

        if (!fijo) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }

        res.json(fijo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteAllFijo = async(req,res) => {
    try{
        const result = await FijoModel.deleteMany({userId:req.user.id})
        res.json(result)
    } catch(err){
        res.status(500).json({error:err.message})
    }
}