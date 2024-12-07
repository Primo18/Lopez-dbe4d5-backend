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
const getNoteById = async (id) => {
    return await noteRepository.findNoteById(id);
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
    const updatedNote = await noteRepository.removeCategoryFromNote(noteId, categoryId);
    if (!updatedNote) {
        throw new Error('Note not found or category not associated');
    }

    return updatedNote;
};


const getNotesByCategory = async (userId, categoryName) => {
    const notes = await noteRepository.getNotesByCategory(userId, categoryName);
    return notes; // Return the notes with the specified category
};


const getCategoriesForNote = async (noteId, userId) => {
    const categories = await noteRepository.getCategoriesForNoteById(noteId, userId);
    return categories.map((item) => item.category);
};


export default { createNote, updateNote, deleteNote, getNotes, addCategoriesToNote, removeCategoryFromNote, getNotesByCategory, getNoteById, getCategoriesForNote };
