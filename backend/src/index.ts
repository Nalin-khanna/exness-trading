import type { WebSocket } from "bun";
import { client } from "./lib/db.js";

async function main () {
    await client.connect();
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
        const query = `
  INSERT INTO trade (symbol, price, qty, "Time")
  VALUES ${data.map(d =>
    `('${d.data.s}', ${parseFloat(d.data.p)}, ${parseFloat(d.data.q)}, to_timestamp(${d.data.T} / 1000.0))`
    ).join(",")}`;

        console.log("Inserted ",data.length);
        // clear buffer array 
        data = [];
    }, 10000);
}
main();

