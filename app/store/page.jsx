"use client"

import React, { useEffect, useState } from "react";
import "../css/admin.css";
import { Button, Divider, Form, Input, Modal, notification } from "antd";
import Icons from "../Icons/Icons";
import { adminLogin, newPasswordAdmin, verifyAdminEmail, verifyAdminOtp } from "../adminServices/adminAuth";
import AdminOtpTimer from "../components/AdminOtpTimer/AdminOtpTimer";
import { useRouter } from "next/navigation";

const login = () => {
    const router = useRouter();
  const [passwordShow, setPasswordShow] = useState(false);
  const [loginInput, setLoginInput] = useState({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const onChange = (text) => {
        console.log('onChange:', text);
    };
    const sharedProps = {
        onChange,
    };

  const changeInput = ({ name, value }) => {
    let obj = { ...loginInput };
    obj[name] = value;
    setLoginInput(obj);
  };

  useEffect(() => {
    if (localStorage.getItem("loginTime") !== null) {
      let time = JSON.parse(localStorage.getItem("loginTime"));
      if (parseInt((new Date() - new Date(time)) / (1000 * 60 * 60)) > 23) {
        localStorage.removeItem("loggedId");
        localStorage.removeItem("loginTime");
        router.push("/store")
      } else {
        openNotification("You are logged in", false, "success");
        router.push("/store/dashboard");
      }
    } else {
      router.push("/store");
    }
  }, []);

  const loginSubmit = () => {
    if (!!loginInput.email && !!loginInput.password) {
      setLoginLoading(true);
      adminLogin(loginInput)
        .then((res) => {
          // debugger
          console.log(res);
          setLoginLoading(false);
          if (res.response === undefined) {
            localStorage.setItem(
              "logginId",
              `${res.data.user.id}--${res.data.token}`
            );
            localStorage.setItem("loginTime", JSON.stringify(new Date()));
            router.push("/store/dashboard");
          } else {
            openNotification(res.response.data.message, true, "error");
          }
        })
        .catch((err) => {
          setLoginLoading(false);
          console.log(err);
        });
    } else {
      alert("All Fields are required");
    }
  };

  const openNotification = (message, pauseOnHover, type) => {
    api[type]({
      message: message,
      duration: 2,
      showProgress: true,
      pauseOnHover,
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false)
  };
  const handleOk = () => {};
  const onFinish = (e) => {
    setLoader('confirmPassword')
    let obj = {}
    obj['email'] = 'embarkyourcreativity@gmail.com'
    obj['password'] = e.password
    obj['confirmPassword'] = e.confirmPassword;

    newPasswordAdmin(obj)
    .then((res)=>{
      setLoader('')
      if(res.response){

      } else {
        setIsModalOpen(false)
        openNotification(res.data.message, true, 'success')
        console.log(res);
      }
    })
    .catch((err) => {
      console.error(err);
      setLoader('')
    });

  };
  const onFinishFailed = () => {};
  const onReset = () => {};

  const verifyEmail = (resend = undefined) => {
    openNotification('sending OTP to admin Email', true, 'success')
    setLoader('verifyingEmail')
    let obj = { email: "embarkyourcreativity@gmail.com" };
    verifyAdminEmail(obj)
      .then((res) => {
        localStorage.removeItem('adminOtpTimer')
        setLoader('')
        console.log(res);
        localStorage.setItem("locals", res.data.otpToken);
        openNotification(res.data.message, "true", "success");
        setIsModalOpen(true);
        // debugger
      })
      .catch((err) => {
        setLoader('')
        console.error(err);
      });
  };

  const verifyOtp = (e) => {
    let obj = {}
    obj['otpToken'] = localStorage.getItem('locals')
    obj['email'] = 'embarkyourcreativity@gmail.com'
    obj['otp'] = e.otp
    setLoader('otpVerification')
    verifyAdminOtp(obj)
    .then((res)=>{
      localStorage.removeItem('locals')
      setLoader('')
      console.log(res);
      if(res.response){
        openNotification(res.response.data.message, true, 'error')
      } else {
        openNotification(res.data.message, true, 'success')
        setOtpVerified(true)
      }
    })
    .catch((err) => {
        console.error(err);
        setLoader('')
      });
  };

  const resendOtp = () => {
   
    verifyEmail('resend')
  }
  return (
    <>
      {contextHolder}
      <div className="bg-image-store-auth w-full flex justify-center items-center">
        <div className="login flex flex-col p-[10px] rounded-lg items-center w-[300px] bg-[#FFA585] gap-y-3">
          <div className="text-[18px] font-bold">Login</div>
          <div className="flex gap-x-2 items-center bg-white w-full rounded-[5px] px-[10px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-person-fill"
              viewBox="0 0 16 16"
            >
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            </svg>
            <input
              type="email"
              className="h-[30px] w-full bg-transparent border-none outline-none"
              placeholder="email"
              name="email"
              value={loginInput.email || ""}
              onChange={(e) => changeInput(e.target)}
            />
          </div>
          <div className="flex gap-x-2 items-center bg-white w-full rounded-[5px] px-[10px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-person-fill-lock"
              viewBox="0 0 16 16"
            >
              <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5v-1a2 2 0 0 1 .01-.2 4.49 4.49 0 0 1 1.534-3.693Q8.844 9.002 8 9c-5 0-6 3-6 4m7 0a1 1 0 0 1 1-1v-1a2 2 0 1 1 4 0v1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1zm3-3a1 1 0 0 0-1 1v1h2v-1a1 1 0 0 0-1-1" />
            </svg>
            <input
              type={passwordShow ? "text" : "password"}
              className="h-[30px] w-full bg-transparent border-none outline-none"
              placeholder="Passowrd"
              name="password"
              value={loginInput.password || ""}
              onChange={(e) => changeInput(e.target)}
            />
            <span onClick={() => setPasswordShow(!passwordShow)}>
              {!passwordShow ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-eye-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-eye-slash-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z" />
                  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z" />
                </svg>
              )}
            </span>
          </div>
          <div
            className="px-3 bg-green-700 text-white flex justify-center py-2 gap-x-[10px] items-center cursor-pointer"
            onClick={loginSubmit}
          >
            Submit
            {loginLoading ? (
              <img src="/images/loadingSpinner.gif" className="w-[16px]" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-check-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
              </svg>
            )}
          </div>
          <div
            className="text-sky-600 hover:underline underline-offset-4 cursor-pointer flex gap-x-[5px]"
            onClick={verifyEmail}
          >
            Forgot Password {loader === 'verifyingEmail' ? <div className="bg-gray-600"><Icons string="loading" width="24px" height="24px" /></div> : <Icons color="black" string="verify" width="18px" height="18px" />}

          </div>
        </div>
      </div>
      <Modal
        title="Reset Password"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      >
        <Form
          name="otp"
          className="w-full"
          layout="vertical"
          autoComplete="off"
          size="large"
          initialValues={{
            remember: true,
          }}
          disabled={otpVerified}
          onFinish={verifyOtp}
        >
          <Form.Item
            name="otp"
            label="OTP Verification"
            rules={[{ required: true }, { warningOnly: true }]}
          >
            <Input.OTP length={6} {...sharedProps} />
          </Form.Item>
          <AdminOtpTimer resendOtp={resendOtp} loader={loader === 'resentOTp'}/>
          <Button htmlType="submit" type="primary">Verify 
          {loader === 'otpVerification' 
            ? <Icons string="loading" width="24px" height="24px" /> 
            : <Icons string="verify" width="18px" height="18px" />
          }</Button>
        </Form>
        <Divider>New Password Section</Divider>
        <Form
          name="trigger"
          className="w-full"
          layout="vertical"
          autoComplete="off"
          size="large"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          disabled={!otpVerified}
        >
          <Form.Item
            name="password"
            label="New Password"
            dependencies={["confirmPassword"]}
            
            rules={[
              {
                min: 8,
                max: 16,
              },
              { required: true },
              { warningOnly: true },
            ]}
          >
            <Input.Password placeholder="Password"  />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              {
                min: 8,
                message: "Please enter atleast 8 inputs",
              },
              { required: true },
              { warningOnly: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("This password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm your Password"
            />
          </Form.Item>
          <div className="flex justify-center gap-x-[10px]">
            <Button
              type="primary"
              className="bg-green-700 flex gap-x-[10px] justify-center items-center"
              htmlType="submit"
            >
              Verify
              {loader==="confirmPassword" ? (
                <Icons string="loading" width="24px" height="24px" />
              ) : (
                <Icons string="verify" width="18px" height="18px" />
              )}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default login;
