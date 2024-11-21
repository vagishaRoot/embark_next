"use client";

import { Steps, notification } from "antd";
import React, { useEffect, useState } from "react";
import {
  changePassword,
  forgotPassword,
  otpVerifyForgotPassword,
} from "../services/authAPI";
import ResetPassword from "../components/ResetPassword";

import OtpResetPassword from "../components/OtpResetPassword";
import NewPassword from "../components/NewPassword";
import { useRecoilState } from "recoil";
import { navigateState } from "../state/appAtom";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ForgotPassword = () => {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [current, setCurrent] = useState(1);
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState("");
  const [navigation, setNavigation] = useRecoilState(navigateState);

  useEffect(() => {
    if (localStorage.getItem("forgotEmail") === null) {
      setCurrent(0);
    }
    setNavigation("");
    let secondDiv = document.getElementById("topHeader");
    secondDiv.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const verifyEmail = (input) => {
    let obj = {
      email: input,
    };
    setLoader("verifyEmail");
    forgotPassword(obj)
      .then((res) => {
        setLoader("");
        console.log(res.data);
        if (res.response) {
          openNotification(res.response.data.message, true, "error");
        } else {
          localStorage.removeItem("timer");
          let { otpToken, message, email } = res.data;
          openNotification(message, true, "success");
          setEmail(email);
          let obj = { otpToken, email };
          localStorage.setItem("forgotEmail", JSON.stringify(obj));
          setCurrent(1);
        }
      })
      .catch((err) => {
        setLoader("");
        console.log(err);
      });
  };

  const verifyOtp = (otp) => {
    let obj = JSON.parse(localStorage.getItem("forgotEmail"));
    let payload = {
      ...obj,
      otp,
    };
    setLoader("verifyOtp");
    otpVerifyForgotPassword(payload)
      .then((res) => {
        setLoader(null);
        console.log(res);
        if (res.response) {
          openNotification(
            res.response.data.message === "jwt expired"
              ? "OTP Expired"
              : res.response.data.message,
            true,
            "error"
          );
        } else {
          openNotification(res.data.message, true, "success");
          setCurrent(2);
        }
      })
      .catch((err) => {
        setLoader(null);
        console.log(err);
      });
  };

  const passwordReset = (obj) => {
    setLoader("new password");
    let objs = JSON.parse(localStorage.getItem("forgotEmail"));
    let payload = {
      email: objs.email,
      password: obj.password,
      confirmPassword: obj.confirmPassword,
    };
    console.log(payload);

    changePassword(payload)
      .then((res) => {
        setLoader(null);
        if (res.response) {
          openNotification(res.response.data.message, true, "error");
        } else {
          openNotification(res.data.message, true, "success");
          localStorage.removeItem("forgotEmail");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      })
      .catch(() => {
        setLoader(null);
      });
  };

  const steps = [
    {
      title: "First",
      content: (
        <ResetPassword
          verifyEmail={verifyEmail}
          loader={loader === "verifyEmail"}
        />
      ),
    },
    {
      title: "Second",
      content: (
        <OtpResetPassword
          email={email}
          verifyOtp={verifyOtp}
          loader={loader === "verifyOtp"}
          verifyEmail={verifyEmail}
        />
      ),
    },
    {
      title: "Last",
      content: (
        <NewPassword
          loader={loader === "new password"}
          passwordReset={passwordReset}
        />
      ),
    },
  ];

  const openNotification = (message, pauseOnHover, type) => {
    api[type]({
      message,
      duration: 6,
      showProgress: true,
      pauseOnHover,
      placement: "topLeft",
    });
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <>
      <Navbar />
      {contextHolder}
      <div className="flex justify-center">
        <div className="w-[80%] flex flex-col gap-y-[30px] max-1800:w-[90%]">
          <Steps current={current} items={items} />
          <div>{steps[current].content}</div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ForgotPassword;
