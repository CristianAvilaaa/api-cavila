import { Router } from 'express';
import categoryRoutes from '../../modules/categories/category.routes';
import taskRoutes from '../../modules/tasks/task.routes';

const router = Router();

router.use('/tasks', taskRoutes);
router.use('/category', categoryRoutes);

export default router;