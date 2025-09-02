import { pgclient, redisClient } from "./config/lib.ts";
import express , {type Request , type Response} from "express";
import { authRouter } from "./controllers/auth.ts";
import {type PricesObject , Data} from "./config/common.ts";
import { subscribe } from "./subscribe/sub.ts";
const app = express();
const port = 3000;
pgclient
  .connect()
  .then(() => console.log("Connected to TimescaleDB"))
  .catch((err) => console.error("DB connection error:", err));
subscribe();
app.use(express.json());
app.use("/api/v1",authRouter)
app.get("/candles", async (req: Request, res: Response) => {
    let { asset, startTime, endTime, ts } = req.query;

    let viewName = "";
    if (ts === "1m") viewName = "trade_1m";
    else if (ts === "5m") viewName = "trade_5m";
    else if (ts === "1h") viewName = "trade_1h";
    else return res.status(400).json({ error: "Invalid time parameter" });

    try {
        // Convert Unix timestamps to JavaScript Date objects
        const startDate = new Date(Number(startTime) * 1000);
        const endDate = new Date(Number(endTime) * 1000);

        const params = [asset, startDate, endDate];

        const query = `SELECT open, high, low, close FROM ${viewName} 
            WHERE symbol = $1 AND bucket >= $2 AND bucket <= $3 
            ORDER BY bucket DESC;`;

        console.log(query, params);
        const response = await pgclient.query(query, params);
        console.log(response);
        res.json(response.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen ( port , () => {
    console.log(`Server started at http://localhost:${port}`);
})