const express=require('express');
const { verifyToken } = require('../middleware/verifytoken');
const { enrollCourse, enrolledCourses } = require('../controllers/enrollment');
const router=express.Router();

router.post('/enroll',verifyToken,enrollCourse)
router.get('/getenrolledcourse',verifyToken,enrolledCourses)

module.exports=router;