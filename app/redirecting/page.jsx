"use client";

import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { cart, placedOrders, prevOrderArray } from "../state/appAtom";
import Icons from "../Icons/Icons";
import { placedOrder } from "../services/storeAPI";
import { getPrevOrder, sendEmail } from "../services/cartOrder";
import { notification } from "antd";

import { useRouter } from "next/navigation";
import ThankyouMessage from "../components/ThankyouMessage";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SendingEmail = () => {
  const [wrongToken, setWrongToken] = useState(false);
  const [loader, setLoader] = useState(false);
  const [allOrders, setAllOrders] = useRecoilState(prevOrderArray);
  const [orders, setOrders] = useRecoilState(placedOrders);
  const [importantNote, setImportantNote] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const [cartDetails, setCartDetails] = useRecoilState(cart);

  /* useEffect(() => {
    if (userName === undefined || createdTime === undefined) {
      setWrongToken(true);
      localStorage.setItem("checked", false);
    } else {
      let time = createdTime.split("PAYID")[0];
      if (userName !== Cookies.get("username")) {
        setWrongToken(true);
        localStorage.setItem("checked", false);
      } else if ((new Date() - new Date(parseInt(time))) / (1000 * 60) > 5) {
        setWrongToken(true);
        localStorage.setItem("checked", false);
      } else {
        setLoader(true);
        localStorage.setItem("checked", true);
      }
    }
  }, [userName, createdTime]); */

  useEffect(() => {
    if (
      !!localStorage.getItem("checked") &&
      localStorage.getItem("checked") === "true" &&
      !!localStorage.getItem("credentials")
    ) {
      const header = {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      };
      setWrongToken(false);
      setLoader(true);
      let id = Cookies.get("userId");
      placedOrder(id, header)
        .then((res) => {
          console.log(res);
          if (res.response) {
            setWrongToken(true);
            setImportantNote(
              "If you have ordered some items and the payment is successful, then contact to customer Care or Whatsapp us"
            );
          } else {
            getAllOrders(id, res.data.orders[res.data.orders.length - 1].items);
            setOrders(res.data.orders[res.data.orders.length - 1].items);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setWrongToken(true);
    }
  }, []);

  const getAllOrders = (id, obj) => {
    let totalPrice = 0;
    obj.forEach((v) => {
      if (v.productId) {
        if (!!v.productId?.discount) {
          totalPrice =
            parseFloat(totalPrice) +
            parseFloat(
              parseFloat(v.productId.price) -
                (parseFloat(v.productId.price) * v.productId.discount) / 100
            );
        } else {
          totalPrice = parseFloat(totalPrice) + parseFloat(v.productId?.price);
        }
      }
    });
    console.log("total price:- ", totalPrice);
    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };
    getPrevOrder(id, header)
      .then((res) => {
        if (res.response) {
          console.log(res);
          setAllOrders([]);
        } else {
          console.log(res);
          // debugger
        }
        setAllOrders(res?.data?.product || []);
        sendEmails(obj, res?.data?.product || [], totalPrice);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendEmails = (productObj, allOrdersArr, price) => {
    // getAllOrders(cookies)
    let couponApplied = {};
    if (!!localStorage.getItem("couponApplied")) {
      let obj = JSON.parse(localStorage.getItem("couponApplied"));
      if (Cookies.get("email") === obj.user_email) {
        couponApplied = JSON.parse(localStorage.getItem("couponApplied"));
      }
    }
    console.log("couponApplied:- ", couponApplied);
    let obj = {},
      prevOrder = Cookies.get("orders");
    obj["userid"] = Cookies.get("userId");
    obj["username"] = Cookies.get("username");
    obj["user_email"] = Cookies.get("email");
    obj["discount"] = Object.keys(couponApplied).length
      ? price * couponApplied.percentage
      : parseInt(!!prevOrder ? prevOrder : 0);
    if (Object.keys(couponApplied).length) {
      obj["coupon"] = couponApplied.coupon;
    }

    obj["product"] = [];
    productObj.forEach((v) => {
      let obj2 = {};
      obj2["productId"] = v.productId._id;
      obj.product.push(obj2);
    });

    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };

    sendEmail(obj, header)
      .then((res) => {
        localStorage.removeItem("couponApplied");
        //   setLoader(false)
        localStorage.removeItem("checked");
        localStorage.removeItem("credentials");
        // setCartDetails([])
        let arr = allOrdersArr.length ? [...allOrdersArr] : [];
        console.log(allOrdersArr);
        productObj.forEach((v) => {
          let obj = {};
          obj["productId"] = v.productId;
          obj["_id"] = "id";
          if (arr.filter((l) => l._id === obj._id).length === 0) {
            arr.push(obj);
          }
        });
        console.log(arr);
        setAllOrders(arr);
        console.log(res);
        openNotification(res.data.message, false, "success");
        setLoader(false);
        setCartDetails([]);

        setTimeout(() => {
          router.push("/");
        }, 2000);
      })
      .catch((err) => {
        //   setLoader(false)
        console.log(err);
      });
  };

  const openNotification = (message, pauseOnHover, type) => {
    api[type]({
      message: message,
      duration: 2,
      showProgress: true,
      pauseOnHover,
    });
  };

  return (
    <>
    <Navbar/>
      {wrongToken ? (
      <div className="flex justify-center w-full items-center flex-col gap-y-[20px]">
        <div className="text-4xl font-bold capitalize">
          This link has expired
        </div>
        {!!importantNote ? (
          <div className="text-3xl bg-sky-500 p-2 text-white">
            {importantNote}
          </div>
        ) : (
          <></>
        )}
      </div>
      ) : (
      <>
        {contextHolder}
        {loader ? (
          <>
            <div className="flex justify-center w-full">
              <div className="w-[80%] flex flex-col items-center">
                <div className="text-4xl">
                  Email is sending. Please wait. Dont refresh
                </div>
                <Icons string="loading" />
              </div>
            </div>
          </>
        ) : (
          <>
            <ThankyouMessage />
          </>
        )}
      </>
      )}
      <Footer />
    </>
  );
};

export default SendingEmail;
