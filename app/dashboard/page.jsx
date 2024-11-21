"use client";

import React, { useEffect, useState } from "react";
import Icons from "../Icons/Icons";
import Cookies from "js-cookie";
import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Slider,
  notification,
} from "antd";
import {
  cart,
  cookiesState,
  navigateState,
  prevOrderArray,
} from "../state/appAtom";
import { useRecoilState } from "recoil";
import { getCart, getWishlist } from "../services/storeAPI";
import { changePassword, forgotPassword } from "../services/authAPI";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const data = [
  {
    id: 1,
    color: "#ffb59b",
    heading: "1st Level",
    order: "5 Orders",
    price: "5%",
  },
  {
    id: 2,
    color: "#ff9b9c",
    heading: "2nd Level",
    order: "10 Orders",
    price: "10%",
  },
  {
    id: 3,
    color: "#9af0ff",
    heading: "3rd Level",
    order: "15 Orders",
    price: "15%",
  },
  {
    id: 4,
    color: "#9bcdff",
    heading: "4th Level",
    order: "20 Orders",
    price: "20%",
  },
  {
    id: 5,
    color: "#be8cd7",
    heading: "5th Level",
    order: "25 Orders",
    price: "25%",
  },
];

const User_Dashboard = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  // const [userDetails,setUserDetails] = useState({})
  const [cookies, setCookies] = useRecoilState(cookiesState);
  const [notifications, setNotification] = useState(null);
  const [navigation, setNavigation] = useRecoilState(navigateState);
  const [api, contextHolder] = notification.useNotification();
  const [cartDetails, setCartDetails] = useRecoilState(cart);
  const [wishlist, setWishlist] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [allOrders, setAllOrders] = useRecoilState(prevOrderArray);

  useEffect(() => {
    if (notifications === false) {
      setNotification(null);
    }
  }, [notifications]);

  useEffect(() => {
    if (Object.keys(cookies).length === 0) {
      router.push("/login");
    }
    setNavigation("");
  }, []);

  const marks = {
    10: "1",
    30: "2",
    50: "3",
    70: "4",
    90: "5",
  };

  useEffect(() => {
    if (!!Cookies.get("username") || !!Cookies.get("email")) {
      let obj = {
        username: Cookies.get("username"),
        email: Cookies.get("email"),
        id: Cookies.get("userId"),
      };
      setCookies(obj);
      getCartDetails(obj);
    }
  }, []);

  const getCartDetails = (cookie) => {
    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        // "Content-Type": "multipart/form-data",
      },
    };
    getCart(cookie.id, header)
      .then((res) => {
        setCartDetails(res?.data[0]?.products.filter((v) => !!v.productId));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const logout = () => {
    Cookies.remove("userId");
    Cookies.remove("username");
    Cookies.remove("token");
    Cookies.remove("email");
    Cookies.remove("credential");
    setCookies({});
    setCartDetails([]);
    router.push("/login");
    // localStorage.removeItem('reload')
    // setJumpToLoagin(true);
  };

  useEffect(() => {
    if (Object.keys(cookies).length) {
      getAllWishlist();
      console.log("cookies:- ", cookies);
    }
  }, [cookies]);

  const forgotPasswordModal = () => {
    if (!Cookies.get("credential") || !cookies.email) {
      openNotification(
        "Your session is timed out. Please login",
        false,
        "error"
      );
      setTimeout(() => {
        logout();
      }, 3000);
    } else {
      setIsModalOpen(true);
    }
  };

  const openNotification = (message, pauseOnHover, type) => {
    api[type]({
      message: message,
      duration: 6,
      showProgress: true,
      pauseOnHover,
      placement: "topLeft",
    });
  };

  const handleOk = () => {};

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getAllWishlist = () => {
    if (Object.keys(cookies).length) {
      // debugger
      let id = cookies.id || cookies.userId;
      let arr = [];
      getWishlist(id)
        .then((res) => {
          console.log(res.data[0].products);
          res.data[0].products.forEach((v) => {
            if (!!v.productId) {
              arr.push(v.productId._id);
            }
          });
          setWishlist(res?.data[0]?.products.filter((v) => !!v.productId));
          localStorage.setItem("wishlist", JSON.stringify(arr));
        })
        .catch((err) => {});
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (e) => {
    let obj = { ...e, email: cookies.email };
    let { currentPassword } = e;
    if (currentPassword === window.atob(Cookies.get("credential"))) {
      setLoader(true);
      delete obj["currentPassword"];
      console.log(obj);
      changePassword(obj)
        .then((res) => {
          setLoader(false);
          if (res.response) {
            openNotification(res.response.data.message, true, "error");
          } else {
            openNotification(res.data.message, true, "success");
            setIsModalOpen(false);
          }
        })
        .catch((err) => {
          setLoader(false);
          console.error(err);
        });
    } else {
      alert("Your Current password is wrong");
    }
  };

  const onFinishFailed = () => {};

  const allOrdersNumber = (num) => {
    let type = "1st";
    switch (num) {
      case 10:
        type = "2nd";
        break;

      case 15:
        type = "3rd";
        break;

      case 20:
        type = "4th";
        break;

      case 25:
        type = "5th";
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Navbar />
      {Object.keys(cookies).length && allOrders ? (
        <>
          {contextHolder}
          <div className="flex items-center justify-center relative">
            <div className="flex flex-col w-[90%] items-center gap-y-[20px]">
              <div className="w-full flex justify-between items-center max-650:flex-col">
                <div className=" mt-8  flex gap-5 w-full">
                  <Avatar
                    className="max-425:hidden"
                    size={{ xs: 64, sm: 64, md: 64, lg: 64, xl: 80, xxl: 100 }}
                  >
                    {cookies.username?.slice(0, 1).toUpperCase()}
                  </Avatar>
                  {/* <img
                src="https://images.pexels.com/photos/3718056/pexels-photo-3718056.jpeg?auhref=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                className="  rounded-full w-36 h-36 "
                alt="profile image"
              /> */}
                  <div className=" flex flex-col gap-[10px]">
                    <h1 className=" text-xl font-semibold">
                      {cookies.username}
                    </h1>
                    <h1 className=" text-xl font-semibold">{cookies.email}</h1>
                    <h5 className=" text-lg  font-medium">
                      Order Level: {allOrdersNumber(allOrders?.length)} Level (
                      {allOrders?.length} orders)
                    </h5>
                    <div className=" flex items-center  gap-2">
                      <div className=" w-4 h-4 bg-green-500 rounded-full"></div>
                      <h5 className=" text-green-500 text-lg font-medium">
                        Active
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-[15px]">
                  <button
                    className="px-[15px] py-[10px] bg-green-600 text-white rounded text-nowrap"
                    onClick={forgotPasswordModal}
                  >
                    Reset Password
                  </button>
                  <button
                    className="px-[15px] py-[10px] bg-red-600 text-white rounded"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              </div>
              {/* <div className="flex w-full justify-start">
            <div className=" border-2 rounded-lg  w-[40%]  mt-10">
              <div className=" mx-8 my-8">
                <div className=" flex justify-between">
                  <h2 className=" underline text-xl font-bold ">
                    Personal Information
                  </h2>
                  <Icons string="update details" width="30" height="30" />
                </div>
                <div className=" flex flex-col gap-y-3 mt-6">
                  <div className=" ">
                    <h4 className=" text-lg font-semibold ">Username</h4>
                    <h3>Lorem ipsum dolor </h3>
                  </div>
                  <div>
                    <h4 className=" text-lg font-semibold ">Email</h4>
                    <h3>{cookies.email}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
              <div className="py-5 flex flex-col w-full items-start gap-y-[30px]">
                <div className="text-3xl underline underline-offset-8 font-small font-bold w-full text-center">
                  Your Level
                </div>
                <div className="flex flex-col w-full gap-y-[5px]">
                  <div className="w-full mt-5 flex gap-x-[30px] justify-center max-650:gap-x-[10px]">
                    {data.map((item, idx) => (
                      <div
                        key={item.id}
                        className="w-[300px] h-72 768-650:h-auto max-650:h-auto border-2  text-center flex flex-col items-center py-[15px]"
                        style={{ backgroundColor: item.color }}
                      >
                        <Avatar
                          size={{
                            xs: 40,
                            sm: 40,
                            md: 50,
                            lg: 64,
                            xl: 64,
                            xxl: 64,
                          }}
                          className="bg-white text-black"
                        >
                          {item.heading}
                        </Avatar>

                        <h2 className=" text-xl font-bold mt-[25px] mb-[15px] 768-650:text-base max-650:text-base max-425:text-xs">
                          {item.order}
                        </h2>
                        <h4 className=" text-lg font-medium max-650:text-base max-425:text-xs">
                          Cashback
                        </h4>
                        <h4 className=" text-lg font-medium max-650:text-base max-425:text-xs">
                          {item.price}
                        </h4>
                      </div>
                    ))}
                  </div>
                  <div className="pb-5 w-full level-slider">
                    <Slider
                      marks={marks}
                      step={1}
                      value={allOrders?.length * 4 - 10}
                      tooltip={{ formatter: null }}
                    />
                  </div>
                </div>
              </div>

              <div className="py-5 flex flex-col w-full items-start gap-y-[30px]">
                <div className="text-3xl underline underline-offset-8 font-small font-bold w-full">
                  Order Management
                </div>
                <div className="flex flex-wrap gap-[55px]">
                  <Link
                    className="flex items-center w-[300px] bg-[#46aed180] py-[10px] px-[20px] rounded-[19px] border-[#46AED1] border-[3px]"
                    href="/orders"
                  >
                    <div className=" rounded-full text-center  w-[80px] h-[80px] p-2 bg-white text-xl font-bold flex justify-center items-center">
                      <Icons
                        string="package_order"
                        width="35px"
                        height="35px"
                      />
                    </div>
                    <div className="text-2xl font-small font-bold w-[195px] text-center">
                      You Ordered {allOrders?.length} Items
                    </div>
                  </Link>
                  <Link
                    className="flex items-center w-[300px] bg-[#ffa58580] py-[10px] px-[20px] rounded-[19px] border-[#FFA585] border-[3px]"
                    href="/wishlist"
                  >
                    <div className=" rounded-full text-center  w-[80px] h-[80px] p-2 bg-white text-xl font-bold flex justify-center items-center">
                      <Icons
                        string="dashboard_wishlist"
                        width="35px"
                        height="35px"
                      />
                    </div>
                    <div className="text-2xl font-small font-bold w-[195px] text-center">
                      You Wishlisted {wishlist.length} Items
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            {/* {isModalOpen 
        ? <div className="show-modal bg-white">
            <div className="flex relative">
              <div className="absolute right-[10px] top-[10px]" onClick={()=>setIsModalOpen(false)}>
                <Icons string="cros" width="30px" height="30px" svgCondition="without circle"/>
              </div>
              <ResetPassword />
            </div>
          </div> 
        : <></>} */}
          </div>
          <Modal
            title="Reset Password"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[]}
          >
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
              <div className="flex flex-col gap-y-2">
                <Form.Item
                  label="Current Password"
                  name="currentPassword"
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
                  <Input.Password placeholder="Current Password" />
                </Form.Item>
                <Divider>New Password Section</Divider>
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
                  <Input.Password placeholder="Password" />
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
                <div className="flex justify-center gap-x-[10px]">
                  <Button htmlType="button" onClick={onReset}>
                    Reset
                  </Button>
                  <Button
                    type="primary"
                    className="bg-green-700 flex gap-x-[10px] justify-center items-center"
                    htmlType="submit"
                  >
                    Verify{" "}
                    {loader ? (
                      <Icons string="loading" width="24px" height="24px" />
                    ) : (
                      <Icons string="verify" width="18px" height="18px" />
                    )}
                  </Button>
                </div>
              </div>
            </Form>
          </Modal>
        </>
      ) : (
        <div className="flex justify-center w-full">
          <Icons string="loading" />
        </div>
      )}
      <Footer />
    </>
  );
};

export default User_Dashboard;
