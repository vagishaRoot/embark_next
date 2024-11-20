"use client"

import React from 'react'
import { useRecoilState } from 'recoil';
import { cookiesState } from '../state/appAtom';

const TakeEmail = () => {
    const [cookies, setCookies] = useRecoilState(cookiesState);
    return (
        <div className="flex flex-col items-start mt-[20px] gap-y-[20px]">
            <div className="flex flex-col gap-y-[5px]">
                <div className="text-lg font-bold underline underline-offset-4">Main Email</div>
                <div className="w-[250px] flex flex-col items-start py-[20px] px-[10px] border-2 border-dashed border-[#46AED1] gap-y-[5px]">
                    <div className="">{cookies.email}</div>
                </div>
            </div>
            <h6 className='text-balance'>
                <span className=' text-wrap font-bold text-lg underline underline-offset-4'>Important Note:</span>
                <span className=' text-wrap font-semibold capitalize'> After Payment, product's download link will be share on</span>
                <span className=" text-wrap text-xl text-[#46AED1] font-bold"> "{cookies.email}" </span>
                <span className=" text-wrap font-semibold capitalize"> email. If yes, Process to Payment page otherwise login with your choosed email id</span>
            </h6>
        </div>
    )
}

export default TakeEmail