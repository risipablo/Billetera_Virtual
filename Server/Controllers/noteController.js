
// Logica para el componente notasPage

const noteModel = require('../Models/Note');

exports.getNotes = async (req, res) => {
    try {
        const notes = await noteModel.find({ userId: req.user.id });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.addNotes = async (req, res) => {
    const { titulo, descripcion, fecha, cuotas, precio } = req.body;

    if (!titulo || !descripcion || !fecha || !precio || !cuotas) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    try {
        const newNote = new noteModel({
            titulo,
            descripcion,
            cuotas,
            precio,
            fecha,
            userId: req.user.id,
        });
        const result = await newNote.save();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.addMoreNotes = async (req, res) => {
    const { id } = req.params;
    const { newNote } = req.body; 

    if (!newNote ) {
        return res.status(400).json({ error: "Faltan datos para agregar nota" });
    }

    try {
        const note = await noteModel.findById(id);

        if (!note) {
            return res.status(404).json({ error: "Nota no encontrada" });
        }

        note.descripcion.push(newNote);

        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addMoreDates = async (req,res) => {
    const {id} = req.params;
    const { newDate } = req.body;
    
    if(!newDate) {
        return res.json(404).json({error: "Notas no encontradas"})
    }

    try{
        const note = await noteModel.findById(id)
        if (!note) {
            return res.status(404).json({ error: "Nota no encontrada" });
        }


        note.fecha.push(new Date(newDate))

        const updateNote = await note.save()
        res.json(updateNote)

    } catch(err) {
        res.status(500).json({err:err.message})
    }
}

exports.addMorePrecios = async (req,res) => {
    const {id} = req.params;
    const {newPrice} = req.body

    if(!newPrice){
        return res.json(404).json({error: "Nota no encontrada"})
    }

    try{
        const note = await noteModel.findById(id)

        if(!note){
            return res.status(404).json({ error: "Nota no encontrada" });
        }

        note.precio.push(newPrice)

        const updatePrice = await note.save()
        res.json(updatePrice)
        
    } catch (err) {
        res.status(500).json({err:err.message})
    }
}


exports.deleteNote = async (req, res) => {
    const {id} = req.params;
    try{
        const note = await noteModel.findOneAndDelete({_id: id, userId: req.user.id});
        if(!note){
            return res.status(404).json({error: 'Note not found'});
        }
        res.json(note);
    } catch(err){
        res.status(500).json({error: err.message});
    }
}


// Eliminar notas indivduales

exports.deleteIndividualNote = async (req,res) => {
    const {id, noteIndex} = req.params;

    try{
        const index = parseInt(noteIndex)

        const note = await noteModel.findById(id)

        if(!note){
            return res.json(404).json({error: "Nota no encontrada"})
        }

        if (index < 0 || index >= note.descripcion.length){
            return res.status(404).json({error: "Error de index en las notas"})
        }

        note.descripcion.splice(index,1)

        const updateNote = await note.save()
        res.json(updateNote)
    } catch (err){
        res.status(500).json({error: err.message})
    }
}

exports.deleteIndividualDate = async (req,res) => {
    const {id, dateIndex} = req.params;

    try{
        const index = parseInt(dateIndex)

        const note = await noteModel.findById(id)

        if(!note){
            return res.json(404).json({error: "Nota no encontrada"})
        }

        if (index < 0 || index >= note.fecha.length){
            return res.status(404).json({error: "Error de index en las notas"})
        }

        note.fecha.splice(index,1)

        const updateNote = await note.save()
        res.json(updateNote)
    } catch (err){
        res.status(500).json({error: err.message})
    }
}
 
 
exports.editNote = async (req, res) => {
    const {id} = req.params;
    const {titulo, cuotas} = req.body;
    try{
        const note  = await noteModel.findOneAndUpdate(
            {_id: id, userId: req.user.id},
            {titulo, cuotas},
            {new: true}
        );
        if(!note){
            return res.status(404).json({error: 'Note not found'});
        }
        res.json(note);
    }
    catch(err){
        res.status(500).json({error: err.message});
    }
}

exports.editItem = async (req, res) => {
    const {id, idx} = req.params;
    const {fecha, descripcion, precio} = req.body
    const index = parseInt(idx, 10);

    try{
         const note = await noteModel.findOne({ _id: id, userId: req.user.id });
         if (!note) return res.status(404).json({ message: 'Nota no encontrada' });

        //  validar indice
        if(
            !Array.isArray(note.descripcion) ||
            !Array.isArray(note.fecha) ||
            !Array.isArray(note.precio) ||
            isNaN(index) ||
            index < 0 ||
            index >= note.descripcion.length
        ) {
            return res.status(400).json({ message: "Indice invalido"})
        }

        note.descripcion[idx] = descripcion
        note.fecha[idx] = fecha
        note.precio[idx] = precio

        await note.save()
        res.json(note)

    } catch (err) {
        res.status(500).json({ message: 'Error al editar la nota', err})
    }
}


