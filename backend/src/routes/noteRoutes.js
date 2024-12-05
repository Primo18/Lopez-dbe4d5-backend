import { Router } from 'express';
import noteController from '../controllers/noteController.js';

const router = Router();

router.post('/', noteController.createNote);
router.put('/:id', noteController.updateNote);
router.delete('/:id', noteController.deleteNote);
router.get('/', noteController.getNotes);

export default router;
