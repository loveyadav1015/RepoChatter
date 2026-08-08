import { Router } from 'express';

const router = Router();

// TODO: Integrate with controller / DB layer
router.get('/', (req, res) => {
  res.status(200).json([]);
});

router.get('/:id', (req, res) => {
  res.status(200).json({});
});

router.post('/', (req, res) => {
  res.status(201).json({});
});

router.put('/:id', (req, res) => {
  res.status(200).json({});
});

router.delete('/:id', (req, res) => {
  res.status(204).send();
});

export default router;
