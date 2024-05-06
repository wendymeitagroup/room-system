//所有的警告訊息、成功訊息
import { TiWarning } from "react-icons/ti";
import { FaRegCalendarCheck } from "react-icons/fa";

//顯示警告訊息: 預約表單中的所有欄位是否都有值
export const BlankFieldsWarning = ( { blankFields } ) => {
    return (
        <div role="alert" className="alert alert-error bg-[#fee2e2] border-2 border-[#ff5861] my-2">
            <TiWarning size={30} color='#ff5861'/>
            <span className="text-[#ff5861] font-MochiyPopOne">{blankFields.join("、")}欄位未填寫</span>
        </div>
    );
};

//顯示警告訊息: 預約表單中的結束時間比開始時間早
export const EndTimeEarlierWarning = () => {
    return (
        <div role="alert" className="alert alert-error bg-[#fee2e2] border-2 border-[#ff5861] my-2">
            <TiWarning size={30} color='#ff5861'/>
            <span className="text-[#ff5861] font-MochiyPopOne">結束時間比開始時間早，請重新調整</span>
        </div>
    );
};

//顯示警告訊息: 預約到過去的日期或時段
export const ReservationPastTimeWarning = () => {
    return (
        <div role="alert" className="alert alert-error bg-[#fee2e2] border-2 border-[#ff5861] my-2">
            <TiWarning size={30} color='#ff5861'/>
            <span className="text-[#ff5861] font-MochiyPopOne">預約到過去的日期或時段，請重新調整</span>
        </div>
    );
};

//顯示警告訊息: 開始時間和結束時間相同
export const SameTimeWarning = () => {
    return (
        <div role="alert" className="alert alert-error bg-[#fee2e2] border-2 border-[#ff5861] my-2">
            <TiWarning size={30} color='#ff5861'/>
            <span className="text-[#ff5861] font-MochiyPopOne">開始時間和結束時間相同，請重新調整</span>
        </div>
    );
};

//顯示警告訊息: 預約到已經被預約的時段
export const ReservedTimeWarning = () => {
    return (
        <div role="alert" className="alert alert-error bg-[#fee2e2] border-2 border-[#ff5861] my-2">
            <TiWarning size={30} color='#ff5861'/>
            <span className="text-[#ff5861] font-MochiyPopOne">該地點於此時段已被預約，請重新調整</span>
        </div>
    );
};

//顯示會議室預約成功訊息 
export const ReservationSuccess = () => {
    return (
        <div role="alert" className="alert alert-success bg-green-100 border-2 border-green-400 my-2">
            <FaRegCalendarCheck size={23} color='#4ade80'/>
            <span className="font-MochiyPopOne text-green-400">預約成功</span>
        </div>
    );
}; 

//顯示會議室預約刪除成功訊息 
export const DeleteReservationSuccess = () => {
    return (
        <div role="alert" className="alert alert-success bg-green-100 border-2 border-green-400 my-2">
            <FaRegCalendarCheck size={23} color='#4ade80'/>
            <span className="font-MochiyPopOne text-green-400">刪除預約成功</span>
        </div>
    );
}; 

//顯示會議室預約修改成功訊息 
export const UpdateReservationSuccess = () => {
    return (
        <div role="alert" className="alert alert-success bg-green-100 border-2 border-green-400 my-2">
            <FaRegCalendarCheck size={23} color='#4ade80'/>
            <span className="font-MochiyPopOne text-green-400">修改預約成功</span>
        </div>
    );
}; 