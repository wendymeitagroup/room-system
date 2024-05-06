import { db } from "../db.js";
import nodemailer from "nodemailer";

export const sendEmail = async (req, res) => {
    const { subject, selectedApplicantName, selectedApplicantEmail, selectedAttendeesName, selectedAttendeesEmail, location, date, start_time, end_time } = req.body;
    
    //收件者清單: 申請者和所有與會者的email
    const receivers = [selectedApplicantEmail, ...selectedAttendeesEmail].join(', ');
    console.log(receivers)
    //寄信給申請者和所有與會者
    const transporter = nodemailer.createTransport({
        host: 'mail.meitagroup.com', //SMTP 伺服器名稱 smtp.mail.meita.com.tw mail.meita.com.tw 59.124.136.138
        port: 465,                   //SMTP 伺服器端口號碼             
        secure: true,                //是否使用加密連線 TLS
        auth: {
            user: 'noreply@meitagroup.com', //寄件者email
            pass: 'noreply@MT'              //寄件者密碼
        },
        tls: {
            rejectUnauthorized: false //是否拒絕未經驗證的TLS連接
        }
    });
    
     // 驗證連接是否成功
     transporter.verify(function(error, success) {
        if (error) {
            console.log("郵件服務器連接錯誤：", error);
            res.status(500).json({ error: "無法連接到郵件服務器" });
        } else {
            console.log("郵件服務器連接成功，開始發送郵件...");
            
            const content = `    
                主題: ${subject}
                申請者: ${selectedApplicantName}
                與會者: ${selectedAttendeesName.join(', ')}
                地點: ${location}
                日期: ${date}
                開始時間: ${start_time}
                結束時間: ${end_time}
            `;
            
            const mailOptions = {
                from: "noreply@meitagroup.com",
                to: receivers,
                subject: subject,
                text: content,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log("發送郵件失敗：", error);
                    res.status(500).json({ error: "發送郵件失敗" });
                } else {
                    console.log("發送郵件成功!");
                    res.status(200).json({ message: "發送郵件成功" });
                }
            });
        }
    });
  };

//獲取特定地點那週所有會議室預約資料
export const getLocationMeetings = (req, res) => {
    const { location, startDate, endDate } = req.query;
    db.query(
        `SELECT * FROM reservation WHERE location_id = (SELECT room_id FROM room WHERE room_name = ?) AND reservation_date >= ? AND reservation_date <= ?`,
        [location, startDate, endDate],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(results);
        }
    );
};

//修改會議預約
export const updateMeeting = async (req, res) => {
    const reservation_id = req.params.id;
    const { attendees, location, start_time, end_time } = req.body;

    // 更新預約表資料
    const updateReservationQuery = "UPDATE reservation SET location_id = (SELECT room_id FROM room WHERE room_name = ?), start_time = ?, end_time = ? WHERE reservation_id = ?";
    db.query(updateReservationQuery, [location, start_time, end_time, reservation_id], (err) => {
         if (err) {
            console.error("Error updating reservation:", err);
            return res.status(500).json({ error: "Error updating reservation" });
         }
 
         // 更新與會者資料
         const deleteAttendeesQuery = "DELETE FROM attendee WHERE attendee_reservation_id = ?";
         db.query(deleteAttendeesQuery, [reservation_id], (err) => {
             if (err) {
                 console.error("Error deleting previous attendees:", err);
                 return res.status(500).json({ error: "Error updating attendees" });
             }
 
             //查詢每個與會者的工號，插入到與會者表中
             const insertAttendeesQuery = "INSERT INTO attendee (attendee_reservation_id, attendee_employee_id) VALUES ?";
             const attendeesData = attendees.map((attendeeName) => {
                 return new Promise((resolve, reject) => {
                     const getUserQuery = "SELECT employee_id FROM user WHERE name = ?";
                     db.query(getUserQuery, [attendeeName], (err, result) => {
                         if (err) {
                             console.error("Error fetching user:", err);
                             reject(err);
                         } else if (result.length === 0) {
                             console.error("User not found:", attendeeName);
                             reject(new Error("User not found"));
                         } else {
                             resolve([reservation_id, result[0].employee_id]);
                         }
                     });
                 });
             });
 
             Promise.all(attendeesData).then((attendeesDataResolved) => {
                 db.query(insertAttendeesQuery, [attendeesDataResolved], (err) => {
                     if (err) {
                         console.error("Error adding new attendees:", err);
                         return res.status(500).json({ error: "Error updating attendees" });
                     }
                     res.status(200).json({ message: "Meeting and attendees updated successfully" });
                 });
             }).catch((err) => {
                 console.error("Error resolving attendees data:", err);
                 res.status(500).json({ error: "Error updating attendees" });
             });
         });
     });
};

//刪除會議預約
export const deleteMeeting = (req, res) => {
    const reservation_id = req.params.id;
    // 首先刪除與會者表中與這個會議相關的資料
    const deleteAttendeesQuery = "DELETE FROM attendee WHERE attendee_reservation_id = ?";
    db.query(deleteAttendeesQuery, [reservation_id], (err, result) => {
        if (err) {
            console.error("Error deleting attendees:", err);
            return res.status(500).json({ error: "Error deleting attendees" });
        }

    // 然後刪除會議資料
    const deleteReservationQuery = "DELETE FROM reservation WHERE reservation_id = ?";
    db.query(deleteReservationQuery, [reservation_id], (err, result) => {
        if (err) {
            console.error("Error deleting meeting:", err);
            return res.status(500).json({ error: "Error deleting meeting" });
        }
            res.status(200).json({ message: "Meeting and attendees deleted successfully" });
        });
    });
};

//檢查是否預約到已經被預約的時段，修改會議使用
export const getReservedTimeForUpdateMeeting = (req, res) => {
    const { location, date, start_time, end_time, original_start_time, original_end_time } = req.body;
    const sql = `
        SELECT *
        FROM reservation
        WHERE location_id = (SELECT room_id FROM room WHERE room_name = ?)
        AND reservation_date = ?
        AND ((start_time >= ? AND start_time < ?) OR (end_time > ? AND end_time <= ?))
        AND NOT (start_time >= ? AND end_time <= ?); -- 排除原始會議時間範圍內的預約
    `;
    db.query(sql, [location, date, start_time, end_time, start_time, end_time, original_start_time, original_end_time], (err, result) => {
        if (err) {
            console.error("Error checking reserved time:", err);
            return res.status(500).json({ error: "Error checking reserved time" });
        }
        res.status(200).json({ reserved: result.length > 0 });
    });
};

//檢查是否預約到已經被預約的時段，新增會議使用
export const getReservedTimForAddMeeting = (req, res) => {
    const { location, date, start_time, end_time } = req.body;
    const sql = `
        SELECT *
        FROM reservation
        WHERE location_id = (SELECT room_id FROM room WHERE room_name = ?)
        AND reservation_date = ?
        AND ((start_time >= ? AND start_time < ?) OR (end_time > ? AND end_time <= ?));
    `;
    db.query(sql, [location, date, start_time, end_time, start_time, end_time], (err, result) => {
        if (err) {
            console.error("Error checking reserved time:", err);
            return res.status(500).json({ error: "Error checking reserved time" });
        }

        res.status(200).json({ reserved: result.length > 0 });
    });
};

//獲取那週所有會議室預約資料 前端會傳開始日期:startDate和結束日期:endDate
export const getMeetings = (req, res) => {
    const { startDate, endDate, roomName } = req.query;
    let sql = `
        SELECT 
            r.reservation_id,
            r.subject,
            r.applicant_employee_id,
            u.name AS applicant_name,
            u.email AS applicant_email,
            GROUP_CONCAT(a.attendee_employee_id) AS attendees_employee_id,
            GROUP_CONCAT(u2.name) AS attendees_name,
            GROUP_CONCAT(u2.email) AS attendees_email,
            r.location_id,
            ro.room_name AS location_name,
            r.reservation_date,
            r.start_time,
            r.end_time
        FROM 
            reservation r
        JOIN 
            user u ON r.applicant_employee_id = u.employee_id
        LEFT JOIN 
            attendee a ON r.reservation_id = a.attendee_reservation_id
        LEFT JOIN 
            user u2 ON a.attendee_employee_id = u2.employee_id
        JOIN 
            room ro ON r.location_id = ro.room_id
        WHERE 
            r.reservation_date BETWEEN ? AND ?`;
    const params = [startDate, endDate];
    if (roomName) {
        sql += ` AND ro.room_name = ?`;
        params.push(roomName);
    }
    sql += ` GROUP BY r.reservation_id;`;

    // 執行查詢
    db.query(sql, [startDate, endDate, roomName], (err, result) => {
        if (err) {
            console.error("Error fetching meetings:", err);
            return res.status(500).json({ error: "Error fetching meetings" });
        }
        // 輸出查詢結果到控制台
        //console.log("Meeting results:", result);

        // 將查詢結果回傳給前端
        res.status(200).json(result);
    });
};

//獲取所有用戶資料
export const getUserDatas = (req, res) => {
    const sql = "SELECT employee_id, name, email FROM user";
    db.query(sql, (err, data) => {
        if(err) return res.send(err);
        else return res.status(200).json(data);
    });
};

//獲取所有會議室地點名字
export const getRoomNames = (req, res) => {
    const sql = "SELECT room_name FROM room";
    db.query(sql, (err, data) => {
        if(err) return res.send(err);
        else return res.status(200).json(data);
    });
};

//新增會議室預約
export const addMeeting = (req, res) => {
    const { subject, selectedApplicantEmployeeId, selectedAttendeesEmployeeId, location, date, start_time, end_time } = req.body;
    // 尋找 location_id
    db.query('SELECT room_id FROM room WHERE room_name = ?', [location], (err, results) => {
        if (err) {
            console.error("Error finding location ID:", err);
            return res.status(500).send("Error finding location ID");
        }

        if (results.length === 0) {
            return res.status(400).send("Location not found");
        }

        const location_id = results[0].room_id;

        // 插入預約資料到預約表中
        const reservationQuery = 'INSERT INTO reservation (subject, applicant_employee_id, location_id, reservation_date, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(reservationQuery, [subject, selectedApplicantEmployeeId, location_id, date, start_time, end_time], (err, result) => {
            if (err) {
                console.error("Error inserting reservation data:", err);
                return res.status(500).send("Error inserting reservation data");
            }

            const reservation_id = result.insertId;

            // 插入與會者資料到與會者表中
            const attendeesQuery = 'INSERT INTO attendee (attendee_reservation_id, attendee_employee_id) VALUES ?';
            const attendeesData = selectedAttendeesEmployeeId.map((employee_id) => [reservation_id, employee_id]);

            db.query(attendeesQuery, [attendeesData], (err) => {
                if (err) {
                    console.error("Error inserting attendees data:", err);
                    return res.status(500).send("Error inserting attendees data");
                }
                res.status(200).send("Meeting added successfully");
            });
        });
    });
};