const express=require('express');
const { studentRegistration } = require('../controllers/student');
const router=express.Router();

router.post('/register',studentRegistration)

module.exports=router;