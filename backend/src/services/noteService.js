import noteRepository from '../repositories/noteRepository.js';

const createNote = async ({ title, content, userId }) => {
    return await noteRepository.create({ title, content, userId });
};

const updateNote = async (id, data) => {
    return await noteRepository.update(id, data);
};

const deleteNote = async (id) => {
    await noteRepository.delete(id);
};

const getNotes = async (userId, archived) => {
    return await noteRepository.findByUserIdAndArchived(userId, archived);
};

export default { createNote, updateNote, deleteNote, getNotes };
