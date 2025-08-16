
const GastosModel = require('../Models/Gastos');

exports.getGastos = async (req, res) => {
    try {
        const gastos = await GastosModel.find({ userId: req.user.id }); 
        res.json(gastos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addGasto = async (req, res) => {
    const { dia, mes, año, producto, metodo, condicion, necesario, monto } = req.body;

    if (!dia || !mes || !año ||!producto || !metodo || !condicion || !necesario || !monto) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const newGasto = new GastosModel({
            dia,
            mes,
            año,
            producto,
            metodo,
            condicion,
            necesario,
            monto,
            userId: req.user.id 
        });

        const result = await newGasto.save();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteGasto = async (req, res) => {
    const { id } = req.params;

    try {
        const gasto = await GastosModel.findOneAndDelete({ _id: id, userId: req.user.id }); 

        if (!gasto) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }

        res.json(gasto);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editGasto = async (req, res) => {
    const { id } = req.params;
    const { dia, mes,año, producto, metodo, condicion, monto, necesario } = req.body;

    try {
        const gasto = await GastosModel.findOneAndUpdate(
            { _id: id, userId: req.user.id }, 
            { dia, mes,año, producto, metodo, condicion, monto,necesario },
            { new: true }
        );

        if (!gasto) {
            return res.status(404).json({ error: 'Gasto no encontrado' });
        }

        res.json(gasto);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
