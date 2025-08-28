import type { WebSocket } from "bun";
import { pgclient } from "./lib/common";
import { setupContinousAggregate } from "./aggregate";
import { publish } from "./pub";
import { setupRedis } from "./pub";
async function main () {
    await pgclient.connect();
    await setupRedis();
    // await setupContinousAggregate();
    const ws = new WebSocket("wss://fstream.binance.com/stream?streams=btcusdt@aggTrade");
    ws.onopen = () => {
        console.log("connected");

    }
    let data : any[] = [];

    ws.onmessage = async (msg) => {
        let object = JSON.parse(msg.data);
        data.push(object);

        // creating bids and asks with 0.05% spread
        const price = parseFloat(object.data.p);
        const spreadPct = 0.0005; // 0.05%
        const bid = price * (1 - spreadPct / 2);
        const ask = price * (1 + spreadPct / 2);
        const payload = {
            symbol : object.data.s,
            bid : bid,
            ask : ask,
            price : price,
            qty : parseFloat(object.data.q),
            time : object.data.T/1000.0 
        }
        await publish(payload);
    }
    
    setInterval(async () => {
        // push data to db
        const query = `
    INSERT INTO stream_data (symbol, price, qty, time)
    VALUES ${data.map(d =>
    `('${d.data.s}', ${parseFloat(d.data.p)}, ${parseFloat(d.data.q)}, to_timestamp(${d.data.T} / 1000.0))`
    ).join(",")}`;
        await pgclient.query(query);
        console.log("Inserted ",data.length);
        // clear buffer array 
        data = [];
    }, 10000);
}
main();

