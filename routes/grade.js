const express=require('express');
const { verifyToken } = require('../middleware/verifytoken');
const { markGrade } = require('../controllers/grade');
const router=express.Router();

router.post('/addgrade',verifyToken,markGrade)

module.exports=router;