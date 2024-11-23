const express=require('express');
const { trainerRegistration, trainerLogin } = require('../controllers/trainer');
const router=express.Router();

router.post('/register',trainerRegistration)
router.get('/login',trainerLogin)

module.exports=router;