import { Router } from 'express';
import * as reposController from '../controllers/repos.controller.js';

const router = Router();

router.post('/', reposController.addRepo);
router.get('/', reposController.listRepos);
router.get('/:id', reposController.getRepoDetails);
router.delete('/:id', reposController.removeRepo);
router.post('/:id/chat', reposController.chatWithRepo);

export default router;
