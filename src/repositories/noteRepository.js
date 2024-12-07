import prisma from '../config/database.js';

// Helper functions
const findUniqueNote = async (id) => {
    return await prisma.note.findUnique({ where: { id: Number(id) } });
};

const findFirstNote = async (conditions) => {
    return await prisma.note.findFirst({ where: conditions });
};

const validateNoteExistence = async (id) => {
    const note = await findUniqueNote(id);
    if (!note) {
        throw new Error('Record not found');
    }
    return note;
};

const validateUserOwnership = async (noteId, userId) => {
    const note = await findUniqueNote(noteId);
    if (!note) {
        throw new Error('Note not found');
    }
    if (note.userId !== userId) {
        throw new Error('You do not have permission to modify this note');
    }
    return note;
};

// Repository functions
const create = async ({ title, content, userId }) => {
    const existingNote = await findFirstNote({ title, userId });
    if (existingNote) {
        throw new Error('Note with this title already exists');
    }

    return await prisma.note.create({
        data: {
            title,
            content,
            user: { connect: { id: userId } },
        },
    });
};

const update = async (id, data) => {
    await validateNoteExistence(id);
    return await prisma.note.update({ where: { id: Number(id) }, data });
};

const deleteNote = async (id) => {
    await validateNoteExistence(id);

    await prisma.noteCategory.deleteMany({ where: { noteId: Number(id) } });
    return await prisma.note.delete({ where: { id: Number(id) } });
};

const getNotes = async (userId, archived) => {
    return await prisma.note.findMany({
        where: {
            userId: Number(userId),
            archived: archived,
        },
        include: {
            categories: {
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};

const addCategoriesToNote = async (noteId, categoryIds) => {
    return await prisma.noteCategory.createMany({
        data: categoryIds.map(categoryId => ({
            noteId: noteId,
            categoryId: categoryId
        })),
        skipDuplicates: true // This will prevent errors if the category is already connected to the note
    });
};

const removeCategoryFromNote = async (noteId, categoryId) => {
    const noteCategory = await prisma.noteCategory.findFirst({
        where: { noteId, categoryId },
    });

    if (!noteCategory) {
        throw new Error('Invalid Note ID or Category ID');
    }

    await prisma.noteCategory.delete({
        where: { noteId_categoryId: { noteId, categoryId } },
    });
    return await findUniqueNote(noteId);
};

export default {
    create,
    update,
    deleteNote,
    getNotes,
    addCategoriesToNote,
    removeCategoryFromNote,
    validateUserOwnership,
    validateNoteExistence,
};
