import { redisClient } from "../config/config.ts";
import { Data } from "../config/common.ts";
export const subscribe = async () => {
    try{
    await redisClient.connect();
    redisClient.subscribe("ticks" , (message : any)=> {
        if(message.symbol){
            let obj = Data.find(data => data.symbol === message.symbol);
            if(obj){
                obj.ask = message.ask;
                obj.bid = message.bid;
                obj.price = message.price
            }
        }
    })
    }
    catch(err){
        console.log(err);
    }
}
