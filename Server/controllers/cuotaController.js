

const noteModel = require('../models/Cuotas');

exports.getNotes = async (req, res) => {
    try {
        const notes = await noteModel.find({ userId: req.user.id });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}




exports.addNotes = async (req, res) => {
    
    const { titulo, cuotas, monto, fecha, categoria } = req.body;

    console.log('=== DATOS COMPLETOS RECIBIDOS ===');
    console.log('titulo:', titulo);
    console.log('cuotas:', cuotas);
    console.log('monto:', monto);
    console.log('fecha:', fecha);
    console.log('categoria:', categoria);

    
    if (!titulo || !cuotas || !monto || !fecha || !categoria) {
        console.log('Faltan campos:', {
            titulo: !titulo,
            cuotas: !cuotas,
            monto: !monto,
            fecha: !fecha,
            categoria: !categoria
        });
        return res.status(400).json({ 
            error: 'Todos los campos son requeridos: título, cuotas, monto, fecha y categoría' 
        });
    }

    try {
        
        const noteData = {
            titulo: titulo.trim(),
            cuotas: Number(cuotas),
            montoTotal: Number(monto),
            fechaCompra: new Date(fecha),
            categoria: categoria.trim(), 
            descripcion: [],
            precio: [],
            fecha: [],
            completedItems: [],
            userId: req.user.id,
        };

        console.log('=== DATOS A GUARDAR EN MONGODB ===');
        console.log('noteData completo:', noteData);
        console.log('categoria a guardar:', noteData.categoria);

        
        const newNote = new noteModel(noteData);
        const result = await newNote.save();

        console.log('=== DOCUMENTO GUARDADO ===');
        console.log('result:', result);
        console.log('result.categoria:', result.categoria);

        
        const responseData = {
            ...result.toObject(),
            categoria: result.categoria 
        };

        console.log('=== RESPUESTA A ENVIAR ===');
        console.log('responseData:', responseData);

        res.status(201).json(responseData);
    } catch (err) {
        console.error('ERROR AL GUARDAR:', err);
        res.status(500).json({ 
            error: err.message,
            details: err.errors || {}
        });
    }
};

exports.addNoteItem = async (req,res) => {
    const {id} = req.params
    const {descripcion, fecha, precio} = req.body

    
    if (!descripcion || !fecha || !precio) {
        return res.status(400).json({ 
            error: 'Descripción, fecha y precio son requeridos' 
        });
    }

    try{
        const note = await noteModel.findOne({_id:id, userId:req.user.id})

        if(!note){
            return res.status(404).json({ error: 'Cuota no encontrada '})
        }

        const nuevaFecha = new Date(fecha);
        if (isNaN(nuevaFecha.getTime())) {
            return res.status(400).json({ error: 'Fecha inválida' });
        }

        console.log('Fecha guardada:', nuevaFecha);

        note.descripcion.push(descripcion.trim())
        note.fecha.push(nuevaFecha)
        note.precio.push(Number(precio))
        note.completedItems.push(false)

        const updateNote = await note.save()
        res.json(updateNote)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


exports.deleteNote = async (req, res) => {
    const { id } = req.params;
    try {
        const note = await noteModel.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!note) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.deleteNoteItem = async (req, res) => {
    const { id, idx } = req.params;
    const index = parseInt(idx, 10);

    try {
        const note = await noteModel.findOne({ _id: id, userId: req.user.id });
        if (!note) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }

        if (isNaN(index) || index < 0 || index >= note.descripcion.length) {
            return res.status(400).json({ error: 'Índice inválido' });
        }

        
        note.descripcion.splice(index, 1);
        note.fecha.splice(index, 1);
        note.precio.splice(index, 1);
        note.completedItems.splice(index, 1);

        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deletecuotasFilter = async (req, res) => {
const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Se requiere un array de ids' });
    }

    try {
        const result = await noteModel.deleteMany({
            _id: { $in: ids },
            userId: req.user.id
        });
        res.json({
            message: `${result.deletedCount} productos eliminados`,
            deletedCount: result.deletedCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
 
exports.deleteAllCuotas = async(req,res) => {
    try{
        const result = await noteModel.deleteMany({userId:req.user.id})
        res.json(result)
    } catch(err){
        res.status(500).json({error:err.message})
    }
}
 
exports.editNote = async (req, res) => {
    const { id } = req.params;
    const { titulo, cuotas, montoTotal, fecha,categoria } = req.body;

    try {
        const note = await noteModel.findOne({ _id: id, userId: req.user.id });
        if (!note) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }

        if (titulo) note.titulo = titulo;
        if (cuotas) note.cuotas = Number(cuotas);
        if (montoTotal) note.montoTotal = Number(montoTotal);
        if (fecha) note.fechaCompra = new Date(fecha);
        if (categoria) note.categoria = categoria   

        await note.save();
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.editNoteItem = async (req, res) => {
    const { id, idx } = req.params;
    const { descripcion, fecha, precio } = req.body;
    const index = parseInt(idx, 10);

    try {
        const note = await noteModel.findOne({ _id: id, userId: req.user.id });
        if (!note) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }

        if (isNaN(index) || index < 0 || index >= note.descripcion.length) {
            return res.status(400).json({ error: 'Índice inválido' });
        }

      
        if (descripcion) note.descripcion[index] = descripcion;
        if (fecha) note.fecha[index] = new Date(fecha);
        if (precio) note.precio[index] = Number(precio);

        await note.save();
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.toggleCompleteItem = async (req, res) => {
    const { id, idx } = req.params;
    const index = parseInt(idx, 10);

    try {
        const note = await noteModel.findOne({ _id: id, userId: req.user.id });
        if (!note) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }

        if (isNaN(index) || index < 0 || index >= note.completedItems.length) {
            return res.status(400).json({ error: 'Índice inválido' });
        }


        note.completedItems[index] = !note.completedItems[index];

        await note.save();
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.toggleCompleteNote = async (req, res) => {
    const { id } = req.params;

    try {
        const note = await noteModel.findOne({ _id: id, userId: req.user.id });
        if (!note) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }

        note.completed = !note.completed;
        await note.save();
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};