const GastosModel = require('../Models/Gastos');

exports.getGastos = async (req, res) => {
    try {
        const gastos = await GastosModel.find();
        res.json(gastos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addGasto = async (req, res) => {
    const { dia, mes, producto, metodo, condicion, monto } = req.body;
    if (!dia || !mes || !producto || !metodo || !condicion || !monto) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const newGasto = new GastosModel({ dia, mes, producto, metodo, condicion, monto });
        const result = await newGasto.save();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteGasto = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await GastosModel.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editGasto = async (req, res) => {
    const { id } = req.params;
    const { dia, mes, producto, metodo, condicion, monto } = req.body;
    try {
        const result = await GastosModel.findByIdAndUpdate(id, { dia, mes, producto, metodo, condicion, monto }, { new: true });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
