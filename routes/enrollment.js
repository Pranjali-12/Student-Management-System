const express=require('express');
const { verifyToken } = require('../middleware/verifytoken');
const { enrollCourse } = require('../controllers/enrollment');
const router=express.Router();

router.post('/enroll',verifyToken,enrollCourse)

module.exports=router;