"use client"

import React, { useEffect, useState } from "react";
import "../css/user_login.css";
import { Alert, Button, Divider, Form, Input, message, notification } from "antd";
import { login, postOtp, signup } from "../services/authAPI";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { cookiesState, navigateState } from "../state/appAtom";

import OtpTimerRegisteration from "./OtpTimerRegisteration.js";
import { useRouter } from "next/navigation";
import { adminLogin } from "../adminServices/adminAuth";

const User_Login = ({
  height = undefined,
  openPopup = undefined,
  setOpenModal = undefined,
}) => {
  const [form] = Form.useForm();
//   const navigateLink = useParams();
  const [authComp, setAuthComp] = useState("Login");
  const [otpSectionShow, setOtpSectionShow] = useState(null);
  const [api, contextHolder] = notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [cookies, setCookies] = useRecoilState(cookiesState);
  const [navigation, setNavigation] = useRecoilState(navigateState);
  const [loginLoader, setLoginLoader] = useState(false);
  const [registerLoader, setRegisterLoader] = useState(false);
  const [otpLoader, setOtpLoader] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [otpError, setOtpError] = useState("");
  const router = useRouter()
//   const navigate = useNavigate();

  const signUpBtn = () => {
    let loginContainer = document.querySelector(".login_container");
    loginContainer.classList.add("slide");
    setAuthComp("Register");
  };

  const signInBtn = () => {
    let loginContainer = document.querySelector(".login_container");
    loginContainer.classList.remove("slide");
    setAuthComp("Login");
  };

  const openNotification = (
    message,
    pauseOnHover,
    type,
    duration = undefined
  ) => {
    api[type]({
      message: message,
      duration: duration || 4,
      showProgress: true,
      pauseOnHover,
    });
  };

  const openMessage = (content, type) => {
    messageApi.open({
      type: type,
      content: content,
      className: 'custom-class',
      duration: 5,
      style: {
        marginTop: '20vh',
        fontSize:'25px',
      },
    }).then(()=>{
      if(type === 'success') {
        router.push('/store/dashboard')
      }
    })
  };

  useEffect(() => {
    if (!height) {
      setNavigation("");
    }
    let localStorage2 = localStorage.getItem("otpsectionOpen");
    let localStorage3 = localStorage.getItem("registerOtptimer");
    let signInLocalStorage = localStorage.getItem("signin");
    // debugger
    if (localStorage3 === "0") {
      localStorage.removeItem("registerOtptimer");
    }
    if (!!localStorage2 && !!signInLocalStorage) {
      let loginContainer = document.querySelector(".login_container");
      loginContainer.classList.add("slide");
      setAuthComp("Register");
      setOtpSectionShow(JSON.parse(signInLocalStorage).email);
    }
  }, []);

  /* useEffect(() => {
    if (Object.keys(cookies).length && Object.keys(navigateLink).length === 0) {
      router.push("/dashboard");
    } else if (
      Object.keys(cookies).length &&
      Object.keys(navigateLink).length
    ) {
      if (navigateLink.router.push === "home") {
        router.push(`/`);
      } else {
        router.push(`/${navigateLink.router.push.replaceAll("-", "/")}`);
      }
    }
  }, [cookies]); */

  useEffect(() => {
    if (!!otpSectionShow) {
      form.resetFields();
    }
  }, otpSectionShow);

  const loginUser = (e) => {
    login(e)
      .then((res) => {
        // debugger;
        setLoginLoader(false);
        localStorage.removeItem("otpsectionOpen");
        localStorage.removeItem("registerOtptimer");
        localStorage.removeItem("timer");
        if (res.response) {
          // debugger
          if (!!openPopup) {
            setLoginError(res.response.data.message);
          }
          openNotification(
            res.response.data.message === "Server Error"
              ? "Invalid Credentials"
              : res.response.data.message,
            true,
            "error"
          );
        } else {
          Cookies.set("credential", window.btoa(e.password));
          Cookies.set("username", res.data.user.username);
          Cookies.set("email", res.data.user.email);
          Cookies.set("token", res.data.token);
          Cookies.set("userId", res.data.user.id);
          openNotification("Login Successfully", true, "success");
          form.resetFields();
          setCookies({
            username: res.data.user.username,
            email: res.data.user.email,
            userId: res.data.user.id,
          });
          window.location.reload();
          if (!!openPopup) {
            openPopup();
          }
        }
      })
      .catch((err) => {
        setLoginLoader(false);
        console.error(err);
      });
  };

  const loginAdmin = (obj) => {
    adminLogin(obj)
    .then((res) => {
      // debugger
      console.log(res);
      setLoginLoader(false);
      if (res.response === undefined) {
        localStorage.setItem(
          "logginId",
          `${res.data.user.id}--${res.data.token}`
        );
        localStorage.setItem("loginTime", JSON.stringify(new Date()));
        openMessage('You are logged in as "Admin". You are redirecting to Dashboard', 'success')
      } else {
        openMessage(res.response.data.message, "error");
      }
    })
    .catch((err) => {
      setLoginLoader(false);
      console.log(err);
    });
  }

  const onFinish = (e) => {
    if (authComp === "Login") {
      setLoginLoader(true);
      if(e.email === 'embarkyourcreativity@gmail.com'){
        loginAdmin(e)
      } else{
        loginUser(e);
      }
    } else if (authComp === "Register") {
      // debugger;
      if(e.email === "embarkyourcreativity@gmail.com") {
        alert(`You can't make an account through this email. This email is already in use`)
      } else{
        if (
          !(
            e.email.includes("gmail.com") ||
            e.email.includes("yahoo.com") ||
            e.email.includes("outlook.com")
          )
        ) {
          if (!!openPopup) {
            setLoginError(
              `Please choose "GMAIL" or "OUTLOOK" or "YAHOO" Accounts to register`
            );
          } else {
            openNotification(
              `Please choose "GMAIL" or "OUTLOOK" or "YAHOO" Accounts to register`,
              true,
              "error",
              7
            );
          }
        } else {
          setRegisterLoader(true);
          setLoginError(null);
          signup(e)
            .then((res) => {
              setRegisterLoader(false);
              if (res.response) {
                if (!!openPopup) {
                  setRegisterError(res.response.data.message);
                } else {
                  openNotification(res.response.data.message, true, "error");
                }
              } else {
                let obj = {};
                obj["otpToken"] = res.data.otpToken;
                obj["email"] = res.data.email;
                obj["username"] = res.data.username;
                obj["password"] = res.data.password;
                localStorage.setItem("signin", JSON.stringify(obj));
                console.log(res);
                localStorage.removeItem("registerOtptimer");
                setOtpSectionShow(e.email);
                localStorage.setItem("otpsectionOpen", true);
                openNotification(
                  "Please Check your registered email. We've sent OTP on your email",
                  true,
                  "success"
                );
              }
              // form.resetFields();
            })
            .catch((error) => {
              setRegisterLoader(false);
              console.log(error);
            });
        }
      }
    }
    console.log(e);
  };
  const onFinishFailed = (e) => {
    console.log(e);
  };

  const onFinishOtps = (e) => {
    let signObj = JSON.parse(localStorage.getItem("signin"));
    let obj = {
      otp: e.OTP,
      otpToken: signObj.otpToken,
      email: signObj.email,
      username: signObj.username,
      password: signObj.password,
    };
    setOtpLoader(true);
    postOtp(obj)
      .then((response) => {
        console.log(response);
        // debugger
        if (response.response) {
          setOtpLoader(false);
          if (!!openPopup) {
            setOtpError(response.response.data.message);
          } else {
            openNotification(response.response.data.message, true, "error");
          }
        } else {
          localStorage.removeItem("otpsectionOpen");
          localStorage.removeItem("signin");
          localStorage.removeItem("registerOtptimer");

          let obj2 = {
            email: signObj.email,
            password: signObj.password,
          };
          login(obj2)
            .then((res) => {
              // debugger;
              setLoginLoader(false);
              if (res.response) {
                // debugger
                if (!!openPopup) {
                  setLoginError(res.response.data.message);
                }
                openNotification(
                  res.response.data.message === "Server Error"
                    ? "Invalid Credentials"
                    : res.response.data.message,
                  true,
                  "error"
                );
              } else {
                localStorage.removeItem("otpsectionOpen");
                localStorage.removeItem("timer");
                setOtpLoader(false);
                setOtpSectionShow(null);
                openNotification(
                  "OTP Verified and User Created Successfully",
                  true,
                  "success"
                );
                console.log("response:- ", response);
                localStorage.removeItem("registerOtptimer");

                Cookies.set("credential", window.btoa(obj2.password));
                Cookies.set("username", res.data.user.username);
                Cookies.set("email", res.data.user.email);
                Cookies.set("token", res.data.token);
                Cookies.set("userId", res.data.user.id);
                openNotification("Login Successfully", true, "success");
                form.resetFields();
                setCookies({
                  username: res.data.user.username,
                  email: res.data.user.email,
                  userId: res.data.user.id,
                });
                window.location.reload();
                if (!!openPopup) {
                  openPopup();
                }
              }
            })
            .catch((err) => {
              setLoginLoader(false);
              console.error(err);
            });
        }
      })
      .catch((err) => {
        setOtpLoader(false);
        console.log(err);
      });
  };

  const onFinishFailedOtps = (e) => {
    console.log(e);
  };

  const forgotPassword = () => {
    if (!!setOpenModal) {
      setOpenModal(false);
    }
    localStorage.removeItem("forgotEmail");
    localStorage.removeItem("timer");
    router.push("/reset-password");
  };

  const resetOtpForm = () => {
    form.resetFields();
  };

  const resetAll = () => {
    localStorage.removeItem("otpsectionOpen");
    localStorage.removeItem("registerOtptimer");
    localStorage.removeItem("signin");
    setOtpSectionShow(null)
  }

  const resendOtp = () => {
    if (localStorage.getItem("signin") === null) {
      setOtpSectionShow(null);
    } else {
      let { email, username, password } = JSON.parse(
        localStorage.getItem("signin")
      );
      let obj = { email, username, password, confirmPassword: password };
      signup(obj)
        .then((res) => {
          // setRegisterLoader(false)
          if (res.response) {
            if (!!openPopup) {
              setRegisterError(res.response.data.message);
            } else {
              openNotification(res.response.data.message, true, "error");
            }
          } else {
            let obj = {};
            obj["otpToken"] = res.data.otpToken;
            obj["email"] = res.data.email;
            obj["username"] = res.data.username;
            obj["password"] = res.data.password;
            localStorage.setItem("signin", JSON.stringify(obj));
            console.log(res);
            // setOtpSectionShow(e.email);
            openNotification(
              "Please Check your registered email. We've sent OTP on your email",
              true,
              "success"
            );
          }
          // form.resetFields();
        })
        .catch((error) => {
          // setRegisterLoader(false)
          console.log(error);
        });
    }
  };
  return (
    <>
      {contextHolder}
      {messageContextHolder}
      {Object.keys(cookies).length ? (
        <></>
      ) : (
        <div
          className="login_container"
          style={!!height ? { height: "500px", minHeight: "auto" } : {}}
        >
          <div className="auth_container">
            <div className="box signin">
              <h2>Already Have an Account ?</h2>
              <button className="signinBtn" title="button" onClick={signInBtn}>
                Sign in
              </button>
            </div>
            <div className="box signup">
              <h2>Don't Have an Account ?</h2>
              <button className="signupBtn" onClick={signUpBtn}>
                Sign up
              </button>
            </div>
            <div className="auth_formBox">
              <div className="form signinform">
                <h2 className="py-[10px] font-bold text-2xl">Login</h2>
                {!!loginError ? (
                  <Alert
                    message={loginError}
                    type="error"
                    className="w-[80%]"
                    showIcon
                    closable
                    onClose={() => setLoginError("")}
                  />
                ) : (
                  <></>
                )}
                <div className="w-[80%]">
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
                  >
                    <Form.Item
                      // hasFeedback
                      label="Email"
                      name="email"
                      rules={[
                        {
                          min: 3,
                        },
                        {
                          required: true,
                        },
                        {
                          warningOnly: true,
                        },
                      ]}
                    >
                      <Input placeholder="Email" type="email" suffix={false} />
                    </Form.Item>
                    <Form.Item
                      // hasFeedback
                      label="Password"
                      name="password"
                      rules={[
                        {
                          min: 8,
                          max: 16,
                        },
                        {
                          required: true,
                        },
                        {
                          warningOnly: true,
                        },
                      ]}
                    >
                      <Input.Password placeholder="Password" />
                    </Form.Item>
                    <div className="flex gap-x-2 w-full justify-center">
                      <Button type="primary" htmlType="submit">
                        Submit{" "}
                        {loginLoader ? (
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
                      </Button>
                      <Button>Reset</Button>
                    </div>
                    <div className="w-full flex justify-center mt-[10px]">
                      <a
                        type="text"
                        className="text-blue-500 text-lg"
                        onClick={forgotPassword}
                      >
                        Forgot Password?
                      </a>
                    </div>
                  </Form>
                </div>
                <div className="switch-tabs mt-[5px]">
                  <div className="flex items-center gap-x-[5px]">
                    Don't have an Account?{" "}
                    <span
                      className="text-sky-500 underline underline-offset-4"
                      onClick={signUpBtn}
                    >
                      Register
                    </span>
                  </div>
                </div>
              </div>
              <div className="form signupform">
                {!!otpSectionShow ? (
                  <>
                    <h2 className="pt-[10px] font-bold text-2xl">OTP</h2>
                    <h2 className="pb-[20px] font-semibold text-gray-500 text-base">
                      On this email, you get your digital product
                    </h2>
                    {!!otpError ? (
                      <Alert
                        message={otpError}
                        type="error"
                        className="w-[80%]"
                        showIcon
                        closable
                        onClose={() => setOtpError("")}
                      />
                    ) : (
                      <></>
                    )}
                    <div className="w-[80%]">
                      <Form
                        name="otpForm"
                        className="w-full"
                        layout="vertical"
                        autoComplete="off"
                        initialValues={{ remember: true }}
                        onFinish={onFinishOtps}
                        onFinishFailed={onFinishFailedOtps}
                      >
                        <Form.Item
                          label="Enter OTP"
                          name="OTP"
                          rules={[
                            { min: 4 },
                            { required: true },
                            { warningOnly: true },
                          ]}
                        >
                          <Input.OTP length={6} />
                        </Form.Item>

                        <div className="flex gap-x-2 w-full justify-center">
                          <Button type="primary" htmlType="submit">
                            Submit
                            {otpLoader ? (
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
                          </Button>
                          <Button htmlType="button" onClick={resetOtpForm}>
                            Reset
                          </Button>
                        </div>
                        <OtpTimerRegisteration resendOtp={resendOtp} />
                        <Divider className="text-sm">Register from Another Account?</Divider>
                        <div className="flex justify-center w-full">
                          <button className="bg-green-700 text-white px-3 py-2" onClick={resetAll}>
                            Click Here
                          </button>
                        </div>
                      </Form>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="py-[10px] font-bold text-2xl">Register</h2>
                    {!!registerError ? (
                      <Alert
                        message={registerError}
                        type="error"
                        className="w-[80%]"
                        showIcon
                        closable
                        onClose={() => setRegisterError("")}
                      />
                    ) : (
                      <></>
                    )}
                    <div className="w-[80%]">
                      <Form
                        name="triggerRegister"
                        className="w-full"
                        layout="vertical"
                        autoComplete="off"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                      >
                        {!!loginError ? (
                          <Alert
                            message={loginError}
                            type="error"
                            className="w-[100%]"
                            showIcon
                            closable
                            onClose={() => setLoginError("")}
                          />
                        ) : (
                          <></>
                        )}
                        <Form.Item
                          label="Username"
                          name="username"
                          rules={[
                            { min: 4 },
                            { required: true },
                            { warningOnly: true },
                          ]}
                        >
                          <Input placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                          label="Your Email"
                          name="email"
                          rules={[
                            { type: "email", message: "invalid input" },
                            { min: 3 },
                            { required: true },
                            { warningOnly: true },
                          ]}
                        >
                          <Input placeholder="Your Email" />
                        </Form.Item>
                        <Form.Item
                          label="Your Password"
                          name="password"
                          dependencies={["confirmPassword"]}
                          rules={[
                            {
                              min: 8,
                              message: "Please enter atleast 8 inputs",
                            },
                            { required: true },
                            { warningOnly: true },
                          ]}
                        >
                          <Input.Password placeholder="Password" />
                        </Form.Item>
                        <Form.Item
                          label="Confirm Password"
                          name="confirmPassword"
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
                                if (
                                  !value ||
                                  getFieldValue("password") === value
                                ) {
                                  return Promise.resolve();
                                }
                                return Promise.reject(
                                  new Error(
                                    "This password that you entered do not match!"
                                  )
                                );
                              },
                            }),
                          ]}
                        >
                          <Input.Password placeholder="Confirm your Password" />
                        </Form.Item>
                        <div className="flex gap-x-2 w-full justify-center">
                          <Button type="primary" htmlType="submit">
                            Submit
                            {registerLoader ? (
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
                          </Button>
                          <Button>Reset</Button>
                        </div>
                      </Form>
                    </div>
                    <div className="switch-tabs mt-[5px]">
                      <div className="flex items-center gap-x-[5px]">
                        Already Have an Account?{" "}
                        <span
                          className="text-sky-500 underline underline-offset-4"
                          onClick={signInBtn}
                        >
                          Login
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default User_Login;
