//修改表單
import { useState, useEffect } from 'react';
import moment from 'moment';
import AttendeeSectionUpdateForm from './AttendeeSectionUpdateForm';
import { validFormBlankFields } from './ValidFormBlankFields';
import { BlankFieldsWarning, ReservationPastTimeWarning, UpdateReservationSuccess, EndTimeEarlierWarning, SameTimeWarning, ReservedTimeWarning } from "./ShowMessage";
import axios from "axios";
import { PiUserCircleDuotone } from "react-icons/pi";

const UpdateForm = ({ slot, event, handleCloseForm }) => {
    const [reservationId, setReservationId] = useState(''); //會議編號
    const [subject, setSubject] = useState('');            //主題

    const [selectedApplicantEmployeeId, setSelectedApplicantEmployeeId] = useState(''); //被選中的申請者工號
    const [selectedApplicantName, setSelectedApplicantName] = useState('');             //被選中的申請者姓名
    const [selectedApplicantEmail, setSelectedApplicantEmail] = useState('');           //被選中的申請者email
   
    const [selectedAttendeesEmployeeId, setSelectedAttendeesEmployeeId] = useState([]); //被選中的所有與會者工號列表
    const [selectedAttendeesName, setSelectedAttendeesName] = useState([]);             //被選中的所有與會者姓名列表
    const [selectedAttendeesEmail, setSelectedAttendeesEmail] = useState([]);           //被選中的所有與會者email列表
    
    const [location, setLocation] = useState('第一會議室'); //地點
    const [date, setDate] = useState('');                  //日期
    const [startTime, setStartTime] = useState('');        //開始時間
    const [endTime, setEndTime] = useState('');            //結束時間

    //已預約的會議event資料
    useEffect(() => {
        if (event) {
            // 將 event 中的資料放到相應的狀態中
            setReservationId(event.reservation_id);                       //會議編號
            setSubject(event.subject);                                    //主題
            setSelectedApplicantEmployeeId(event.applicant_employee_id)   //申請者工號
            setSelectedApplicantName(event.applicant_name);               //申請者姓名
            setSelectedApplicantEmail(event.applicant_email);             //申請者email

            if (event.attendees_employee_id) {
                setSelectedAttendeesEmployeeId(event.attendees_employee_id.split(',')); //與會者工號
            }
            if (event.attendees_name) {                                 
                setSelectedAttendeesName(event.attendees_name.split(',')); //與會者姓名
            }      
            if (event.attendees_email) {
                setSelectedAttendeesEmail(event.attendees_email.split(',')); //與會者email         
            }    
            setLocation(event.location_name);                             //地點
            setDate(moment(event.reservation_date).format('YYYY-MM-DD')); //日期
            setStartTime(event.start_time.substring(0, 5));               //開始時間
            setEndTime(event.end_time.substring(0, 5));                   //結束時間
        }
    }, [event]);

    const apiurl = "http://localhost:8800/api"
   
    //獲取所有會議室地點名字
    const [roomNames, setRoomNames] = useState([]);
    useEffect(() => {
        const fetchAllRoomName = async () => {
            try {
                const res = await axios.get(`${apiurl}/roomNames`);
                setRoomNames(res.data);
            } catch(err) {
                console.log(err);
            } 
        };
        fetchAllRoomName();
    }, []);

    //修改會議預約 http://localhost:8800/api/updateMeeting
    const updateMeeting = async (updateReservationData) => {
        try {
            const res = await axios.put(`${apiurl}/updateMeeting/${reservationId}`, updateReservationData);
            console.log(res.data)
            
            setShowUpdateReservationSuccess(true); //顯示修改預約成功訊息
            setTimeout(() => {
                setShowUpdateReservationSuccess(false);
                handleCloseForm(); //顯示修改預約成功訊息後關閉修改表單
            }, 2500);
        } catch (err) {
            console.error("Error updating meeting:", err);
            // 若更新失敗，顯示錯誤訊息
            // 這裡你可以根據具體情況設置一個錯誤提示框
        }
    };
    
    const [showUpdateReservationSuccess, setShowUpdateReservationSuccess] = useState(false);     //是否顯示預約修改成功訊息
    const [blankFields, setBlankFields] = useState([]);                                          //檢查預約表單中的所有欄位，有沒有空值
    const [showBlankFieldsWarning, setShowBlankFieldsWarning] = useState(false);                 //是否顯示警告訊息: 預約表單中的所有欄位是否都有值
    const [showReservationPastTimeWarning, setShowReservationPastTimeWarning] = useState(false); //是否顯示警告訊息: 預約到過去的日期或時段
    const [showEndTimeEarlierWarning, setShowEndTimeEarlierWarning] = useState(false)            //是否顯示警告訊息: 預約表單中的結束時間比開始時間早
    const [showSameTimeWarning, setShowSameTimeWarning] = useState(false)                        //是否顯示警告訊息: 預約表單中的開始時間和結束時間相同
    const [showReservedTimeWarning, setShowReservedTimeWarning] = useState(false);               //是否顯示警告訊息: 預約到已經被預約的時段
    //送出修改表單
    const handleSubmit = async (e) => {
        e.preventDefault();   
        //預約修改資料
        const updateReservationData = {
            subject,                                                //主題
            selectedApplicantEmployeeId,                            //申請者工號
            selectedApplicantName,                                  //申請者姓名
            selectedApplicantEmail,                                 //申請者email
            selectedAttendeesEmployeeId,                            //所有與會者工號
            selectedAttendeesName,                                  //所有與會者姓名
            selectedAttendeesEmail,                                 //所有與會者email
            location,                                               //地點
            date: moment(date).format('YYYY-MM-DD'),                //日期     修改成mysql date格式
            start_time: moment(startTime, 'HH:mm').format('HH:mm'), //開始時間，修改成mysql time格式
            end_time: moment(endTime, 'HH:mm').format('HH:mm'),     //結束時間，修改成mysql time格式
        }
        console.log("預約修改資料: ", updateReservationData); //印出預約修改資料updateReservationData
        //檢查是否預約到已經被預約的時段
        const checkReservedTime = async () => {
            try {
                const res = await axios.post(`${apiurl}/getReservedTimeForUpdateMeeting`, {
                    location,
                    date,
                    start_time: startTime,
                    end_time: endTime,
                    original_start_time: event.start_time, // 要修改的這個會議的原始開始時間
                    original_end_time: event.end_time      // 要修改的這個會議的原始結束時間
                });
                return res.data.reserved;
            } catch (err) {
                console.error(err);
                return false;
            }
        };

        const currentTime = moment(); //現在時間
        const selectedDateStartTime = moment(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm');
        const selectedDateEndTime = moment(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm');
        const isReservedTime = await checkReservedTime();
        //檢查所有條件
        if (
            //檢查預約表單中的所有欄位是否都有值
            !validFormBlankFields(subject, selectedApplicantName, selectedAttendeesName, location, date, startTime, endTime, setBlankFields, setShowBlankFieldsWarning) ||
            //檢查開始時間和結束時間是否相同
            startTime === endTime ||
            //檢查預約表單中的結束時間是否比開始時間早
            selectedDateEndTime.isBefore(selectedDateStartTime) ||
            //檢查預約到過去的日期或時段
            selectedDateStartTime.isBefore(currentTime) || selectedDateEndTime.isBefore(currentTime) ||
            //檢查預約到已經被預約的時段
            isReservedTime
        ) {
            //顯示對應的警告訊息
            //顯示警告訊息: 預約表單中的所有欄位是否都有值
            if (!validFormBlankFields(subject, selectedApplicantName, selectedAttendeesName, location, date, startTime, endTime, setBlankFields, setShowBlankFieldsWarning)) {
                setShowBlankFieldsWarning(true);
            }

            //顯示警告訊息: 開始時間和結束時間相同
            if(startTime === endTime) {
                setShowSameTimeWarning(true);
            }

            //顯示警告訊息: 預約表單中的結束時間比開始時間早
            if(selectedDateEndTime.isBefore(selectedDateStartTime)) {
                setShowEndTimeEarlierWarning(true);
            }

            //顯示警告訊息: 預約到過去的日期或時段
            if (selectedDateStartTime.isBefore(currentTime) || selectedDateEndTime.isBefore(currentTime)) {
                setShowReservationPastTimeWarning(true);
            }

            //顯示警告訊息: 預約到已經被預約的時段
            if (isReservedTime) {
                setShowReservedTimeWarning(true);
            }

            //設定警示訊息只顯示2.5秒
            setTimeout(() => {
                setShowBlankFieldsWarning(false);
                setShowEndTimeEarlierWarning(false);
                setShowReservationPastTimeWarning(false);
                setShowSameTimeWarning(false);
                setShowReservedTimeWarning(false);
            }, 2500);
            
        } else {
            updateMeeting(updateReservationData); //檢查所有條件都通過才可以修改會議室預約
        }
    };

    //點擊的格子對應的日期和開始時間
    useEffect(() => {
        if (slot) {
            const date = moment(slot.date).format('YYYY-MM-DD'); //點擊格子對應的日期
            const startTime = moment(slot.date).format('HH:mm'); //點擊格子對應的開始時間
            const endTime = moment(slot.endTime).format('HH:mm') //點擊格子對應的結束時間
            setDate(date);
            setStartTime(startTime);
            setEndTime(endTime);
        }
    }, [slot]);

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="bg-[#caddff] shadow-md rounded-2xl px-8 pt-6 pb-8 mb-4">
                <h1 className="text-2xl mb-4 text-center font-MochiyPopOne text-[#5479f7]">修改預約</h1>
                <div className="mb-4">
                    <label className="block font-MochiyPopOne text-[#3f8cf4] text-md mb-2" htmlFor="subject">
                        會議預約編號
                    </label>
                    <input
                        className="shadow font-MochiyPopOne appearance-none border-2 rounded w-full py-2 px-3 text-[#3f8cf4] leading-tight border-[#5479f7] focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2"
                        id="subject"
                        type="text"
                        value={reservationId}
                        readOnly
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block font-MochiyPopOne text-[#3f8cf4] text-md mb-2" htmlFor="subject">
                        主題
                    </label>
                    <input
                        className="shadow font-MochiyPopOne appearance-none border-2 rounded w-full py-2 px-3 text-[#3f8cf4] leading-tight border-[#5479f7] focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2"
                        id="subject"
                        type="text"
                        value={subject}
                        readOnly
                    />
                </div>

                {/* 申請者 */}
                <div className="mb-4">
                    <label className="block font-MochiyPopOne text-[#3f8cf4] text-md mb-2">申請者</label>
                    {/* 姓名badge */}
                    <div className="grid grid-cols-4 gap-1 font-MochiyPopOne">
                        <div className="badge text-[#3f8cf4] bg-[#ffffff] border-2 border-[#5479f7] h-8 mb-2 mt-1">
                            <PiUserCircleDuotone size={25} className="mr-1"/>
                            {selectedApplicantName}
                        </div>
                    </div>
                </div>

                {/* 與會者 */}
                <AttendeeSectionUpdateForm
                   selectedAttendeesEmployeeId={selectedAttendeesEmployeeId}
                   setSelectedAttendeesEmployeeId={setSelectedAttendeesEmployeeId}
                   selectedAttendeesName={selectedAttendeesName}
                   setSelectedAttendeesName={setSelectedAttendeesName}
                   selectedAttendeesEmail={selectedAttendeesEmail}
                   setSelectedAttendeesEmail={setSelectedAttendeesEmail}
                />

                <div className="mb-4">
                    <label className="block font-MochiyPopOne text-[#3f8cf4] text-md mb-2">地點</label>
                    <select
                        className="select font-MochiyPopOne text-[#3f8cf4] mt-1 p-2 w-full border-2 border-[#5479f7] rounded-md py-2 focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2"
                        value={location}
                        onChange={(e) => {setLocation(e.target.value)}}                        
                    >
                    {/* 顯示資料庫地點表中的所有會議室地點名字 */}
                    {roomNames.map((roomname, index) => (
                        <option key={index} value={roomname.room_name}>{roomname.room_name}</option>
                    ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block font-MochiyPopOne text-md text-[#3f8cf4] mb-2" htmlFor="date">
                        日期
                    </label>
                    <input
                        className="shadow font-MochiyPopOne appearance-none border-2 rounded w-full py-2 px-3 text-[#3f8cf4] leading-tight border-[#5479f7] focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2"
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        readOnly
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-MochiyPopOne text-[#3f8cf4] text-md mb-2" htmlFor="startTime">
                        開始時間
                    </label>
                    <select
                        className="select font-MochiyPopOne text-[#3f8cf4] mt-1 p-2 w-full border-2 border-[#5479f7] rounded-md py-2 focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    >
                        <option>09:00</option>
                        <option>09:30</option>
                        <option>10:00</option>
                        <option>10:30</option>
                        <option>11:00</option>
                        <option>11:30</option>
                        <option>12:00</option>
                        <option>12:30</option>
                        <option>13:00</option>
                        <option>13:30</option>
                        <option>14:00</option>
                        <option>14:30</option>
                        <option>15:00</option>
                        <option>15:30</option>
                        <option>16:00</option>
                        <option>16:30</option>
                        <option>17:00</option>
                        <option>17:30</option>
                        <option>18:00</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block font-MochiyPopOne text-[#3f8cf4] text-md mb-2" htmlFor="startTime">
                        結束時間
                    </label>
                    <select
                        className="select font-MochiyPopOne text-[#3f8cf4] mt-1 p-2 w-full border-2 border-[#5479f7] rounded-md py-2 focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    >
                        <option>09:00</option>
                        <option>09:30</option>
                        <option>10:00</option>
                        <option>10:30</option>
                        <option>11:00</option>
                        <option>11:30</option>
                        <option>12:00</option>
                        <option>12:30</option>
                        <option>13:00</option>
                        <option>13:30</option>
                        <option>14:00</option>
                        <option>14:30</option>
                        <option>15:00</option>
                        <option>15:30</option>
                        <option>16:00</option>
                        <option>16:30</option>
                        <option>17:00</option>
                        <option>17:30</option>
                        <option>18:00</option>
                    </select>
                </div>
                {/* 顯示會議室預約修改成功訊息 */}             
                {showUpdateReservationSuccess && <UpdateReservationSuccess /> }
                {/* 顯示警示訊息: 修改表單中的所有欄位是否都有值 */}
                {showBlankFieldsWarning && <BlankFieldsWarning blankFields={blankFields} />}
                {/* 顯示警示訊息: 預約到過去的日期或時段 */}             
                {showReservationPastTimeWarning && <ReservationPastTimeWarning /> }
                {/* 顯示警告訊息: 修改表單中的結束時間比開始時間早 */}
                {showEndTimeEarlierWarning && <EndTimeEarlierWarning />}
                {/* 顯示警告訊息: 修改表單中的開始時間和結束時間相同 */}
                {showSameTimeWarning && <SameTimeWarning />}
                {/* 顯示警告訊息: 預約到已經被預約的時段 */}
                {showReservedTimeWarning && <ReservedTimeWarning />}
            
                <div className="flex flex-wrap justify-center space-x-6">
                    <button onClick={handleCloseForm} className="btn btn-outline font-MochiyPopOne font-thin bg-[#e1ebff] text-lg text-[#3f8cf4] py-2 px-12 hover:bg-[#5479f7] hover:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6283f0] focus:ring-offset-2 my-2 border-2 border-[#5479f7]">取消</button>
                    <button type="submit" className="btn btn-outline font-MochiyPopOne font-thin bg-[#f8f9fc] text-lg text-[#3f8cf4] py-2 px-12 hover:bg-[#5479f7] hover:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6283f0] focus:ring-offset-2 my-2 border-2 border-[#5479f7]">修改</button>
                </div>
            </form>
        </div>
    );
};
export default UpdateForm;