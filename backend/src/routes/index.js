import { Router } from 'express';
import authRoutes from './authRoutes.js';
import noteRoutes from './noteRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/notes', authMiddleware, noteRoutes);
router.use('/categories', authMiddleware, categoryRoutes);

export default router;
