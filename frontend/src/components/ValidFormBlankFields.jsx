//檢查所有預約表單中的欄位是否都有值，如果有空白就顯示錯誤訊息
export const validFormBlankFields = (subject, selectedApplicantName, selectedAttendeesNames, location, date, startTime, endTime, setBlankFields, setShowBlankFieldsWarning) => {
    const blankFields = [];
    if (!subject) blankFields.push("主題");
    if (selectedApplicantName.length === 0) blankFields.push("申請者");
    if (selectedAttendeesNames.length === 0) blankFields.push("與會者");
    if (!location) blankFields.push("地點");
    if (!date) blankFields.push("日期");
    if (!startTime) blankFields.push("開始時間");
    if (!endTime) blankFields.push("結束時間");
    
    if (blankFields.length > 0) {
        setBlankFields(blankFields);
        setShowBlankFieldsWarning(true);
        setTimeout(() => {
            setShowBlankFieldsWarning(false);
            setBlankFields([]);
        }, 2500);
        return false;
    }
    return true;
};