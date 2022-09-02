import express from "express";
import {loginController, registerController, userController,refreshController} from "../controllers";
import auth from "../middlewares/auth";
import productController from "../controllers/productController";
const router=express.Router()

router.post('/register',registerController.register)

router.post('/login',loginController.login)

router.get('/me',auth,userController.me)

router.post('/refresh',refreshController.refresh)

router.post('/logout',auth,loginController.logout)
//logout wohi ker skta hai jiske pass valid token ho


router.post('/products',productController.store)

export default router