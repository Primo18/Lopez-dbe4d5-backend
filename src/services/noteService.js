import noteRepository from '../repositories/noteRepository.js';

const createNote = async (noteData) => {
    return await noteRepository.create(noteData);
};

const updateNote = async (id, userId, data) => {
    await noteRepository.validateUserOwnership(id, userId);
    return await noteRepository.update(id, data);
};

const deleteNote = async (id, userId) => {
    await noteRepository.validateUserOwnership(id, userId);
    await noteRepository.deleteNote(id);
};

const getNotes = async (userId, archived) => {
    const notes = await noteRepository.getNotes(userId, archived);
    const simplifiedNotes = notes.map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        archived: note.archived,
        categories: note.categories.map(category => ({
            id: category.category.id,
            name: category.category.name,
        })),
    }));
    return simplifiedNotes;
};

const addCategoriesToNote = async (noteId, categoryIds) => {
    const note = await noteRepository.validateNoteExistence(noteId);
    if (!note) {
        throw new Error('Note not found');
    }
    await noteRepository.addCategoriesToNote(noteId, categoryIds);
    return await getNotes(note.userId, note.archived);
};

const removeCategoryFromNote = async (noteId, categoryId) => {
    const note = await noteRepository.removeCategoryFromNote(noteId, categoryId);
    return await getNotes(note.userId, note.archived);
};

export default {
    createNote,
    updateNote,
    deleteNote,
    getNotes,
    addCategoriesToNote,
    removeCategoryFromNote,
};
