import nodemailer from 'nodemailer';

//port設465 secure設true
//port設587 secure設false

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', //smtp.gmail.com
    port: 587,              //465                 587,
    secure: false,           //secure: true,      false,
    auth: {
        user: 'wendymeitagroup@gmail.com',
        pass: 'lbbt onvx aufz zivy'
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.sendMail({
    to: 'yonghuic954@gmail.com',
    subject: 'ebile會議',
    text: '出席者:晨泳會, 王曉明, 王曉華'
    //html: '<h1>王曉明, 王曉華, 123</h1>'
  }).then(() => {
    console.log('發送成功');
  }).catch(err => {
    console.error('發送出錯:', err);
  });