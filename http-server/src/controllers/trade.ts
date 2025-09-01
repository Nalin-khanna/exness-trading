import express, { type Response } from "express";
import { users } from "../config/common.ts";
import { redisClient } from "../config/lib.ts";
import { Data } from "../config/common.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { type AuthRequest } from "../middleware/authMiddleware.ts";
const tradeRouter = express.Router();
// true value =  margin + (decimals / 10n**marginDecimals)
const marginDecimals = 2n;
tradeRouter.post("/trade", authMiddleware,  (req : AuthRequest, res : Response)=> {
    let { asset , type , margin , leverage } : {asset : string , type: "buy" | "sell" , margin : bigint , leverage : number} = req.body;
    const decimals = margin%(10n ** marginDecimals);
    margin = margin/(10n ** marginDecimals);
    if (type === "buy"){
        const userId = req.user?.userId;
        
    }
})