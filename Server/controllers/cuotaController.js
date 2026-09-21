const noteModel = require('../models/Cuotas');


const sumarMeses = (fecha, meses) => {
    const año = fecha.getUTCFullYear();
    const mes = fecha.getUTCMonth() + meses;
    const dia = fecha.getUTCDate();

    const ultimoDiaMes = new Date(Date.UTC(año, mes + 1, 0)).getUTCDate();
    const diaFinal = Math.min(dia, ultimoDiaMes);

    return new Date(Date.UTC(año, mes, diaFinal));
};


const asegurarFechaPrimeraCuota = (note) => {
    if (!note.fechaPrimeraCuota) {
        const primera = (note.fecha && note.fecha[0])
            ? new Date(note.fecha[0])
            : (note.fechaCompra || new Date());
        note.fechaPrimeraCuota = primera.toISOString().slice(0, 10);
    }
};

exports.getNotes = async (req, res) => {
    try {
        const notes = await noteModel.find({ userId: req.user.id });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.addNotes = async (req, res) => {
    const { titulo, cuotas, monto, fecha, fechaPrimeraCuota, categoria } = req.body;

    if (!titulo || !cuotas || !monto || !fecha || !fechaPrimeraCuota || !categoria) {
        return res.status(400).json({
            error: 'Todos los campos son requeridos: título, cuotas, monto, fecha, fecha primera cuota y categoría'
        });
    }

    const totalCuotas = Number(cuotas);
    const montoTotal = Number(monto);

    if (totalCuotas < 1 || totalCuotas > 100) {
        return res.status(400).json({ error: 'La cantidad de cuotas debe estar entre 1 y 100' });
    }

    if (montoTotal <= 0) {
        return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
    }

    const fechaCompraDate = new Date(fecha);
    const primeraCuotaDate = new Date(fechaPrimeraCuota);

    if (isNaN(fechaCompraDate.getTime())) {
        return res.status(400).json({ error: 'Fecha de compra inválida' });
    }

    if (isNaN(primeraCuotaDate.getTime())) {
        return res.status(400).json({ error: 'Fecha de primera cuota inválida' });
    }

    const montoPorCuota = Math.floor((montoTotal / totalCuotas) * 100) / 100;
    const diferencia = Math.round((montoTotal - montoPorCuota * totalCuotas) * 100) / 100;

    const descripcion = [];
    const fechas = [];
    const precios = [];
    const completedItems = [];

    for (let i = 0; i < totalCuotas; i++) {
        descripcion.push(`Cuota ${i + 1}/${totalCuotas}`);
        fechas.push(sumarMeses(primeraCuotaDate, i));
        precios.push(i === totalCuotas - 1 ? montoPorCuota + diferencia : montoPorCuota);
        completedItems.push(false);
    }

    try {
        const noteData = {
            titulo: titulo.trim(),
            cuotas: totalCuotas,
            montoTotal,
            fechaCompra: fechaCompraDate,
            categoria: categoria.trim(),
            descripcion,
            fecha: fechas,
            precio: precios,
            completedItems,
            fechaPrimeraCuota: primeraCuotaDate.toISOString().slice(0, 10),
            userId: req.user.id,
        };

        const newNote = new noteModel(noteData);
        const result = await newNote.save();

        res.status(201).json(result);
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

        note.descripcion.push(descripcion.trim())
        note.fecha.push(nuevaFecha)
        note.precio.push(Number(precio))
        note.completedItems.push(false)

        asegurarFechaPrimeraCuota(note);

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

        asegurarFechaPrimeraCuota(note);

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
    const { titulo, cuotas, montoTotal, fecha, fechaPrimeraCuota, categoria } = req.body;

    try {
        const note = await noteModel.findOne({ _id: id, userId: req.user.id });
        if (!note) {
            return res.status(404).json({ error: 'Nota no encontrada' });
        }

        if (titulo) note.titulo = titulo;
        if (montoTotal) note.montoTotal = Number(montoTotal);
        if (fecha) note.fechaCompra = new Date(fecha);
        if (categoria) note.categoria = categoria;

        if (cuotas) {
            const nuevoTotal = Number(cuotas);
            const viejasCuotas = note.cuotas;

            if (nuevoTotal !== viejasCuotas) {
                const montoPorCuota = Math.floor((Number(montoTotal || note.montoTotal) / nuevoTotal) * 100) / 100;
                const diferencia = Math.round((Number(montoTotal || note.montoTotal) - montoPorCuota * nuevoTotal) * 100) / 100;

                const primeraFecha = fechaPrimeraCuota
                    ? new Date(fechaPrimeraCuota)
                    : (note.fecha[0] ? new Date(note.fecha[0]) : new Date());

                const nuevosItems = [];
                const nuevasFechas = [];
                const nuevosPrecios = [];
                const nuevosCompleted = [];

                for (let i = 0; i < nuevoTotal; i++) {
                    nuevosItems.push(`Cuota ${i + 1}/${nuevoTotal}`);
                    nuevasFechas.push(sumarMeses(primeraFecha, i));
                    nuevosPrecios.push(i === nuevoTotal - 1 ? montoPorCuota + diferencia : montoPorCuota);
                    nuevosCompleted.push(i < viejasCuotas ? (note.completedItems[i] || false) : false);
                }

                note.descripcion = nuevosItems;
                note.fecha = nuevasFechas;
                note.precio = nuevosPrecios;
                note.completedItems = nuevosCompleted;
                note.cuotas = nuevoTotal;
            } else if (fechaPrimeraCuota) {
                const primeraFecha = new Date(fechaPrimeraCuota);

                for (let i = 0; i < note.cuotas; i++) {
                    note.fecha[i] = sumarMeses(primeraFecha, i);
                }
            }
        } else if (fechaPrimeraCuota) {
            const primeraFecha = new Date(fechaPrimeraCuota);

            for (let i = 0; i < note.cuotas; i++) {
                note.fecha[i] = sumarMeses(primeraFecha, i);
            }
        }

        asegurarFechaPrimeraCuota(note);

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

        asegurarFechaPrimeraCuota(note);

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

        asegurarFechaPrimeraCuota(note);

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
        asegurarFechaPrimeraCuota(note);
        await note.save();
        res.json(note);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};