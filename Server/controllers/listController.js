const ListModel = require("../models/Listado");

exports.getList = async (req, res) => {
    try {
        const list = await ListModel.find({ userId: req.user.id });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.addList = async (req, res) => {
    const { titulo, fecha } = req.body;

    if (!titulo || !fecha) {
        return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    try {
        const newList = new ListModel({
            titulo,
            fecha,
            userId: req.user.id
        });

        const result = await newList.save();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteList = async (req, res) => {
    const { id } = req.params;

    try {
        const list = await ListModel.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!list) {
            return res.status(404).json({ error: 'Listado no encontrado' });
        }
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.DeleteAll = async (req, res) => {
    try {
        const result = await ListModel.deleteMany({ userId: req.user.id });
        res.json({ message: 'Todos los listados han sido eliminados', deletedCount: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
};


exports.addNoteList = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body; // Cambiar newNote → text

    if (!text || text.trim() === '') {
        return res.status(400).json({ error: "Ingrese una nota válida" });
    }

    try {
        const note = await ListModel.findOne({ _id: id, userId: req.user.id });
        if (!note) {
            return res.status(404).json({ error: "Listado no encontrado" });
        }

        note.descripcion.push({ text: text.trim(), completed: false });
        const updateNote = await note.save();
        res.json(updateNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteIndexList = async (req, res) => {
    const { id, idx } = req.params;
    const index = parseInt(idx, 10);

    try {
        const note = await ListModel.findOne({ _id: id, userId: req.user.id });
        if (!note) {
            return res.status(404).json({ error: "Listado no encontrado" });
        }

        if (isNaN(index) || index < 0 || index >= note.descripcion.length) {
            return res.status(400).json({ error: "Índice inválido" });
        }

        note.descripcion.splice(index, 1);
        const updateList = await note.save();
        res.json(updateList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.editListItem = async (req, res) => {
    const { id, idx } = req.params;
    const { text } = req.body; // Cambiar descripcion → text
    const index = parseInt(idx, 10);

    try {
        const note = await ListModel.findOne({ _id: id, userId: req.user.id });
        if (!note) {
            return res.status(404).json({ message: "Listado no encontrado" });
        }

        if (isNaN(index) || index < 0 || index >= note.descripcion.length) {
            return res.status(400).json({ message: "Índice inválido" });
        }

        if (!text || text.trim() === '') {
            return res.status(400).json({ message: "El texto no puede estar vacío" });
        }

        note.descripcion[index].text = text.trim();
        await note.save();
        res.json(note);
    } catch (err) {
        res.status(500).json({ message: 'Error al editar la nota' });
    }
};


exports.toggleCompleteDescription = async (req, res) => {
    const { id, idx } = req.params;
    const index = parseInt(idx, 10);

    try {
        const list = await ListModel.findOne({ _id: id, userId: req.user.id });
        if (!list) {
            return res.status(404).json({ error: 'Listado no encontrado' });
        }

        if (isNaN(index) || index < 0 || index >= list.descripcion.length) {
            return res.status(400).json({ error: 'Índice inválido' });
        }

        list.descripcion[index].completed = !list.descripcion[index].completed;
        const updatedList = await list.save();
        res.json(updatedList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.ListCompleted = async (req, res) => {
    const { id } = req.params;

    try {
        const list = await ListModel.findOne({ _id: id, userId: req.user.id });
        if (!list) {
            return res.status(404).json({ error: "Listado no encontrado" });
        }

        list.completed = !list.completed;
        const updatedList = await list.save();
        res.json(updatedList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};