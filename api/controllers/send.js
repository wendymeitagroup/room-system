import nodemailer from "nodemailer";

 //寄信給申請者和所有與會者
 const transporter = nodemailer.createTransport({
    host: 'mail.meitagroup.com',   //SMTP 伺服器名稱 smtp.mail.meita.com.tw mail.meita.com.tw 59.124.136.138
    port: 465,                         //SMTP 伺服器端口號碼             
    secure: true,                    //是否使用加密連線 TLS
    auth: {
        user: 'noreply@meitagroup.com', //寄件者email
        pass: 'noreply@MT'            //寄件者密碼
    },
    tls: {
        rejectUnauthorized: false //是否拒絕未經驗證的TLS連接
    }
});

 // 驗證連接是否成功
transporter.verify( function(error, success) {
    if (error) {
        console.log("郵件服務器連接錯誤：", error);
    } else {
        console.log("郵件服務器連接成功，開始發送郵件...");
        
        const content = `    
            主題: ebike會議
            申請者: 陳湧惠
            與會者: 測試1, 測試2
            地點: 第一會議室
            日期: 2024-05-03
            開始時間: 13:00
            結束時間: 14:00
        `;
        
        const mailOptions = {
            from: "noreply@meitagroup.com",
            to: ['test1@meita.com.tw, test2@meita.com.tw'],
            subject: 'ebike會議',
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