import Joi from "joi"
import { RefreshToken, User } from "../../models"
import CustomErrorHandler from "../../services/CustomErrorHandler"
import JwtService from "../../services/JwtService"
import bcrypt from 'bcrypt'
import { REFRESH_SECRET } from "../../config"
const loginController={

    async login(req,res,next){

        const loginSchema=Joi.object({
            email:Joi.string().email().required(),
            password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        })
        const {error}=loginSchema.validate(req.body)
        if(error){
            return next(error)
        }

        try{
            const user=await User.findOne({email:req.body.email});
            if(!user){
                return next(CustomErrorHandler.wrongCredentials());
            }

            //comapre password

            const match=await bcrypt.compare(req.body.password,user.password);

            if (!match){
                return next(CustomErrorHandler.wrongCredentials());
            }

            //token generate if user have correct credentials
            const access_token=JwtService.sign({_id:user._id,role:user.role})
            const refresh_token=JwtService.sign({_id:user._id,role:user.role},'1y',REFRESH_SECRET)

            await RefreshToken.create({token:refresh_token})
            const name=user.name
            const role=user.role
            const id=user._id
           
            res.json({access_token,refresh_token,name,role,id})
        }catch(err){
                return next(err)
        }


    },

    async logout(req,res,next){

        const refreshScehma=Joi.object({
            refresh_token:Joi.string().required(),
        })
        console.log(req.body)
        const {error}=refreshScehma.validate(req.body)
     
        if(error){
            return next(error)
        }

        try{

            await RefreshToken.deleteOne({token:req.body.refresh_token})
        }
        catch(err){
            return next(new Error('Something went wrong in the database'))
        }
        res.json({status:1})
    }
}

export default loginController