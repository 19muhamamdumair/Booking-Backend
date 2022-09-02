import { Product } from "../models"
import multer from 'multer'
import path from 'path'
import CustomErrorHandler from "../services/CustomErrorHandler"
import fs from 'fs'
import Joi from "joi"
const storage=multer.diskStorage({
    destination:(req,file,callback)=>callback(null,'uploads/'),
    filename:(req,file,callback)=>{
        const uniqueName=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`
        
        callback(null,uniqueName)

    }
})

const handleMultipartData=multer({storage,limits:{fileSize:1000000*5}}).single('image')//5mb


const productController={
    async store(req,res,next){
        handleMultipartData(req,res,async(err)=>{
            if(err){
                return next(CustomErrorHandler.serverError(err.message))
            }
            // console.log(req.file)
            const filepath=req.file.path;
           
            const productScehma=Joi.object({
                name:Joi.string().required(),
                price:Joi.string().required(),
                size:Joi.string().required(),
            })
            console.log(req.body)
            const {error}=productScehma.validate(req.body)
           
            if(error)
            {
                debugger
                //delete the uploaded file
                fs.unlink(  `${appRoot}/ ${filepath}`,(err)=>{
                    if(err)
                    {
                        return next(CustomErrorHandler.serverError(err.message))//agr file delete krne me problem hota hai
                    }
                    
                })
                return next(error);//validation error


            }

            const {name,price,size}=req.body;

            let document;
            try{
                document=await Product.create({
                    name,
                    price,
                    size,
                    image:filepath
                })


            }catch(err){
                return next(err);
            }
            res.status(201).json({document})
        })
    }
}
export default productController