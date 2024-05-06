//與會者表單
import { useState, useEffect } from 'react';
import axios from "axios";

const AttendeeSelectUpdateForm = ({ onClose, selectedAttendees, setSelectedAttendees }) => {
    const [searchAttendeesData, setSearchAttendeesData] = useState(''); //追蹤搜尋姓名或email
    
    // 匯入與會者的工號和姓名和email資料
    const [attendeesData, setAttendeesData] = useState([]);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get('http://localhost:8800/api/userDatas');
                setAttendeesData(res.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [])

    // 選擇與會者
    const attendeeSelection = (attendee) => {
        if (selectedAttendees.some(selectedAttendee => selectedAttendee.employee_id === attendee.employee_id)) {
            setSelectedAttendees(prevAttendees => prevAttendees.filter(selectedAttendee => selectedAttendee.employee_id !== attendee.employee_id));
        } else {
            setSelectedAttendees(prevAttendees => [...prevAttendees, attendee]);
        }
    };

    // 按下重設按鈕清除所有勾選
    const handleReset = () => {
        setSelectedAttendees([]);
    };

    // 獲取所有被選中的與會者的工號、姓名、email
    const getSelectedAttendeesInfo = () => {
        return selectedAttendees.map(attendee => ({
            employee_id: attendee.employee_id,
            name: attendee.name,
            email: attendee.email
        }));
    }
   
    const handleConfirm = () => {
        onClose(selectedAttendees); //所有被選中的與會者的工號、姓名、email
    };

    // 搜尋功能:搜尋名字或email
    const searchAttendees = attendeesData.filter(attendee =>
        attendee.name.toLowerCase().includes(searchAttendeesData.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchAttendeesData.toLowerCase())
    );

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                <div className="card w-[30rem] bg-[#caddff]">
                    <div className="card-body items-center text-center overflow-y-auto max-h-[500px]">
                        {/* 標題 */}
                        <h2 className="text-2xl text-center font-MochiyPopOne text-[#5479f7]">選擇與會者</h2>
                        {/* 搜尋框 */}
                        <input
                            className="border-2 border-[#5479f7] rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2"
                            type="text"
                            placeholder="搜尋姓名或email"
                            value={searchAttendeesData}
                            onChange={(e) => setSearchAttendeesData(e.target.value)}
                        />
                        {/* 勾選框、姓名框框、email框框 */}
                        {searchAttendees.map((attendee, index) => (
                            <div key={index} className="text-center flex space-x-4 items-center bg-[#f3f7fb] rounded-lg p-1">
                                <input
                                    type="checkbox"
                                    className="checkbox ml-3 h-5 w-5 border-2 bg-[#f7f7f7] border-[#5479f7] checked:border-[#5479f7] [--chkbg:#eaf1fe] [--chkfg:#3f8cf4]"
                                    onChange={() => attendeeSelection(attendee)}
                                    checked={selectedAttendees.includes(attendee)}
                                />
                                <input
                                    className="text-center font-MochiyPopOne text-sm border-2 border-[#5479f7] rounded-md w-[4.8rem] text-gray-700 leading-tight focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2"
                                    value={attendee.name}
                                    readOnly
                                />
                                <input
                                    className="text-center font-yezi text-sm border-2 border-[#5479f7] rounded-md w-72 text-gray-700 leading-tight focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2"
                                    value={attendee.email}
                                    readOnly
                                />
                            </div>
                        ))}
                        
                        <div className="flex space-x-6 justify-center items-center mt-6">
                            <button onClick={handleReset} className="btn btn-outline font-MochiyPopOne font-thin bg-[#e1ebff] text-lg text-[#3f8cf4] py-2 px-8 hover:bg-[#5479f7] hover:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6283f0] focus:ring-offset-2 my-2 border-2 border-[#5479f7]">重設</button>
                            <button onClick={handleConfirm} className="btn btn-outline font-MochiyPopOne font-thin bg-[#f8f9fc] text-lg text-[#3f8cf4] py-2 px-8 hover:bg-[#5479f7] hover:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6283f0] focus:ring-offset-2 my-2 border-2 border-[#5479f7]">確認</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AttendeeSelectUpdateForm;