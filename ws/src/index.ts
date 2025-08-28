import WebSocket from "ws";
import { createClient } from "redis";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
// whenever a client connects , we add it to the clients set
const clients = new Set<WebSocket>();

const start = async () => {
  const redisClient = createClient(); 
  await redisClient.connect();
  
  // on connecting to websocket server add the client to the clients set
  wss.on("connection", (websocket : WebSocket ) => {
    clients.add(websocket);
    console.log("Client connected");

    // we will remove the client from set when it disconnects
    wss.on("close" , () => {
        clients.delete(websocket);
        console.log("Client disconnected");
    })
    
    // and on error
    wss.on("error" , (error) => {
        clients.delete(websocket);
        console.error("WebSocket error: ", error);
    })
  })

  redisClient.subscribe("ticks", (message) => {
    const data = JSON.parse(message);

    clients.forEach((client : WebSocket)=> {
        client.send(JSON.stringify(data));
    })
  }
)
}
start();