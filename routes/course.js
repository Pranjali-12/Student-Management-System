const express=require('express');
const { verifyToken } = require('../middleware/verifytoken');
const { addCourse } = require('../controllers/course');
const router=express.Router();

router.post('/add',verifyToken,addCourse)

module.exports=router;