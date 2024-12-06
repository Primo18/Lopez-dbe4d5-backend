import categoryRepository from '../repositories/categoryRepository.js';

const createCategory = async ({ name, userId }) => {
    return await categoryRepository.create({ name, userId });
};

const deleteCategory = async (id, userId) => {
    return await categoryRepository.deleteCategory(id, userId);
};

const listCategories = async (userId) => {
    return await categoryRepository.list(userId);
};

export default { createCategory, deleteCategory, listCategories };
