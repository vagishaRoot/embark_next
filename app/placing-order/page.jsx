"use client";

import React, { useEffect, useState } from "react";
import { Button, message, Steps, theme } from "antd";
import { useRecoilState } from "recoil";
import {
  cart,
  cookiesState,
  navigateState,
  placedOrders,
} from "../state/appAtom";
import Cookies from "js-cookie";
import { placedOrder } from "../services/storeAPI";
import TakeEmail from "../components/TakeEmail";
import OrderListing from "../components/OrderListing";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BuyNow = () => {
  //First Blank Request
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [cookies, setCookies] = useRecoilState(cookiesState);
  const [cartDetails, setCartDetails] = useRecoilState(cart);
  const [jumpToLogin, setJumpToLoagin] = useState(false);
  const [navigation, setNavigation] = useRecoilState(navigateState);
  const [orders, setOrders] = useState(placedOrders);
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      title: "First",
      content: <TakeEmail />,
    },
    {
      title: "Second",
      content: <OrderListing setCurrent={setCurrent} />,
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  useEffect(() => {
    if (Object.keys(cookies).length === 0) {
      router.push("/login");
    } else {
      getPlacedOrder();
    }
  }, [cookies]);

  useEffect(() => {
    if (orders.length === 0 && loading === false) {
      router.push("/shop");
    }
  }, [orders]);

  const getPlacedOrder = () => {
    setLoading(true);
    let id = cookies.id || cookies.userId;

    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };

    placedOrder(id, header)
      .then((res) => {
        setLoading(false);
        console.log(res);
        setOrders(res.data.orders[res.data.orders.length - 1].items);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    // fetchData();
    setNavigation("");
    // getReviews()
    let secondDiv = document.getElementById("topHeader");
    secondDiv.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (
      Object.keys(cookies).length == 0 &&
      cartDetails?.length == 0 &&
      jumpToLogin
    ) {
      router.push("/login");
      setJumpToLoagin(false);
    }
  }, [cookies, cartDetails]);

  const logout = () => {
    Cookies.remove("userId");
    Cookies.remove("username");
    Cookies.remove("token");
    Cookies.remove("email");
    setCookies({});
    setCartDetails([]);
    setJumpToLoagin(true);
    // localStorage.removeItem('reload')
  };
  return (
    <>
      <Navbar />
      <div className="flex justify-center">
        <div className="w-[80%] flex flex-col gap-y-[30px] max-1800:w-[90%] 1024-768:w-[96%]">
          <Steps current={current} items={items} />
          <div>{steps[current].content}</div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: 24,
            }}
          >
            {current < steps.length - 1 && current === 0 ? (
              <Button type="primary" onClick={() => next()}>
                Proceed to checkout
              </Button>
            ) : (
              <></>
            )}
            {current === 0 ? (
              <Button type="" onClick={logout}>
                Jump to login page
              </Button>
            ) : (
              <></>
            )}
            {/* {current === steps.length - 1 && (
                <Button type="primary" onClick={() => {message.success('Processing complete!'); router.push("/")}}>
                    Done
                </Button>
                )} */}
            {current === 1 && <Button onClick={() => prev()}>Previous</Button>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default BuyNow;
