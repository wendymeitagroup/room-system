import { useState } from 'react'
import { FaUser } from "react-icons/fa";
import validation from './Loginvalidition';

const Login = () => {
	const [values, setValues] = useState({
		empnumber: '',
		password: '',
	});

	const [errors, setErrors] = useState({

	});
	const handleInput = (event) => {
		setValues(prev => ({...prev, [event.target.name]: [event.target.value] }))
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setErrors(validation(values))
	};

	const sendEmail = () => {
		// 需要替換為你的收件人地址、主題和內容
		const recipient = 'recipient@example.com';
		const subject = 'Subject of the email';
		const body = 'Content of the email';
	
		// 建立郵件URI
const mailtoUri = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

// 使用window.location.href來直接導航到郵件客戶端
window.location.href = mailtoUri;
	  };
	return (
		<>
			<form action="" onSubmit={handleSubmit}>
				<div className="flex items-center justify-center min-h-screen">
					<div className="bg-[#caddff] p-7 rounded-md shadow-md w-full md:max-w-md mx-6">
						<label className="block font-MochiyPopOne mb-1 text-md text-[#3f8cf4] dark:text-neutral-50" htmlFor="input1">
						工號
						</label>
						<div className="mb-4 relative">
							<i className="fa-solid fa-user text-lg text-[#3f8cf4] absolute left-3 top-1/2 transform -translate-y-1/2"></i>
							<input
								name="empnumber"
								onChange={handleInput}
								type="text"
								className="w-full border-2 border-[#5479f7] rounded-md py-2 pl-10 focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2"
							/>
						</div>
						{errors.empnumber && <span className='text-red-400'>{errors.empnumber}</span>}

						<label className="block font-MochiyPopOne mb-1 text-md text-[#3f8cf4] dark:text-neutral-50" htmlFor="input1">
						密碼
						</label>
						<div className="mb-4 relative">
							<i className="fa-solid fa-lock text-lg text-[#3f8cf4] absolute left-3 top-1/2 transform -translate-y-1/2"></i>
							<input
								name="password"
								onChange={handleInput}
								type="password"
								className="w-full border-2 border-[#5479f7] rounded-md py-2 pl-10 focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2"
							/>
						</div>
						{errors.password && <span className='text-red-400 mt-10'>{errors.password}</span>}
						{/* 登入按鈕 */}
						<div className="mb-4 relative">
							<FaUser className="absolute left-[8.7rem] top-[50%] transform -translate-y-1/2" style={{ color: '#3f8cf4', fontSize: '24px' }} />
							<button type='submit' className="w-full bg-[#eaf1fe] px-[8.8rem] md:px-[7rem] sm:px-4 btn btn-outline text-[#3f8cf4] text-xl hover:bg-[#5479f7] hover:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6283f0] focus:ring-offset-2 my-2 border-2 border-[#5479f7]">登入</button>
						</div>
					</div>
				</div>
			</form>

			<h1>Meeting Room Reservation System</h1>
      <button onClick={sendEmail}>Send Email</button>
		</>
	)
}

export default Login

/*
<div className="mb-4 relative">
	<FaUser className="absolute left-[8.7rem] top-[50%] transform -translate-y-1/2" style={{ color: '#3f8cf4', fontSize: '24px' }} />
	<button className="w-full bg-[#eaf1fe] px-[8.8rem] md:px-[7rem] sm:px-4 btn btn-outline text-[#3f8cf4] text-xl hover:bg-[#5479f7] hover:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6283f0] focus:ring-offset-2 my-2 border-2 border-[#5479f7]">登入</button>
</div>
*/