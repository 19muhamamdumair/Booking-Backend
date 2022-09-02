import Joi from "joi"
import { REFRESH_SECRET } from "../../config"
import { RefreshToken, User } from "../../models"
import CustomErrorHandler from "../../services/CustomErrorHandler"
import JwtService from "../../services/JwtService"

const refreshToken={

    async refresh(req,res,next){

        const refreshScehma=Joi.object({
            refresh_token:Joi.string().required(),
        })

        const {error}=refreshScehma.validate(req.body)

        if(error){
            return next(error)
        }
        let receivedrefreshtoken;

        try{
            receivedrefreshtoken=await RefreshToken.findOne({token:req.body.refresh_token})

            if(!receivedrefreshtoken)
            {
                return next(CustomErrorHandler.unAuthorized('Invalid Refresh Token'))

            }
            let userId
            try{
                const {_id}=await JwtService.verify(receivedrefreshtoken.token,REFRESH_SECRET)
                userId=_id;
            }catch(err)
            {
                return next(CustomErrorHandler.unAuthorized('Invalid Refresh Token'))
            }

            const user=User.findOne({_id:userId})

            if(!user){
                return next(CustomErrorHandler.unAuthorized('No user found!'))
            }

            //tokens generation

            const access_token=JwtService.sign({_id:user._id,role:user.role})
            const refresh_token=JwtService.sign({_id:user._id,role:user.role},'1y',REFRESH_SECRET)

            await RefreshToken.create({token:refresh_token})
            res.json({access_token,refresh_token})

        }catch(err)
        {
            return next(new Error )
        }


    }
}
export default refreshToken