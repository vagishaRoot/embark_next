"use client"

import { Button } from "antd";
import React from "react";
import { useState, useEffect } from "react";

const Timer = ({verifyEmail}) => {
  const [timer, setTimer] = useState(localStorage.getItem("timer") || 120);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        clearInterval(intervalId);
        // Handle timer expiration (e.g., show a message, disable actions)
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  useEffect(() => {
    localStorage.setItem("timer", timer);
  }, [timer]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const formattedTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`

  const resendOtp = () => {
    setTimer(120)
    let { email } = JSON.parse(localStorage.getItem('forgotEmail'))
    verifyEmail(email)
  }

  return (
    <div className="flex gap-x-[10px] items-center mt-[20px] w-full">
      <p>Link will expire in {formattedTime}</p>
      <Button
        className="bg-blue-800 text-white"
        size="medium"
        disabled={formattedTime !== "0:00"}
        onClick={resendOtp}
      >
        Resend
      </Button>
      {/* Your OTP input and other UI elements here */}
    </div>
  );
};

export default Timer;
