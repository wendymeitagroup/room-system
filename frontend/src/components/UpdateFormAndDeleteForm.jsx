import { useState } from 'react';
import UpdateForm from "./UpdateForm"; //修改表單
import DeleteForm from './DeleteForm'; //刪除表單

const UpdateFormAndDeleteForm = ({ slot, onClose, fetchMeetings, startDate, endDate }) => {
    //修改表單和刪除表單標籤
    const [tabs, setTabs] = useState('updateForm');
    const handleTabClick = (tab) => {
        setTabs(tab);
    };

    const tabActivecss = {
        backgroundColor: "#ffffff",
        color: "#3f8cf4",
        border: "2px solid #5479f7"
    };

    //按下取消按紐
    const handleCloseForm = () => {
        setTabs(null);
        onClose(); //關閉背景遮罩
        fetchMeetings(startDate, endDate); //在關閉修改和刪除表單時重新加載那週所有會議室預約資料
    };
  return (
        <>
            {/*Tab 標籤*/}
            {tabs !== null && (
                <div className="flex justify-center my-4">
                    <div className="tabs tabs-boxed bg-[#caddff] font-MochiyPopOne text-[#3f8cf4] z-50">
                    <a
                        className={`tab ${tabs === 'updateForm' ? 'tab-active' : ''} text-[#3f8cf4]`}
                        style={tabs === 'updateForm' ? tabActivecss : {}}
                        href="##"
                        onClick={() => handleTabClick('updateForm')}
                    >
                        修改
                    </a>
                    <a
                        className={`tab ${tabs === 'deleteForm' ? 'tab-active' : ''} text-[#3f8cf4]`}
                        style={tabs === 'deleteForm' ? tabActivecss : {}}
                        href="##"
                        onClick={() => handleTabClick('deleteForm')}
                    >
                        刪除
                    </a>
                    </div>
                </div>
            )}
        
            {/*Tab 修改表單內容*/}
            {tabs === 'updateForm' && (
                <>
                    <div className="z-40">
                        <UpdateForm event={slot} handleCloseForm={handleCloseForm} />
                    </div>
                </>
            )}

            {/*Tab 刪除表單內容*/}
            {tabs === 'deleteForm' && (
                <>
                    <div className="z-40">
                        <DeleteForm event={slot} handleCloseForm={handleCloseForm} />
                    </div>
                </>
            )}
        </>
    );
};

export default UpdateFormAndDeleteForm;