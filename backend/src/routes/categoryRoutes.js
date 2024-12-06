import { Router } from 'express';
import categoryController from '../controllers/categoryController.js';

const router = Router();

router.post('/', categoryController.createCategory);
router.delete('/:id', categoryController.deleteCategory);
router.get('/', categoryController.listCategories);


export default router;
