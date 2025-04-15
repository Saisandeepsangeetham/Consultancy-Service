import express from 'express';
import { handleSubmit, getUserEmailRoute,login,generateOTP, verifyOtp, register,forgotPsd,getSubmissions,getByPI,getByCoPI,getBySanctionedAmountRange, getByIndustryName} from '../Controller/userController.js';


const router = express.Router();
router.post('/login', login);
router.post('/register', register);
router.post('/submit',handleSubmit);
router.put("/forgotPsd",forgotPsd);
router.get("/user/email",getUserEmailRoute);
router.get("/getData",getSubmissions);
router.get("/getDataByPI/:pi",getByPI);
router.get("/getDataBycoPI/:coPI",getByCoPI);
router.get("/getDataByIndustryName/:industryName",getByIndustryName);
router.post("/generateOTP", generateOTP);
router.post("/verifyOTP", verifyOtp);


router.get("/getDataBySanctionAmt/:minAmount/:maxAmount",getBySanctionedAmountRange);



export default router;