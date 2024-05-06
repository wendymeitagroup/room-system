import { useState, useEffect } from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from '@fullcalendar/timegrid'
import ReserveForm from './ReserveForm';
import moment from "moment";
import axios from "axios";
import { CalendarContainer } from "./CalenderStyle"; //日曆外觀樣式
import UpdateFormAndDeleteForm from "../components/UpdateFormAndDeleteForm.jsx";

const Home = () => {
    const [startDate, setStartDate] = useState(null);       //獲取那週的開始日期
    const [endDate, setEndDate] = useState(null);           //獲取那週的結束日期
    const [selectedSlot, setSelectedSlot] = useState(null); //點擊日曆圖上的格子做選取
    const [selectedEvent, setSelectedEvent] = useState(null); //點擊日曆圖上的已預約的會議
    const [meetings, setMeetings] = useState([]);           //獲取那週所有會議室預約資料
    const [showOverlay, setShowOverlay] = useState(false); //控制背景遮罩顯示
    const apiurl = "http://localhost:8800/api"

    //獲取那週所有會議室預約資料
    const fetchMeetings = async (startDate, endDate, roomName) => {
        try {
            let url = `${apiurl}/getMeetings?startDate=${startDate}&endDate=${endDate}`;
            if (roomName) {
                url += `&roomName=${roomName}`;
            }
            const res = await axios.get(url);
            setMeetings(res.data);
            console.log('獲取會議資料成功:', res.data);
        } catch (error) {
            console.error('獲取會議資料時出錯:', error);
        }
    };

    // 更新按鈕點擊事件以獲取選定會議室的會議
    const selectRoomMeeting = (roomName) => {
        fetchMeetings(startDate, endDate, roomName);
    };

    //在預約新會議時，確保已有的那週所有會議室預約資料仍然顯示在日曆圖上
    useEffect(() => {
        if (selectedSlot) {
            setStartDate(moment(selectedSlot.date).startOf('week').format('YYYY-MM-DD'));
            setEndDate(moment(selectedSlot.date).endOf('week').format('YYYY-MM-DD'));
        }
    }, [selectedSlot]);

    //點擊日曆圖上的格子做選取
    const handleDateSlotSelect = (dateSlot) => {
        setSelectedSlot({
            date: dateSlot.dateStr,
            startTime: dateSlot.dateStr,
            endTime: moment(dateSlot.dateStr).add(30, 'minutes').format() //將結束時間設定成開始時間的30分鐘後
        });
        setShowOverlay(true); // 顯示背景遮罩
    };

    //拖曳日曆圖上的格子做選取
    const handleDragSlotSelect = (dragSlot) => {
        setSelectedSlot({
            date: dragSlot.startStr,
            startTime: dragSlot.startStr,
            endTime: dragSlot.endStr,
        });
        setShowOverlay(true); // 顯示背景遮罩
    };

    //按下取消按鈕，關閉預約表單
    const handleCloseReserveForm = () => {
        setSelectedSlot(null);
        fetchMeetings(startDate, endDate); //在關閉預約表單時重新加載那週所有會議室預約資料
        setShowOverlay(false); // 關閉背景遮罩
        setSelectedEvent(null); // 在關閉表單時清除selectedEvent
    };

    //那週所有已預約的會議 將會議室預約資料轉換成FullCalendar事件格式
    const events = meetings.map(meeting => ({
        reservation_id: meeting.reservation_id,     //預約表中的會議id
        subject: meeting.subject,                   //主題
        applicant_employee_id: meeting.applicant_employee_id, //申請者工號
        applicant_name: meeting.applicant_name,     //申請者姓名
        applicant_email: meeting.applicant_email,   //申請者email
        attendees_employee_id: meeting.attendees_employee_id, //與會者工號
        attendees_name: meeting.attendees_name,     //與會者姓名
        attendees_email: meeting.attendees_email,   //與會者email
        
        location_name: meeting.location_name,       //地點
        reservation_date: meeting.reservation_date.substring(0, 10), //日期
        start_time: meeting.start_time,             //開始時間
        end_time: meeting.end_time,                 //結束時間

        //FullCalendar規定顯示事件要有的參數
        id: meeting.reservation_id, //預約表中的會議id
        title: meeting.subject,     //主題
        start: moment(meeting.reservation_date).format('YYYY-MM-DD') + 'T' + meeting.start_time,
        end: moment(meeting.reservation_date).format('YYYY-MM-DD') + 'T' + meeting.end_time,
        backgroundColor: '#fee2e2',
        textColor: '#ff5861',
        borderColor: '#ff5861',
        //editable: false //可拖曳、編輯
    }));
    console.log(events); //印出所有會議
    
    //點擊已預約的會議events，要顯示修改表單和刪除表單
    const eventClick = (eventInfo) => {
        const clickedEvent = meetings.find(meeting => String(meeting.reservation_id) === eventInfo.event.id);
        setSelectedEvent(clickedEvent);
        setShowOverlay(true); // 顯示背景遮罩
    };

    //關閉背景遮罩的函數
    const handleCloseOverlay = () => {
        setShowOverlay(false);
        setSelectedEvent(null)
    };

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

// 在 FullCalendar 事件中添加 eventMouseEnter 和 eventMouseLeave
// 顯示會議資訊的 tooltip
const handleEventMouseEnter = (info) => {
    const event = info.event.extendedProps;
    const isFriday = moment(event.reservation_date).day() === 5;
    const tooltipContent = `
        主題: ${event.subject}\n
        申請者: ${event.applicant_name}\n
        與會者: ${event.attendees_name}\n
        地點: ${event.location_name}\n
        日期: ${event.reservation_date}\n
        開始時間: ${event.start_time}\n
        結束時間: ${event.end_time}
    `;
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipContent;
    tooltip.style.backgroundColor = '#e1ebff';
    tooltip.style.color = '#3f8cf4';
    tooltip.style.position = 'absolute';
    tooltip.style.borderRadius = '4px';
    tooltip.style.border = '2px solid #3f8cf4';
    tooltip.style.zIndex = '9999';
    tooltip.style.textAlign = 'left';
    tooltip.style.fontWeight = 'bold';
    tooltip.style.lineHeight = '1';
    tooltip.style.paddingTop = '1px';
    tooltip.style.paddingLeft = '15px';
    tooltip.style.paddingRight = '15px';
    tooltip.style.paddingBottom = '15px';
    const eventRect = info.el.getBoundingClientRect();
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    if (isFriday) {
        const tooltipWidth = tooltip.offsetWidth;
        if ((eventRect.right + tooltipWidth) > windowWidth) {
            tooltip.style.left = `${eventRect.left - tooltipWidth}px`;
        } else {
            tooltip.style.left = `${eventRect.right}px`;
        }
    } else {
        tooltip.style.left = `${eventRect.right}px`;
    }
    const scrollY = window.scrollY || window.pageYOffset;
    tooltip.style.top = `${eventRect.top + scrollY}px`;
    tooltip.style.whiteSpace = 'pre-line';
    document.body.appendChild(tooltip);
    info.el.addEventListener('mouseleave', () => {
        tooltip.remove();
    });
};

// 在 FullCalendar 事件中添加 eventMouseEnter 和 eventMouseLeave
const handleEventMouseLeave = (info) => {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
};

    return (
        <>
            {/* 背景遮罩 */}
            {showOverlay && (
                <div className="z-10 fixed top-0 left-0 w-full h-full bg-gray-500 opacity-50"></div>
            )}
            {/* 預約表單 */}
            {selectedSlot && (
                <div className="absolute top-5 left-0 z-20 w-full">
                    <ReserveForm slot={selectedSlot} onClose={handleCloseReserveForm} startDate={startDate} endDate={endDate}/>
                </div>
            )}
            {/* 修改表單和刪除表單 */}
            {selectedEvent && (
                <div className="absolute top-5 left-0 z-20 w-full">
                    <UpdateFormAndDeleteForm slot={selectedEvent} onClose={handleCloseOverlay} fetchMeetings={fetchMeetings} startDate={startDate} endDate={endDate}/>
                </div>
            )}
          
            <CalendarContainer>
                {/* 顯示資料庫地點表中的所有會議室地點名字 */}
                <div className="flex flex-wrap justify-center gap-4">
                    {roomNames.map((roomname, index) => (
                        <button key={index} onClick={() => selectRoomMeeting(roomname.room_name)} className="btn btn-outline font-MochiyPopOne font-thin bg-[#e1ebff] text-md text-[#3f8cf4] py-2 px-8 hover:bg-[#5479f7] hover:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6283f0] focus:ring-offset-2 border-2 border-[#5479f7]">{roomname.room_name}</button>
                    ))}
                </div>
                <FullCalendar
                    selectable={true}
                    select={(dragSlot) => handleDragSlotSelect(dragSlot)}
                    dateClick={(dateSlot) => handleDateSlotSelect(dateSlot)}
                    plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
                    initialView="timeGridWeek"
                    weekends={false}
                    allDaySlot={false}
                    nowIndicator={true}
                    slotLabelInterval={{minute: 30}}
                    slotMinTime="09:00"
                    slotMaxTime="18:30"
                    slotLabelFormat={{hour: 'numeric', minute: '2-digit', hour12: false}}
                    contentHeight= 'auto'
                    locale="zh-tw"
                    buttonText={{today: '本週'}}
                    headerToolbar={{
                        left: null,
                        center: 'title',
                        right: 'prev,today,next'
                    }}
                    dayHeaderFormat={(param) => {
                        const date = moment(param.date);
                        const dayOfMonth = date.date();
                        const month = date.month() + 1;
                        const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][date.day()];
                        return `${month}/${dayOfMonth} 星期${dayOfWeek}`;
                    }}
                    titleFormat={{
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        separator: '~',
                        omitCommas: true
                    }}
                    datesSet={(week) => {
                        const startDate = moment(week.start).format('YYYY-MM-DD');
                        const endDate = moment(week.end).subtract(1, 'day').format('YYYY-MM-DD');
                        setStartDate(startDate);
                        setEndDate(endDate);
                    }}
                    events={events} //已預約的會議
                    eventClick={eventClick} //點擊已預約的會議events
                    displayEventTime={false} //events裡面不顯示時間
                    //eventDidMount={handleEventDidMount} // 新增這行設定
                    // 顯示會議資訊的 tooltip
                    eventMouseEnter={handleEventMouseEnter}
                    eventMouseLeave={handleEventMouseLeave}
                />
            </CalendarContainer>
        </>
    );
};
export default Home;


/*
const handleEventMouseEnter = (info) => {
    const event = info.event.extendedProps;
    const isFriday = moment(event.reservation_date).day() === 5;
    const tooltipContent = `
        主題: ${event.subject}\n
        申請者: ${event.applicant_name}\n
        與會者: ${event.attendees_name}\n
        地點: ${event.location_name}\n
        日期: ${event.reservation_date}\n
        開始時間: ${event.start_time}\n
        結束時間: ${event.end_time}
    `;
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipContent;
    tooltip.style.backgroundColor = '#e1ebff';
    tooltip.style.color = '#3f8cf4';
    tooltip.style.position = 'absolute';
    tooltip.style.borderRadius = '4px';
    tooltip.style.border = '2px solid #3f8cf4';
    tooltip.style.zIndex = '9999';
    tooltip.style.textAlign = 'left';
    tooltip.style.fontWeight = 'bold';
    tooltip.style.lineHeight = '1';
    tooltip.style.paddingTop = '1px';
    tooltip.style.paddingLeft = '15px';
    tooltip.style.paddingRight = '15px';
    tooltip.style.paddingBottom = '15px';
    const eventRect = info.el.getBoundingClientRect();
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    if (isFriday) {
        const tooltipWidth = tooltip.offsetWidth;
        if ((eventRect.right + tooltipWidth) > windowWidth) {
            tooltip.style.left = `${eventRect.left - tooltipWidth}px`;
        } else {
            tooltip.style.left = `${eventRect.right}px`;
        }
    } else {
        tooltip.style.left = `${eventRect.right}px`;
    }
    const scrollY = window.scrollY || window.pageYOffset;
    tooltip.style.top = `${eventRect.top + scrollY}px`;
    tooltip.style.whiteSpace = 'pre-line';
    document.body.appendChild(tooltip);
    info.el.addEventListener('mouseleave', () => {
        tooltip.remove();
    });
};

const handleEventMouseEnter = (info) => {
    const event = info.event.extendedProps;
    const tooltipContent = `
        主題: ${event.subject}\n
        申請者: ${event.applicant_name}\n
        與會者: ${event.attendees_name}\n
        地點: ${event.location_name}\n
        日期: ${event.reservation_date}\n
        開始時間: ${event.start_time}\n
        結束時間: ${event.end_time}
    `;
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = tooltipContent;
    tooltip.style.backgroundColor = '#e1ebff'; // 背景顏色
    tooltip.style.color = '#3f8cf4'; // 文字顏色
    tooltip.style.position = 'absolute';
    tooltip.style.borderRadius = '4px';
    tooltip.style.border = '2px solid #3f8cf4';
    tooltip.style.zIndex = '9999';        // 可能需要調整 z-index
    tooltip.style.textAlign = 'left';     // 文字靠左對齊
    tooltip.style.fontWeight = 'bold';    // 將字體設置為粗體
    tooltip.style.lineHeight = '1';       // 設置每一行的間距
    tooltip.style.paddingTop = '1px';     // 設置固定的內上邊距
    tooltip.style.paddingLeft = '15px';   // 設置固定的內左邊距
    tooltip.style.paddingRight = '15px';  // 設置固定的內右邊距
    tooltip.style.paddingBottom = '15px'; // 設置固定的內下邊距
    const eventRect = info.el.getBoundingClientRect();
    tooltip.style.left = `${eventRect.right}px`; // 將 tooltip 放在事件的右側
    tooltip.style.top = `${eventRect.top}px`; // 事件元素的上方
    tooltip.style.whiteSpace = 'pre-line'; // 使用 CSS 的 white-space 屬性讓文字換行
    document.body.appendChild(tooltip); // 附加到 body 元素，以避免被其他元素覆蓋
    info.el.addEventListener('mouseleave', () => {
        tooltip.remove();
    });
};
*/