import prisma from '../config/database.js';

const create = async (data) => {
    return await prisma.note.create({ data });
};

const update = async (id, data) => {
    return await prisma.note.update({ where: { id: Number(id) }, data });
};

const deleteNote = async (id) => {
    await prisma.note.delete({ where: { id: Number(id) } });
};

const findByUserIdAndArchived = async (userId, archived) => {
    return await prisma.note.findMany({
        where: { userId: Number(userId), archived },
    });
};

export default { create, update, deleteNote, findByUserIdAndArchived };
