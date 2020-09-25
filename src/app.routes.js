import { Router } from 'express';

import * as listController from './app.controller';

const router = Router();

router.get('/list', listController.getList);

export default router;