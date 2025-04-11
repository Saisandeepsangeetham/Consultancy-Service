import express from 'express';
import { handleSubmit, login, register } from '../Controller/userController.js';


const router = express.Router();
router.post('/login', login);
router.post('/register', register);
router.post('/submit',handleSubmit);

export default router;