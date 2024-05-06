//日曆圖外觀樣式
import styled from "@emotion/styled";

export const CalendarContainer = styled.div`
    background-color: #f8f9fc; 
    color: #3f8cf4;
    width: 98%; 
    margin: auto;
    margin-top: 1%;
    margin-bottom: 1%;
    border-radius: 10px;
    cursor: pointer;

    //當天的
    .fc-day-today {
        background-color: #c0d3fa !important;
        overflow: hidden;
    } 

    .fc-scrollgrid-sync-inner {
        background-color: #e1ebff !important;
        overflow: hidden;
    }

    .fc-timegrid-slot-label   {
        background-color: #e1ebff !important;
    }
   
    .fc-scrollgrid {
        border-radius: 10px;
    }

    .fc-theme-standard th {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background-color: #e1ebff !important;
    }

    .fc-theme-standard td {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    //格子大小調整
    .fc-timegrid-slot {
        height: 30px; 
        border: 1.5px solid #3f8cf4 !important;
    }

    //格子外框調整
    .fc-theme-standard td {
        border: 1.5px solid #3f8cf4 !important;
    }
  
    .fc th {
        border-left: 1.5px solid #3f8cf4; 
        border-right: 1.5px solid #3f8cf4;
    }
   
    .fc-scrollgrid {
        border: 1.5px solid #3f8cf4 !important;
    }

    //會議events調整
    .fc-event {
        width: 97% !important;
        height: 90%;
        border: 2.5px solid;
        border-radius: 10px;
        text-align: center;
        justify-content: center;
        margin: auto;
        margin-left:4px;
    }

    //< 本週 >按鈕的調整
    .fc .fc-button-primary { 
        color: #3f8cf4; 
        background-color: #f8f9fc !important; 
        border: 2px solid #5479f7;
        cursor: pointer;
    }
    
    .fc .fc-button-primary:hover { 
        background-color: #e1ebff !important; 
    }
`

/*
  .fc-theme-standard td {
        border: 1.5px solid #6e7c8d !important;
    }
    .fc-theme-standard td .fc-theme-standard th {
        border: 1.5px solid #6e7c8d !important;
    }

     .fc-daygrid-day-frame {
        min-height: 5em !important;
    }
*/