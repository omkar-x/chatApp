import "dotenv/config";
import express from "express";
import cors from "cors";
import http, { Server } from "http";
import {connectDB} from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import {Server} from "socket.io";


//create express app and HTTP server
const app = express();
const server = http.createServer(app);

//Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

//store online users
export const userSocketMap = {}; // {userId: socketId}

//socket.io connection hadler
io.on("connection", (socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User connected",userId);

    if(userId) userSocketMap[userId] = socket.id;
    
    //emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("User disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

//Middleware setup
app.use(express.json({limit: "4mb"})); //uploads image of 4mb limit
app.use(cors());  //handlel internetwork requests

//routes setup
app.use("/api/status", (req,res)=> res.send("server is live"));
app.use("/api/auth",userRouter);
app.use("/api/messages", messageRouter)

//connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log("Server is running on the PORT:" + PORT));
