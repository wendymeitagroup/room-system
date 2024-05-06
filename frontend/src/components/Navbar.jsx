import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../images/meetingLogo.PNG";
import { FaCalendarPlus } from "react-icons/fa6";

const Navbar = () => {
  return (
    <>
        <div className="navbar bg-[#caddff] h-[1rem]">
            <div className="navbar-start">
                <div className="dropdown">
                    <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle hover:bg-[#f5f8ff]"
                    >
                        {/*菜單欄*/}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-[#5479f7]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h7"
                            />
                        </svg>
                    </div>
                    {/* 下拉菜單 */}
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-[#caddff] rounded-box w-52 text-center items-center font-MochiyPopOne"
                        >
                        <li>
                            <Link className="mx-auto px-[4.3rem] text-[#5479f7] hover:bg-[#5479f7] hover:text-[#ffffff]" to={'/'}>
                                <i className="fa-solid fa-house"></i><a>首頁</a>
                            </Link>
                        </li>
                        <li>
                            <Link className="mx-auto px-[4.3rem] text-[#5479f7] hover:bg-[#5479f7] hover:text-[#ffffff]" to={'/login'}>
                                <i className="fa-solid fa-user"></i><a >登入</a>
                            </Link>
                        </li>
                        <li>
                            <Link className="mx-auto px-[4.3rem] text-[#5479f7] hover:bg-[#5479f7] hover:text-[#ffffff]" to={'/register'}>
                                <i className="fa-solid fa-pen"></i><a >註冊</a>
                            </Link>
                        </li>
                        <li>
                            <Link className="mx-auto px-[4.3rem] text-[#5479f7] hover:bg-[#5479f7] hover:text-[#ffffff]" to={'/updateformanddeleteform'}>
                                <FaCalendarPlus style={{ fontSize: '16px' }}/><a >預約</a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
           {/* 導航欄標題 */}
           <div className="navbar-center flex items-center"> {/* Add flex and items-center */}
                {/* Logo */}
                <div className="mr-4"> {/* Add margin right for spacing */}
                    <img src={logo} alt="Logo" className="h-12 w-12" /> {/* Adjust height and width as needed */}
                </div>
                {/* Title */}
                <div className="text-xl text-[#5479f7] text-center font-MochiyPopOne">會議室預約系統</div>
            </div>
            <div className="navbar-end">

            </div>
      </div>
    </>
  );
};

export default Navbar;

/*
    <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1">Click</div>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>Item 1</a></li>
            <li><a>Item 2</a></li>
        </ul>
    </div>
*/
