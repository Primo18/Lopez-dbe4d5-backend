import { Router } from 'express';
import noteController from '../controllers/noteController.js';

const router = Router();

router.post('/', noteController.createNote);
router.patch('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.get('/', noteController.getNotes);

// Phase 2
router.post('/:id/categories', noteController.addCategoriesToNote);
router.get('/categories', noteController.getNotesByCategory);
router.get('/:id/categories', noteController.getCategoriesForNote);
router.delete('/:id/categories/:categoryId', noteController.removeCategoryFromNote);

export default router;
