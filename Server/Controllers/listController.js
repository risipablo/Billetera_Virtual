const ListModel = require("../models/Listado")


exports.getList = async (req,res) => {
    try{
        const list = await ListModel.find({userId : req.user.id})
        res.json(list)
    } catch (err){
        res.status(500).json({error: err.message})
    }
}

exports.addList = async (req,res) => {
    const {titulo, fecha} = req.body;

    if(!titulo || !fecha){
        return res.status(400).json({error: "Todos los campos son requeridos"})
    }

    try{
        const newList = new ListModel({
            titulo, fecha, userId: req.user.id
        });

        const result = await newList.save()
        res.json(result)
    } catch (err){
        res.status(500).json({error: err.message})
    }
}

exports.deleteList = async (req,res) => {
        const {id} = req.params;

        try{
            const list = await ListModel.findOneAndDelete({_id: id, userId: req.user.id})
            if(!list){
                return res.status(404).json({error: 'Listado no encontrado'})
            }
            res.json(list);
        } catch(err){
            res.status(500).json({error: err.message})
        }

}


// agregar notas
exports.addNoteList = async (req,res) => {
    const {id} = req.params;
    const {newNote} = req.body;

    if(!newNote){
        return res.json(404).json({ error: "Ingrese nota"})
    }

    try{
        const note = await ListModel.findById(id)
        if(!note){
            return res.status(404).json({ error: "Notas no encontradas"})
        }

        note.descripcion.push({ text: newNote, completed: false });

        const updateNote = await note.save();
        res.json(updateNote);
    } catch(err) {
        res.stauts(500).json({error: err.message})
    }
}


exports.deleteIndexList = async (req,res) => {
    const {id, indexList} = req.params;

    try{
        const index = parseInt(indexList)

        const note = await ListModel.findById(id)

        
        if (index < 0 || index >= note.descripcion.length){
            return res.status(404).json({error: "Error de index en las notas"})
        }

        if(!note){
            return res.status(404).json({error: "Nota no encontrada"})
        }

        note.descripcion.splice(index,1)
        const updateList = await note.save()
        res.json(updateList)
    
    } catch(err){
        res.status(500).json({error:err.message})
    }
}




exports.editListItem = async (req,res) => {
    const {id, idx} = req.params;
    const {descripcion} = req.body
    
    const index = parseInt(idx,10)

    try {
        const note = await ListModel.findOne({_id:id, userId: req.user.id})
        if (!note){
            return res.status(404).json({message: "La nota no se encuentra"})
        }

        if(!Array.isArray(note.descripcion) || isNaN(index) || index >= note.descripcion.length)
        {
            return res.status(400).json({message: "Indice invalido"})
        }

        note.descripcion[index].text = descripcion

        await note.save()
        res.json(note)
    
    } catch(err){
        res.status(500).json({message: 'Error al editar la nota'})
    }
}


// Completar notas internas
exports.toggleCompleteDescription = async (req, res) => {
    const { id, idx } = req.params;
    
    try {
        // Convertir el índice a número
        const index = parseInt(idx, 10);
        
        // Buscar la lista por ID y verificar que pertenece al usuario
        const list = await ListModel.findOne({ _id: id, userId: req.user.id });
        
        if (!list) {
            return res.status(404).json({ error: 'Lista no encontrada' });
        }
        
        // Verificar que el índice es válido
        if (isNaN(index) || index < 0 || index >= list.descripcion.length) {
            return res.status(400).json({ error: 'Índice de descripción inválido' });
        }

        // El índice es un número válido (no NaN)
        // No es negativo
        // No excede el tamaño del array descripcion
        
        // Cambiar el estado de completado
        list.descripcion[index].completed = !list.descripcion[index].completed;
        
        // Guardar los cambios
        const updatedList = await list.save();
        
        res.json(updatedList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Completar listado 
exports.ListCompleted = async (req,res) => {
    const {id} = req.params
    const {completed} = req.body

    if (typeof completed !== 'boolean'){
        return res.status(400).json({error: "Completed status is required and should be a boolean"})
    }

    try{
        const updateList = await ListModel.findByIdAndUpdate(id, {completed}, {new:true})
    
        if(!updateList){
            return res.status(404).json({error: "List not found"})
        }
        res.json(updateList)

    } catch(err){
        res.status(500).json({error:err.message})
    }

}