const express=require('express');
const { userRegistration } = require('../controllers/user');
const router=express.Router();

router.post('/register',userRegistration)

module.exports=router;