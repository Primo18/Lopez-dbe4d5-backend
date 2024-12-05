import noteService from '../services/noteService.js';

const createNote = async (req, res) => {
    const { title, content, userId } = req.body;

    if (!title || !content || !userId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const note = await noteService.createNote({ title, content, userId });
    res.status(201).json(note);
};

const updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, content, archived } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const note = await noteService.updateNote(id, { title, content, archived });
    res.status(200).json(note);
};

const deleteNote = async (req, res) => {
    const { id } = req.params;
    await noteService.deleteNote(id);
    res.status(204).send();
};

const getNotes = async (req, res) => {
    const { userId, archived } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const notes = await noteService.getNotes(userId, archived === 'true');
    res.status(200).json(notes);
};

export default { createNote, updateNote, deleteNote, getNotes };
