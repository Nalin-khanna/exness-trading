import { redisclient } from "./lib/common";

export const setupRedis = async () => {
    await redisclient.connect();
    console.log("Redis connected");
}

export const publish = async (tick : any) => { 
    console.log("Redis connected");
    await redisclient.publish('ticks', JSON.stringify(tick));
    console.log("Published to Redis");
}