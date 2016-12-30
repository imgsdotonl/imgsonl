import express from 'express';
import * as ctrl from './upload.controller';

const router = express.Router();

router.post('/', ctrl.uploadImage);
router.post('/url', ctrl.uploadFromUrl);
router.get('/:imageId', ctrl.getImage);

export default router;
