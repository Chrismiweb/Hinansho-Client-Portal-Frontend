"use client"
import React, { useState } from 'react'
import { RiMenu3Fill } from "react-icons/ri";
import MobileSidebar from './MobileSidebar';
function HeaderMobile() {
    const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <div className='flex lg:hidden w-full items-center justify-between px-4 md:px-8 py-3 bg-white shadow-md mb-[30px]'>
        <div className='flex items-center gap-4'>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-slate-200">
                <img
                    src="https://i.pravatar.cc/100"
                    alt="User avatar"
                    className="w-full h-full object-cover"
                />
            </div>
            <div>
                <h1 className="text-[20px] md:text-[24px] font-semibold text-[#0F172B] flex items-center gap-2">
                    Hi, Chrismi! <span>👋</span>
                </h1>
                <p className="text-sm md:text-[18px] text-[#62748E]">
                    Welcome Back!
                </p>
            </div>
        </div>
        <div className='flex items-center gap-5'>
            <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-[#0000001A] shadow-md cursor-pointer flex items-center justify-center">
                <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
                    <path d="M9 17a3 3 0 0 0 6 0" />
                </svg>
            </button>
            <div onClick={() => setOpenSidebar(true)} className="cursor-pointer">
                <RiMenu3Fill className='text-[24px] md:text-[30px] font-semibold'/>
            </div>
                  <MobileSidebar
        open={openSidebar}
        onClose={() => setOpenSidebar(false)}
      />
        </div>
    </div>
  )
}

export default HeaderMobile