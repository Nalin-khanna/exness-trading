import express, { type Response } from "express";
import { OpenOrders, users } from "../config/common.ts";
import { Data } from "../config/common.ts";
import { authMiddleware } from "../middleware/authMiddleware.ts";
import { type AuthRequest } from "../middleware/authMiddleware.ts";
import { v4 } from "uuid";
const tradeRouter = express.Router();
const marginDecimals = 2n;
tradeRouter.post("/trade", authMiddleware,  (req : AuthRequest, res : Response)=> {
    let { asset , type , margin , leverage } : {asset : string , type: "buy" | "sell" , margin : bigint , leverage : number} = req.body;
    
    const userId = req.user?.userId;
    if(userId){
    const user = users.find(user => user.userId === userId);
    const uuid = v4();
    if(type === "buy"){
        const curr_ask_price = Data.find(obj => obj.symbol === asset)?.ask;
        if (!curr_ask_price) {
            return res.status(411).json({ message: "Incorrect inputs" });
        }
        user.balance.tradable -= margin;
        user.balance.locked += margin;
        OpenOrders.push({
            orderId : uuid,
            userId,
            type : "buy",
            asset,
            margin,
            leverage,
            openPrice : curr_ask_price
        })
    }
    }
})