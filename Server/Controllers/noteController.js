
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
    const { titulo, descripcion,fecha } = req.body;

    if (!titulo || !descripcion || !fecha) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newNote = new noteModel({
            titulo,
            descripcion,
            fecha,
            userId: req.user.id,
        });
        const result = await newNote.save();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


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

exports.editNote = async (req, res) => {
    const {id} = req.params;
    const {titulo, descripcion, fecha} = req.body;
    try{
        const note  = await noteModel.findOneAndUpdate(
            {_id: id, userId: req.user.id},
            {titulo, descripcion, fecha},
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
