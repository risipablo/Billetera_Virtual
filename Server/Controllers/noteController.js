
const noteModel = require('../Models/Note');

exports.getNotes = async (req, res) => {
    try {
        const notes = await noteModel.find({ userId: req.user.id });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.addNote = async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newNote = new noteModel({
            title,
            description,
            userId: req.user.id,
        });
        const result = await newNote.save();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

