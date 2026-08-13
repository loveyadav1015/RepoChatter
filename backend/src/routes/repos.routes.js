import { Router } from 'express';
import * as reposController from '../controllers/repos.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', requireAuth, reposController.addRepo);
router.get('/', reposController.listRepos);
router.get('/:id', reposController.getRepoDetails);
router.delete('/:id', requireAuth, reposController.removeRepo);
router.post('/:id/chat', reposController.chatWithRepo);

export default router;
