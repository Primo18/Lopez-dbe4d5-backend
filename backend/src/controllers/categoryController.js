import categoryService from '../services/categoryService.js';

const createCategory = async (req, res) => {
    const { name } = req.body;
    const userId = req.userId;

    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        const category = await categoryService.createCategory({ name, userId });
        res.status(201).json(category);
    } catch (error) {
        if (error.message === 'Category already exists') {
            return res.status(409).json({ error: 'Category already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    if (!id) {
        return res.status(400).json({ error: 'Category ID is required' });
    }

    try {
        const result = await categoryService.deleteCategory(id, userId);

        if (!result) {
            return res.status(403).json({ error: 'You are not authorized to delete this category' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const listCategories = async (req, res) => {
    try {
        const userId = req.userId;
        const categories = await categoryService.listCategories(userId);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default { createCategory, deleteCategory, listCategories };
