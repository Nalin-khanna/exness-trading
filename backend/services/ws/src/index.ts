import WebSocket from "ws";
import { createClient } from "redis";
import { WebSocketServer } from "ws";

// whenever a client connects , we add it to the clients set
const clients = new Set<WebSocket>();

const start = async () => {
  const wss = new WebSocketServer({port : 8080});
  const redisClient = createClient(); 
  await redisClient.connect();
  console.log("redis connected");
  // on connecting to websocket server add the client to the clients set
  wss.on("connection", (websocket : WebSocket ) => {
    console.log("Client connected");
    clients.add(websocket);
    
    // we will remove the client from set when it disconnects
    websocket.on("close" , () => {
        clients.delete(websocket);
        console.log("Client disconnected");
    })
    
    // and on error
    websocket.on("error" , (error) => {
        clients.delete(websocket);
        console.error("WebSocket error: ", error);
    })
  })

  await redisClient.subscribe("ticks", (message) => {
    
    clients.forEach((client : WebSocket)=> {
        client.send(message);
    })
  }
)
}
start().catch((err)=> console.error(err));