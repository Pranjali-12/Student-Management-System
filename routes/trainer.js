const express=require('express');
const { trainerRegistration } = require('../controllers/trainer');
const router=express.Router();

router.post('/register',trainerRegistration)

module.exports=router;