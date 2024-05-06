import express from "express";
import { getMeetings, addMeeting, deleteMeeting, updateMeeting, getRoomNames, getUserDatas, getReservedTimForAddMeeting, getReservedTimeForUpdateMeeting, getLocationMeetings, sendEmail } from "../controllers/meeting.js";

const router = express.Router(); //建立路由器

//在路由器上建立get request，當前往這個網址時，產生request
router.get("/roomNames", getRoomNames);              //獲取會議室地點名字            http://localhost:8800/api/roomNames
router.get("/userDatas", getUserDatas);              //獲取所有用戶資料              http://localhost:8800/api/userDatas
router.get("/getMeetings", getMeetings);             //獲取那週所有會議室預約資料     http://localhost:8800/api/getMeetings
router.get("/getLocationMeetings", getLocationMeetings); //獲取特定地點那週所有會議室預約資料 http://localhost:8800/api/getLocationMeetings
router.post("/getReservedTimeForAddMeeting", getReservedTimForAddMeeting);         //查詢是否預約到已經被預約的時段，新增會議使用 http://localhost:8800/api/getReservedTimForAddMeeting
router.post("/getReservedTimeForUpdateMeeting", getReservedTimeForUpdateMeeting);  //查詢是否預約到已經被預約的時段，修改會議使用 http://localhost:8800/api/getReservedTimeForUpdateMeeting
router.post("/addMeeting", addMeeting);              //新增預約                     http://localhost:8800/api/addMeeting
router.delete("/deleteMeeting/:id", deleteMeeting);  //刪除預約                     http://localhost:8800/api/deleteMeeting
router.put("/updateMeeting/:id", updateMeeting);     //修改預約                     http://localhost:8800/api/updateMeeting
router.post("/sendEmail", sendEmail);                //寄信通知申請者和所有與會者

export default router; //導出路由器讓其他模組使用