import noteService from '../services/noteService.js';

// Phase 1
const createNote = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.userId;

    if (!title || !content) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const note = await noteService.createNote({ title, content, userId });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateNote = async (req, res) => {
    const { id } = req.params;
    const { title, content, archived } = req.body;

    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const note = await noteService.getNoteById(id);

        if (!note) {
            return res.status(404).json({ error: 'Note not found' });
        }

        if (note.userId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to edit this note' });
        }

        const updatedFields = {};
        if (title !== undefined) updatedFields.title = title;
        if (content !== undefined) updatedFields.content = content;
        if (archived !== undefined) updatedFields.archived = archived;

        const updatedNote = await noteService.updateNote(id, updatedFields);

        return res.status(200).json(updatedNote);
    } catch (error) {
        if (error.message === 'Record not found') {
            return res.status(404).json({ error: 'Note not found' });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



const deleteNote = async (req, res) => {
    const { id } = req.params;
    try {
        await noteService.deleteNote(id);
        res.status(204).send();
    } catch (error) {
        if (error.message === 'Record not found') {
            return res.status(404).json({ error: 'Note not found' });
        }
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getNotes = async (req, res) => {
    const userId = req.userId;
    const { archived } = req.query;

    try {
        const notes = await noteService.getNotes(userId, archived === 'true');
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Phase 2
const addCategoriesToNote = async (req, res) => {
    const { id } = req.params;
    const { categoryIds } = req.body;
    const userId = req.userId;

    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
        return res.status(400).json({ error: 'Invalid category IDs' });
    }

    try {
        const updatedNote = await noteService.addCategoriesToNote(Number(id), Number(userId), categoryIds);
        res.status(200).json(updatedNote);
    } catch (error) {
        if (error.message === 'Note does not exist or does not belong to the user') {
            return res.status(404).json({ error: error.message }); // 404: Not Found
        }
        if (error.message === 'One or more categories do not belong to the user') {
            return res.status(403).json({ error: error.message }); // 403: Forbidden
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};


const removeCategoryFromNote = async (req, res) => {
    const { id, categoryId } = req.params;

    if (!id || !categoryId) {
        return res.status(400).json({ error: 'Note ID and Category ID are required' });
    }

    try {
        const updatedNote = await noteService.removeCategoryFromNote(id, categoryId);
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error('Error removing category from note:', error);

        if (error.message === 'Invalid Note ID or Category ID') {
            return res.status(400).json({ error: error.message });
        }

        if (error.message === 'Category is not associated with this note') {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const getNotesByCategory = async (req, res) => {
    const { category } = req.query;
    const userId = req.userId;

    if (!category) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        const notes = await noteService.getNotesByCategory(userId, category);
        res.status(200).json(notes);
    } catch (error) {
        console.error('Error in getNotesByCategory:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default { createNote, updateNote, deleteNote, getNotes, addCategoriesToNote, removeCategoryFromNote, getNotesByCategory };
