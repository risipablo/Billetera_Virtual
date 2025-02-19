const NotaModel = require('../Models/Notas')

exports.getNotas = async (req, res) => {
    try {
        const notas = await NotaModel.find({ userId: req.user.id }); 
        res.json(notas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.addNota = async (req, res) => { 
    const {titulo} = req.body;
    if (!titulo) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    try{
        const newNota = new NotaModel({
            titulo,
            userId: req.user.id
        });
        const result = await newNota.save();
        res.json(result);
    } catch(err){
        res.status(500).json({ error: err.message });
    }   
}

exports.deleteNota = async (req, res) => {
    const { id } = req.params;
    try {
        const nota = await NotaModel.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!nota) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }
        res.json(nota);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.editNota = async (req, res) => {
    const { id } = req.params;
    const { titulo } = req.body;
    try {
        const nota = await NotaModel.findOneAndUpdate({ _id: id, userId: req.user.id }, { titulo
        }, { new: true });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}