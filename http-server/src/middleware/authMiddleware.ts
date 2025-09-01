import express, { type NextFunction } from "express"
import { type Request ,type Response } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config/config.ts"
import { users } from "../config/common.ts"
export interface AuthRequest extends Request {
    user? : {
        userId : String
    }
}
export const authMiddleware =  (req : AuthRequest , res : Response, next : NextFunction ) => {
    const token = req.headers.authorization;
    if(token){
        const userDetails :any = jwt.verify(token , config.JWT_SECRET);
        req.user = { userId : userDetails.userId };
        next()
    }else{
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
}