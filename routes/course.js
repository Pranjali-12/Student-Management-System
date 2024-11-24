const express=require('express');
const { verifyToken } = require('../middleware/verifytoken');
const { addCourse, getAllCourses } = require('../controllers/course');
const router=express.Router();

router.post('/add',verifyToken,addCourse)
router.get('/getcourse',getAllCourses)

module.exports=router;