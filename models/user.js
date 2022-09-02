import mongoose from "mongoose";

const Schema=mongoose.Schema;

const userSchema=new Schema({
    name:{
        type:String,required:true
    },
    email:{
        type:String,required:true,unique:true
    },
    password:{
        type:String,required:true
    },
    role:{
        type:String,default:'cutomer'
    }
},{timestamps:true})//time for create and update anything


export default mongoose.model('User',userSchema,'Users')