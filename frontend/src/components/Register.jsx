import { useState } from 'react'
import { FaUserEdit } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa";
import validation from './Registervalidition';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Register = () => {
	const [values, setValues] = useState({
		empnumber: '',
		password: '',
	});

	const navigate = useNavigate();
	const [errors, setErrors] = useState({

	});
	const handleInput = (event) => {
		setValues(prev => ({...prev, [event.target.name]: [event.target.value] }))
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setErrors(validation(values));
		if(errors.empnumber === "" && errors.password === ""){
			axios.post('http://localhost:8081/signup', values)
			.then(res => {
				navigate('/');
			})
			.catch(err => console.log(err))
		}
	};

    return (
        <>
			<form action="" onSubmit={handleSubmit}>
				<div className="flex items-center justify-center h-screen">
					<div className="bg-[#caddff] p-8 rounded-md shadow-md max-w-md w-full">
						<label className="block font-MochiyPopOne mb-1 text-md text-[#3f8cf4] dark:text-neutral-50" htmlFor="input1">
							工號
						</label>
						<div className="mb-4 relative">
							<i className="fa-solid fa-user text-lg text-[#3f8cf4] absolute left-3 top-1/2 transform -translate-y-1/2"></i>
							<input name="empnumber" onChange={handleInput} type="text" className="w-full border-2 border-[#5479f7] rounded-md py-2 pl-10 focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2" />
						</div>
						{errors.empnumber && <span className='text-red-400'>{errors.empnumber}</span>}
						
						<label className="block font-MochiyPopOne mb-1 text-md text-[#3f8cf4] dark:text-neutral-50" htmlFor="input1">
							密碼
						</label>
						<div className="mb-4 relative">
							<i className="fa-solid fa-lock text-lg text-[#3f8cf4] absolute left-3 top-1/2 transform -translate-y-1/2"></i>
							<input name="password" onChange={handleInput} type="password" className="w-full border-2 border-[#5479f7] rounded-md py-2 pl-10 focus:outline-none focus:border-[#3f8cf4] focus:ring-2 focus:ring-[#3f8cf4] focus:ring-offset-2" />
						</div>
						{errors.password && <span className='text-red-400 mt-10'>{errors.password}</span>}

						<div className="mb-4 relative">
							<FaUserEdit className="absolute left-[8.2rem] top-[50%] transform -translate-y-1/2" style={{color: '#3f8cf4', fontSize: '30px'}}/>
							<button className="w-full bg-[#eaf1fe] px-[8.8rem] md:px-[7rem] sm:px-4 btn btn-outline text-[#3f8cf4] text-xl hover:bg-[#5479f7] hover:text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#6283f0] focus:ring-offset-2 my-2 border-2 border-[#5479f7]">註冊</button>
						</div>
					</div>
				</div>
			</form>
        </>
    )
}

export default Register