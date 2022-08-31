const express=require('express');
const router=express.Router();
const multer=require('multer');
const storage=multer.memoryStorage();
const upload=multer({storage:storage});

const middleware=require('../../service/middleware').middleware;
const UserRoute=require('./user');
const AdminRoute=require('./admin');


router.use(middleware);
router.use('/user',UserRoute);
router.use('/admin',AdminRoute);

module.exports=router