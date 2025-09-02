import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 } from "uuid";
import {sign} from "jsonwebtoken"
import { users } from "../config/common.ts";
export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET!;
authRouter.post("/signup" , async (req , res , next) => {
    const {email  , password } : {email : string , password : string} = req.body;
    if (email && password){
        const user = users.find(user => email === user.email);
        if(!user){
            const hashedpassword = await bcrypt.hash(password , 10);
            let userId = v4();
            users.push(
               {email,
                password : hashedpassword,
                userId,
                balance : {
                        tradable : 500000n , // 5000 USD 2 decimals 
                }
            }
            )
            return res.status(200).json({userId: userId})
        }else{
            return res.status(403).json({message: "Error while signing up"});
        }
    }
    else{
        return res.status(403).json({message: "Error while signing up"})
    }
})

authRouter.post("signin" , (req,res , next)=>{
    const {email , password} = req.body;
    if(!email && !password){
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
    const user = users.find(user => email === user.email && password === user.password);
    if(!user){
           return res.status(403).json({
            message: "Incorrect credentials"
    })
    }
    const jwt_token = sign({
        email : email ,
        userId : user.userId
    },JWT_SECRET); 
    user.token = jwt_token;
    return res.status(200).json({token : jwt_token})
})