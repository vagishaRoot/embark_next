"use client"

import React from "react";
import { useRecoilState } from "recoil";
import { cookiesState } from "../state/appAtom";

const ThankyouMessage = () => {
  const [cookies, setCookies] = useRecoilState(cookiesState);

  return Object.keys(cookies).length ? (
    <div className="w-full flex justify-center">
      <div className="w-[80%] mt-[70px]">
        <div className="flex flex-col w-full items-start  gap-y-[15px]">
          <div className="text-3xl capitalize font-bold">
            Thank You {cookies.username}
          </div>
          <div className="text-xl">
            Your Order and Invoice has been send to your email :- "
            {cookies.email}"
          </div>
          <div className="text-xl">
            Drive Link of products are available there
          </div>
          <div className="text-3xl capitalize font-bold mt-[20px] text-purple-800">
            Thank You again For Choosing Us
          </div>
          <div className="text-xl">
            If any doubt, Please feel free to Contact us
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ThankyouMessage;
