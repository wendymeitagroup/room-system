//預約表單中的與會者欄位區塊
import { useState } from 'react'
import AttendeeSelect from './AttendeeSelect'
import { IoMdCloseCircle } from "react-icons/io";

const AttendeeSection = ({ selectedAttendeesEmployeeId, setSelectedAttendeesEmployeeId, selectedAttendeesName, setSelectedAttendeesName, selectedAttendeesEmail, setSelectedAttendeesEmail }) => {
    const [selectedAttendees, setSelectedAttendees] = useState([]);  //用於追蹤被選中的與會者
    const [showAttendeeForm, setShowAttendeeForm] = useState(false); //顯示與會者表單
    const handleShowAttendeeForm = () => setShowAttendeeForm(true);  //當按下與會者欄位旁邊的+按鈕時，顯示與會者表單
    
    // 按下姓名Badge的X圖案來刪除與會者 
    const handleDeleteAttendee = (employeeId) => {
        // 從被選中的與會者中刪除該與會者
        const filteredAttendees = selectedAttendees.filter(attendee => attendee.employee_id !== employeeId);
        setSelectedAttendees(filteredAttendees);

        // 找到被刪除與會者在列表中的索引
        const index = selectedAttendeesEmployeeId.indexOf(employeeId);

        if (index !== -1) {
            // 移除被刪除與會者的相關資訊
            const filteredEmployeeIds = [...selectedAttendeesEmployeeId.slice(0, index), ...selectedAttendeesEmployeeId.slice(index + 1)];
            const filteredNames = [...selectedAttendeesName.slice(0, index), ...selectedAttendeesName.slice(index + 1)];
            const filteredEmails = [...selectedAttendeesEmail.slice(0, index), ...selectedAttendeesEmail.slice(index + 1)];
            setSelectedAttendeesEmployeeId(filteredEmployeeIds);
            setSelectedAttendeesName(filteredNames);
            setSelectedAttendeesEmail(filteredEmails);
        }
    };

    // 更新選中的與會者以及其相關的資訊
    const updateSelectedAttendees = (selectedAttendees) => {
        // 將選中的與會者設置為當前選中的與會者
        setSelectedAttendees(selectedAttendees);
        // 更新selectedAttendeesEmployeeId、selectedAttendeesName和selectedAttendeesEmail
        const employeeIds = selectedAttendees.map(attendee => attendee.employee_id);
        const names = selectedAttendees.map(attendee => attendee.name);
        const emails = selectedAttendees.map(attendee => attendee.email);
        setSelectedAttendeesEmployeeId(employeeIds);
        setSelectedAttendeesName(names);
        setSelectedAttendeesEmail(emails);
    };
    return (
        <>
            {/* 與會者 */}
            <div className="mb-4">
                <div className="flex items-center">
                    <label className="block font-MochiyPopOne text-[#3f8cf4] text-md mb-2" htmlFor="attendees">與會者</label>
                    <button onClick={handleShowAttendeeForm} className="bg-[#e1ebff] hover:bg-[#5479f7] text-[#3f8cf4] font-bold py-2 px-4 rounded hover:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6283f0] focus:ring-offset-2 border-2 border-[#5479f7] ml-2" type="button">✚</button>
                </div>
                
                {/* 姓名badge */}
                <div className="grid grid-cols-4 gap-1 font-MochiyPopOne mt-3">
                    {selectedAttendees.map((attendee) => (
                        <div key={attendee.employee_id} className="badge text-[#3f8cf4] bg-[#ffffff] border-2 border-[#5479f7] h-8 mb-2 mt-1">
                            {/* X圖案 */}
                            <IoMdCloseCircle size={20} onClick={() => handleDeleteAttendee(attendee.employee_id)} className="mr-1"/>
                            {attendee.name}
                        </div>
                    ))}
                </div>
                {showAttendeeForm && <AttendeeSelect 
                    onClose={(selectedAttendees) => {
                        //setSelectedAttendees(selectedAttendees); // 在這裡使用 setSelectedAttendees
                        updateSelectedAttendees(selectedAttendees); // 更新選中的與會者
                        setShowAttendeeForm(false);
                    }} 
                    selectedAttendees={selectedAttendees} 
                    setSelectedAttendees={setSelectedAttendees} 
                />} {/* 將 setSelectedAttendees 作為 prop 傳遞給 AttendeeSelect 組件 */}
            </div>
        </>
    )
}

export default AttendeeSection
