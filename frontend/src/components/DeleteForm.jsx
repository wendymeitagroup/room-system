//刪除表單
import { useState, useEffect } from 'react';
import moment from 'moment';
import { DeleteReservationSuccess } from "./ShowMessage";
import axios from "axios";
import { PiUserCircleDuotone } from "react-icons/pi";

const DeleteForm = ({ event, handleCloseForm }) => {
    const [reservationId, setReservationId] = useState(''); //會議編號
    const [subject, setSubject] = useState('');            //主題
    const [selectedApplicantName, setSelectedApplicantName] = useState('');   //被選中的申請者名字
    const [selectedAttendeesNames, setSelectedAttendeesNames] = useState([]); //被選中的與會者名字列表
    const [location, setLocation] = useState('第一會議室'); //地點
    const [date, setDate] = useState('');                  //日期
    const [startTime, setStartTime] = useState('');        //開始時間
    const [endTime, setEndTime] = useState('');            //結束時間
    const [showDeleteReservationSuccess, setShowDeleteReservationSuccess] = useState(false); //是否顯示刪除預約成功訊息
    
    //已預約的會議event資料
    useEffect(() => {
        if (event) {
            // 將 event 中的資料放到相應的狀態中
            setReservationId(event.reservation_id); // 會議編號
            setSubject(event.subject); // 主題
            setSelectedApplicantName(event.applicant_name); // 申請者
            setSelectedAttendeesNames(event.attendees_name.split(',')); // 與會者
            setLocation(event.location_name); // 地點
            setDate(moment(event.reservation_date).format('YYYY-MM-DD')); // 日期
            setStartTime(event.start_time.substring(0, 5)); // 開始時間
            setEndTime(event.end_time.substring(0, 5)); // 結束時間
        }
    }, [event]);

    const apiurl = "http://localhost:8800/api"
    //刪除會議預約
    const deleteMeeting = async () => {
        try {
            await axios.delete(`${apiurl}/deleteMeeting/${reservationId}`);
            // 執行刪除後的其他操作
            setShowDeleteReservationSuccess(true) //顯示刪除預約成功訊息
            setTimeout(() => {
                setShowDeleteReservationSuccess(false)
                handleCloseForm(); //顯示刪除預約成功訊息後關閉刪除表單再重新加載那週所有會議室預約資料
            }, 2500);
        } catch (error) {
            console.error("Error deleting meeting:", error);
        }
    };    
    
    return (
        <>
            <div className="w-full max-w-md mx-auto">
                <form className="bg-[#caddff] shadow-md rounded-2xl px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-2xl mb-4 text-center font-MochiyPopOne text-[#5479f7]">刪除預約</h1>
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
                    <div className="mb-4">
                        <label className="block font-MochiyPopOne text-[#3f8cf4] text-md mb-2">與會者</label>
                        {/* 姓名Badge */}
                        <div className="grid grid-cols-4 gap-1 font-MochiyPopOne mt-3">
                            {selectedAttendeesNames.map((attendee, index) => (
                                <div key={index} className="badge text-[#3f8cf4] bg-[#ffffff] border-2 border-[#5479f7] h-8 mb-2 mt-1">
                                    <PiUserCircleDuotone size={25} className="mr-1"/>
                                    {attendee}
                                </div>
                            ))}
                        </div>
                    </div>
              
                    <div className="mb-4">
                        <label className="block font-MochiyPopOne text-[#3f8cf4] text-md mb-2">地點</label>
                        <input
                            className="shadow font-MochiyPopOne appearance-none border-2 rounded w-full py-2 px-3 text-[#3f8cf4] leading-tight border-[#5479f7] focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2"
                            value={location}
                            readOnly
                        />
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
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-MochiyPopOne text-[#3f8cf4] text-md mb-2" htmlFor="startTime">
                            開始時間
                        </label>
                        <input
                            className="shadow font-MochiyPopOne appearance-none border-2 rounded w-full py-2 px-3 text-[#3f8cf4] leading-tight border-[#5479f7] focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2"
                            value={startTime}
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-MochiyPopOne text-[#3f8cf4] text-md mb-2" htmlFor="startTime">
                            結束時間
                        </label>
                        <input
                            className="shadow font-MochiyPopOne appearance-none border-2 rounded w-full py-2 px-3 text-[#3f8cf4] leading-tight border-[#5479f7] focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2"
                            value={endTime}
                            readOnly
                        />
                    </div>
                    {/* 顯示會議室刪除成功訊息 */}             
                    {showDeleteReservationSuccess && <DeleteReservationSuccess /> }
                    <div className="flex flex-wrap justify-center space-x-6">
                        <button onClick={handleCloseForm} className="btn btn-outline font-MochiyPopOne font-thin bg-[#e1ebff] text-lg text-[#3f8cf4] py-2 px-12 hover:bg-[#5479f7] hover:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6283f0] focus:ring-offset-2 my-2 border-2 border-[#5479f7]">取消</button>
                        <button onClick={deleteMeeting} className="btn btn-outline font-MochiyPopOne font-thin bg-[#f8f9fc] text-lg text-[#3f8cf4] py-2 px-12 hover:bg-[#5479f7] hover:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6283f0] focus:ring-offset-2 my-2 border-2 border-[#5479f7]">刪除</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default DeleteForm