//預約表單中的申請者欄位區塊
import { useState } from 'react'
import ApplicantSelect from './ApplicantSelect';
import { IoMdCloseCircle } from "react-icons/io";

const ApplicantSection = ( { selectedApplicantEmployeeId, setSelectedApplicantEmployeeId, selectedApplicantName, setSelectedApplicantName, selectedApplicantEmail, setSelectedApplicantEmail }) => {
    //申請者表單
    const [showApplicantForm, setShowApplicantForm] = useState(false); //顯示申請者表單
    const handleShowApplicantForm = () => setShowApplicantForm(true);  //當按下申請者欄位旁邊的+按鈕時，顯示申請者表單

    //按下姓名Badge的X來刪除申請者 
    const handleDeleteApplicant = () => {
        setSelectedApplicantName('');
    };
    return (
        <>
            {/* 申請者 */}
            <div className="mb-4">
                    <div className="flex items-center">
                        <label className="block font-MochiyPopOne text-[#3f8cf4] text-md mb-2" htmlFor="attendees">申請者</label>
                        <button onClick={handleShowApplicantForm} className="bg-[#e1ebff] hover:bg-[#5479f7] text-[#3f8cf4] font-bold py-2 px-4 rounded hover:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6283f0] focus:ring-offset-2 border-2 border-[#5479f7] ml-2" type="button">✚</button>
                    </div>
                    
                    {/* 姓名badge */}
                    <div className="grid grid-cols-4 gap-1 font-MochiyPopOne mt-3">
                        {/* 顯示已選擇的申請者名字 */}
                        {selectedApplicantName && (
                            <div className="badge text-[#3f8cf4] bg-[#ffffff] border-2 border-[#5479f7] h-8 mb-2 mt-1">
                                {/* X圖案刪除姓名badge */}
                                <IoMdCloseCircle size={20} onClick={() => handleDeleteApplicant(selectedApplicantName)} className="mr-1"/>
                                {selectedApplicantName}
                            </div>
                        )}
                    </div>
                    {showApplicantForm && (
                        <ApplicantSelect onClose={(selectedApplicant) => {
                            setSelectedApplicantEmployeeId(selectedApplicant[0]); // 取得被選中的申請者工號並設定為selectedApplicantEmployeeId
                            setSelectedApplicantName(selectedApplicant[1]); // 取得被選中的申請者姓名並設定為selectedApplicantName
                            setSelectedApplicantEmail(selectedApplicant[2]); // 取得被選中的申請者email並設定為selectedApplicantEmail
                            setShowApplicantForm(false);
                        }} />
                    )}
            </div>
        </>
    )
}
export default ApplicantSection