import { Router } from 'express';

const router = Router();

// TODO: Integrate with RAG pipeline (retrieve & generate)
router.post('/ask', (req, res) => {
  res.status(200).json({
    answer: "This is a stub answer. Implement RAG pipeline to get real answers.",
    citations: []
  });
});

export default router;
