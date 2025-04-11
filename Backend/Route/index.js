import express from 'express';
import { handleSubmit, login, register,forgotPsd} from '../Controller/userController.js';


const router = express.Router();
router.post('/login', login);
router.post('/register', register);
router.post('/submit',handleSubmit);
router.put("/forgotPsd",forgotPsd);

export default router;