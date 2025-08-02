import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import {connectDB} from "./lib/db.js";

//create express app and HTTP server
const app = express();
const server = http.createServer(app);

//Middleware setup
app.use(express.json({limit: "4mb"})); //uploads image of 4mb limit
app.use(cors());

app.use("/api/status", (req,res)=> res.send("server is live"));

//connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log("Server is running on the PORT:" + PORT));
