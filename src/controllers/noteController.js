import noteService from '../services/noteService.js';

// Helper function for error handling
const handleControllerError = (res, error, customMessages = {}) => {
    const { status = 500, message = 'Internal server error' } = customMessages[error.message] || {};
    console.error(error);
    return res.status(status).json({ error: message || error.message });
};

// Controller functions
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
        handleControllerError(res, error);
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
        const updatedFields = { title, content, archived };
        const updatedNote = await noteService.updateNote(Number(id), userId, updatedFields);

        res.status(200).json(updatedNote);
    } catch (error) {
        handleControllerError(res, error, {
            'Note not found': { status: 404, message: 'Note not found' },
            'You do not have permission to modify this note': { status: 403, message: 'Unauthorized' },
        });
    }
};

const deleteNote = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        await noteService.deleteNote(Number(id), userId);
        res.status(204).send();
    } catch (error) {
        handleControllerError(res, error, {
            'Note not found': { status: 404, message: 'Note not found' },
            'You do not have permission to modify this note': { status: 403, message: 'Unauthorized' },
        });
    }
};

const getNotes = async (req, res) => {
    const userId = req.userId;
    const { archived } = req.query;

    try {
        const notes = await noteService.getNotes(userId, archived === 'true');
        res.status(200).json(notes);
    } catch (error) {
        handleControllerError(res, error);
    }
};

const addCategoriesToNote = async (req, res) => {
    const { id } = req.params;
    const { categoryIds } = req.body;

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
        return res.status(400).json({ error: 'Invalid category IDs' });
    }

    try {
        const updatedNote = await noteService.addCategoriesToNote(Number(id), categoryIds);
        res.status(200).json(updatedNote);
    } catch (error) {
        handleControllerError(res, error, {
            'Note does not exist or does not belong to the user': { status: 404, message: error.message },
            'One or more categories do not belong to the user': { status: 403, message: error.message },
        });
    }
};

const removeCategoryFromNote = async (req, res) => {
    const { id, categoryId } = req.params;

    if (!id || !categoryId) {
        return res.status(400).json({ error: 'Note ID and Category ID are required' });
    }

    try {
        const updatedNote = await noteService.removeCategoryFromNote(Number(id), Number(categoryId));
        res.status(200).json(updatedNote);
    } catch (error) {
        handleControllerError(res, error);
    }
};

export default {
    createNote,
    updateNote,
    deleteNote,
    getNotes,
    addCategoriesToNote,
    removeCategoryFromNote,
};
