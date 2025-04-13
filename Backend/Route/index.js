import express from 'express';
import { handleSubmit, login, register,forgotPsd,getSubmissions,getByPI,getByCoPI,getBySanctionedAmountRange, getByIndustryName} from '../Controller/userController.js';


const router = express.Router();
router.post('/login', login);
router.post('/register', register);
router.post('/submit',handleSubmit);
router.put("/forgotPsd",forgotPsd);
router.get("/getData",getSubmissions);
router.get("/getDataByPI/:pi",getByPI);
router.get("/getDataBycoPI/:coPI",getByCoPI);
router.get("/getDataByIndustryName/:industryName",getByIndustryName);

router.get("/getDataBySanctionAmt/:minAmount/:maxAmount",getBySanctionedAmountRange);



export default router;