import prisma from '../config/database.js';

const create = async ({ name, userId }) => {
    const existingCategory = await prisma.category.findFirst({
        where: {
            name,
            userId,
        },
    });

    if (existingCategory) {
        throw new Error('Category already exists');
    }

    return await prisma.category.create({
        data: {
            name,
            user: {
                connect: { id: userId },
            },
        },
    });
};

const deleteCategory = async (id, userId) => {
    const category = await prisma.category.findFirst({
        where: {
            id: Number(id),
            userId: Number(userId),
        },
    });

    if (!category) {
        return false;
    }
    await prisma.category.delete({
        where: { id: Number(id) },
    });

    return true;
};

const list = async (userId) => {
    return await prisma.category.findMany({
        where: { userId: Number(userId) },
        orderBy: { name: 'asc' },
    });
};


export default { create, deleteCategory, list };
