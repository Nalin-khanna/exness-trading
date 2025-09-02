import { redisclient } from "./lib/common";

export const setupRedis = async () => {
    await redisclient.connect();
    console.log("Redis connected");
}

export const publish = async (tick : any) => { 
    await redisclient.publish('ticks', JSON.stringify(tick));

}