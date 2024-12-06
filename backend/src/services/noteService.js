import noteRepository from '../repositories/noteRepository.js';

const createNote = async ({ title, content, userId }) => {
    return await noteRepository.create({ title, content, userId });
};

const updateNote = async (id, data) => {
    return await noteRepository.update(id, data);
};

const deleteNote = async (id) => {
    await noteRepository.deleteNote(id);
};

const getNotes = async (userId, archived) => {
    return await noteRepository.findByUserIdAndArchived(userId, archived);
};

const addCategoriesToNote = async (noteId, userId, categoryIds) => {
    try {
        console.log('Service: Adding categories to note:', { noteId, userId, categoryIds });
        return await noteRepository.addCategoriesToNote(noteId, userId, categoryIds);
    } catch (error) {
        console.error('Error in service addCategoriesToNote:', error);
        throw error;
    }
};

const removeCategoryFromNote = async (noteId, categoryId) => {
    // Convert string IDs to integers
    const numNoteId = parseInt(noteId, 10);
    const numCategoryId = parseInt(categoryId, 10);

    // Vlaidate the IDs
    if (isNaN(numNoteId) || isNaN(numCategoryId)) {
        throw new Error('Invalid note or category ID');
    }
    return await noteRepository.removeCategoryFromNote(numNoteId, numCategoryId);
};

const getNotesByCategory = async (userId, categoryName) => {
    return await noteRepository.getNotesByCategory(userId, categoryName);
};

export default { createNote, updateNote, deleteNote, getNotes, addCategoriesToNote, removeCategoryFromNote, getNotesByCategory };
