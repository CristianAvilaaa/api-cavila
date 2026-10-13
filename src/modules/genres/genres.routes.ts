import { Router } from 'express';
import { GenreController } from './genres.controller';
import { asyncHandler } from '../../shared/middlewares/asyncHandler';

const router = Router();

router.get('/', asyncHandler(GenreController.getAll));
router.get('/:id', asyncHandler(GenreController.getById));
router.post('/', asyncHandler(GenreController.create));
router.put('/:id', asyncHandler(GenreController.update));
router.delete('/:id', asyncHandler(GenreController.delete));

export default router;