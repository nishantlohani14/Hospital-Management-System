import express from "express";
import {config} from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

const app=express();
config({path:"./config/config.env"});

//creating middleware to connect to the frontend
app.use(
  cors({
    origin:[process.env.FRONTEND_URL,process.env.DASHBOARD_URL],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,
})
);

//following is the middle wares for cookies
app.use(cookieParser());
//data ko json m parse krne k liye
app.use(express.json());
//ye data like name:string date:dd/mm/yy k format ko recognise krne k liye h
app.use(express.urlencoded({extended:true}));
//middleware to upload file
app.use(
  fileUpload({
  useTempFiles:true,
  tempFileDir:"/tmp/",//based on documentation
})
);
// app.use() is a method in Express.js used to mount middleware functions at a specified path
app.use("/api/v1/message",messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

dbConnection();

app.use(errorMiddleware);
export default app;