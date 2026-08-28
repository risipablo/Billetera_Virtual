
// Logica para el componente notasPage

const noteModel = require('../models/Cuotas');

exports.getNotes = async (req, res) => {
    try {
        const notes = await noteModel.find({ userId: req.user.id });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// controllers/noteController.js - CON LOGS COMPLETOS

exports.addNotes = async (req, res) => {
    // ✅ LOG 1: Ver qué llega
    console.log('📥 ===== INICIO addNotes =====');
    console.log('📥 Headers:', req.headers);
    console.log('📥 Body recibido:', req.body);
    console.log('📥 Usuario ID:', req.user?.id);

    const { titulo, cuotas, monto, fecha } = req.body;

    // ✅ LOG 2: Validar campos
    console.log('📥 Validando campos:');
    console.log('  - titulo:', titulo, '| tipo:', typeof titulo);
    console.log('  - cuotas:', cuotas, '| tipo:', typeof cuotas);
    console.log('  - monto:', monto, '| tipo:', typeof monto);
    console.log('  - fecha:', fecha, '| tipo:', typeof fecha);

    if (!titulo || !cuotas || !monto || !fecha) {
        console.log('❌ FALTAN CAMPOS:', {
            titulo: !titulo,
            cuotas: !cuotas,
            monto: !monto,
            fecha: !fecha,
        });
        return res.status(400).json({ 
            error: 'Título, cuotas, monto y fecha son requeridos' 
        });
    }

    try {
        // ✅ LOG 3: Datos a guardar
        const noteData = {
            titulo: titulo.trim(),
            cuotas: Number(cuotas),
            montoTotal: Number(monto),
            descripcion: [],
            precio: [],
            fecha: [new Date(fecha)],
            completedItems: [],
            userId: req.user.id,
        };
        console.log('📥 Datos a guardar:', JSON.stringify(noteData, null, 2));

        const newNote = new noteModel(noteData);
        console.log('📥 Modelo creado, guardando...');

        const result = await newNote.save();
        console.log('✅ Nota creada exitosamente:', result);
        res.status(201).json(result);

    } catch (err) {
        // ✅ LOG 4: Error completo
        console.error('❌ ===== ERROR EN addNotes =====');
        console.error('❌ Mensaje:', err.message);
        console.error('❌ Stack:', err.stack);
        console.error('❌ Código:', err.code);
        console.error('❌ Nombre:', err.name);
        
        // ✅ Si es error de MongoDB
        if (err.name === 'MongoError' || err.name === 'MongoServerError') {
            console.error('❌ MongoDB Error Details:', {
                code: err.code,
                keyPattern: err.keyPattern,
                keyValue: err.keyValue,
            });
        }

        // ✅ Si es error de validación de Mongoose
        if (err.name === 'ValidationError') {
            console.error('❌ Validation Errors:', err.errors);
        }

        res.status(500).json({ 
            error: err.message,
            details: err.errors || {},
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

        note.descripcion.push(descripcion.trim())
        note.fecha.push(new Date(fecha))
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

// Eliminar notas indivduales
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
 
 
exports.editNote = async (req, res) => {
    const { id } = req.params;
    const { titulo, cuotas } = req.body;

    try {
        const note = await noteModel.findOne({ _id: id, userId: req.user.id });
        if (!note) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }

        if (titulo) note.titulo = titulo;
        if (cuotas) note.cuotas = Number(cuotas);

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


        const todasPagadas = note.completedItems.every(item => item === true);
        if (todasPagadas && note.completedItems.length > 0) {
            note.completed = true;
        } else {
            note.completed = false;
        }

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