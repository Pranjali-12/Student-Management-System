const express=require('express');
const { studentRegistration, studentLogin } = require('../controllers/student');
const router=express.Router();

router.post('/register',studentRegistration)
router.get('/login',studentLogin)

module.exports=router;