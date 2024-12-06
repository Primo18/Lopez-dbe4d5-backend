import prisma from '../config/database.js';

const create = async ({ title, content, userId }) => {
    const existingNote = await prisma.note.findFirst({
        where: { title, userId },
    });

    if (existingNote) {
        throw new Error('Note with this title already exists');
    }

    return await prisma.note.create({
        data: {
            title,
            content,
            user: {
                connect: { id: userId },
            },
        },
    });
};

const update = async (id, data) => {
    const existingNote = await prisma.note.findUnique({ where: { id: Number(id) } });
    if (!existingNote) {
        throw new Error('Record not found');
    }
    return await prisma.note.update({ where: { id: Number(id) }, data });
};


const deleteNote = async (id) => {
    const existingNote = await prisma.note.findUnique({ where: { id: Number(id) } });
    if (!existingNote) {
        throw new Error('Record not found');
    }
    await prisma.note.delete({ where: { id: Number(id) } });
};

const findByUserIdAndArchived = async (userId, archived) => {
    return await prisma.note.findMany({
        where: {
            userId: Number(userId),
            archived: archived,
        },
        orderBy: { createdAt: 'desc' },
    });
};

const addCategoriesToNote = async (noteId, userId, categoryIds) => {
    // Check if the note exists and belongs to the user
    const noteExists = await prisma.note.findFirst({
        where: { id: noteId, userId: userId },
    });
    if (!noteExists) {
        throw new Error('Note does not exist or does not belong to the user');
    }

    // Check if the categories exist and belong to the user
    const categoriesExist = await prisma.category.findMany({
        where: {
            id: { in: categoryIds },
            userId: userId,
        },
    });
    if (categoriesExist.length !== categoryIds.length) {
        throw new Error('One or more categories do not belong to the user');
    }

    // Conect
    const noteCategories = await prisma.noteCategory.createMany({
        data: categoryIds.map(categoryId => ({
            noteId: noteId,
            categoryId: categoryId
        })),
        skipDuplicates: true // This will prevent errors if the category is already connected to the note
    });

    // Optional: Return the note with the categories
    return await prisma.note.findUnique({
        where: { id: noteId },
        include: { categories: true }
    });
};

const removeCategoryFromNote = async (numNoteId, numCategoryId) => {
    // Check if the NoteCategory relationship exists
    const noteCategory = await prisma.noteCategory.findFirst({
        where: {
            noteId: numNoteId,
            categoryId: numCategoryId
        }
    });

    if (!noteCategory) {
        throw new Error('Invalid Note ID or Category ID');
    }

    // Delete the NoteCategory relationship
    await prisma.noteCategory.delete({
        where: {
            noteId_categoryId: {
                noteId: numNoteId,
                categoryId: numCategoryId
            }
        }
    });

    // Fetch the updated note with the remaining categories
    return await prisma.note.findUnique({
        where: { id: numNoteId },
        include: {
            categories: {
                include: {
                    category: true // This will include the full category details
                }
            }
        }
    });

};

const getNotesByCategory = async (userId, categoryName) => {
    return await prisma.note.findMany({
        where: {
            userId: userId,
            categories: {
                some: {
                    category: {
                        name: categoryName,
                    },
                },
            },
        },
        include: {
            categories: true,
        },
    });
};

export default { create, update, deleteNote, findByUserIdAndArchived, addCategoriesToNote, removeCategoryFromNote, getNotesByCategory };
