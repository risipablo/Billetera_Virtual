const MetaModel = require('../models/metas');

exports.crearMeta = async (req, res) => {
    try {
        const { nombre, descripcion, montoObjetivo, fecha, categoria } = req.body;
        const userId = req.user.id;

        if (!nombre || !montoObjetivo || !fecha || !categoria) {
            return res.status(400).json({
                error: 'Nombre, monto objetivo, fecha y categoría son obligatorios'
            });
        }

        if (montoObjetivo <= 0) {
            return res.status(400).json({ error: 'El monto objetivo debe ser mayor a 0' });
        }

        const fechaDate = new Date(fecha);
        if (isNaN(fechaDate.getTime())) {
            return res.status(400).json({ error: 'Fecha inválida' });
        }

        const meta = new MetaModel({
            userId,
            nombre,
            descripcion,
            montoObjetivo,
            fecha: fechaDate,
            categoria
        });

        await meta.save();
        res.status(201).json(meta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listarMetas = async (req, res) => {
    try {
        const userId = req.user.id;
        const { estado, categoria } = req.query;

        const filtro = { userId };
        if (estado) filtro.estado = estado;
        if (categoria) filtro.categoria = categoria;

        const metas = await MetaModel.find(filtro).sort({ createdAt: -1 });
        res.status(200).json(metas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.obtenerMeta = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const meta = await MetaModel.findOne({ _id: id, userId });
        if (!meta) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }

        res.status(200).json(meta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editarMeta = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const {
            nombre,
            descripcion,
            montoObjetivo,
            fecha,
            categoria,
            estado
        } = req.body;

        const meta = await MetaModel.findOne({ _id: id, userId });
        if (!meta) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }

        if (nombre !== undefined) meta.nombre = nombre;
        if (descripcion !== undefined) meta.descripcion = descripcion;
        if (categoria !== undefined) meta.categoria = categoria;

        if (montoObjetivo !== undefined) {
            if (montoObjetivo <= 0) {
                return res.status(400).json({ error: 'El monto objetivo debe ser mayor a 0' });
            }
            meta.montoObjetivo = montoObjetivo;
        }

        if (fecha !== undefined) {
            const fechaDate = new Date(fecha);
            if (isNaN(fechaDate.getTime())) {
                return res.status(400).json({ error: 'Fecha inválida' });
            }
            meta.fecha = fechaDate;
        }

        if (estado !== undefined) {
            const estadosValidos = ['activa', 'completada', 'pausada', 'cancelada'];
            if (!estadosValidos.includes(estado)) {
                return res.status(400).json({ error: 'Estado inválido' });
            }
            meta.estado = estado;
        }

        await meta.save();
        res.status(200).json(meta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.eliminarMeta = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const meta = await MetaModel.findOneAndDelete({ _id: id, userId });
        if (!meta) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }

        res.status(200).json({ message: 'Meta eliminada exitosamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.agregarAporte = async (req, res) => {
    try {
        const { id } = req.params;
        const { monto, nota } = req.body;
        const userId = req.user.id;

        if (monto === undefined || monto <= 0) {
            return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
        }

        const meta = await MetaModel.findOne({ _id: id, userId });
        if (!meta) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }

        if (meta.estado === 'completada' || meta.estado === 'cancelada') {
            return res.status(400).json({ error: 'La meta ya está cerrada' });
        }

        meta.aportes.push({ monto, nota });

        const total = meta.aportes.reduce((s, a) => s + a.monto, 0);
        if (total >= meta.montoObjetivo) {
            meta.estado = 'completada';
        } else if (meta.estado === 'pausada') {
            meta.estado = 'activa';
        }

        await meta.save();
        res.status(201).json(meta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.eliminarAporte = async (req, res) => {
    try {
        const { id, aporteId } = req.params;
        const userId = req.user.id;

        const meta = await MetaModel.findOne({ _id: id, userId });
        if (!meta) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }

        const aporte = meta.aportes.id(aporteId);
        if (!aporte) {
            return res.status(404).json({ error: 'Aporte no encontrado' });
        }

        aporte.deleteOne();

        const total = meta.aportes.reduce((s, a) => s + a.monto, 0);
        if (meta.estado === 'completada' && total < meta.montoObjetivo) {
            meta.estado = 'activa';
        }

        await meta.save();
        res.status(200).json(meta);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};