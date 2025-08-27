import type { WebSocket } from "bun";
import { db } from "./lib/db.js";
async function main () {
    const ws = new WebSocket("wss://fstream.binance.com/stream?streams=btcusdt@aggTrade");
    ws.onopen = () => {
        console.log("connected");
    }
    let data : any[] = [];

    ws.onmessage = (msg) => {
        let object = JSON.parse(msg.data);
        data.push(object);
    }
    
    setInterval(async () => {
        // push data to db
        await db.trade.createMany({
            data : data.map(d => ({
                symbol : d.data.s,
                price : d.data.p,
                qty : d.data.q,
                Time : d.data.T
            })),
        })
        console.log("Inserted ",data.length);
        // clear buffer array 
        data = [];
    }, 10000);
}
main();

