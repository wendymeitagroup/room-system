import express from "express";
import meetingRoutes from "./routes/meeting.js";
import cors from "cors";

const app = express(); //建立express app

app.use(express.json()); //解析json格式的request
app.use(cors());

app.use('/api/', meetingRoutes) //http://localhost:8800/api/

//監聽8800port的request，並啟動server做連接
app.listen(8800, () => {
    console.log("Connection succeeded") //server連接成功
});