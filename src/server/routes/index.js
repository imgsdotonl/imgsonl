import express from 'express';
import uploadRoutes from './upload/upload.routes';

const router = express.Router();

router.get('/health-check', (req, res) =>
  res.status(200).json('OK, it works'),
);

router.use('/uploads', uploadRoutes);

export default router;
