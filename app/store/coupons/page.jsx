"use client";

import React, { useEffect, useState } from "react";
import { Divider, notification } from "antd";
import { deleteCoupons, fetchCoupons } from "../../services/coupon";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/app/components/AdminNavbar";
import Link from "next/link";
import Icons from "@/app/Icons/Icons";

const CouponAdmin = () => {
  const [coupon, setCoupon] = useState([]);
  const [loader, setLoader] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("logginId") === null) {
      router.push("/store");
    } else {
      if (localStorage.getItem("loginTime") === null) {
        router.push("/store");
      } else {
        let time = JSON.parse(localStorage.getItem("loginTime"));
        if (parseInt((new Date() - new Date(time)) / (1000 * 60 * 60)) > 23) {
          localStorage.removeItem("loggedId");
          localStorage.removeItem("loginTime");
          router.push("/store");
        }
      }
    }
  }, []);

  useEffect(() => {
    let selectedNavbar = document.querySelector(".coupon-page");
    selectedNavbar.style.background = "#46aed1";
    selectedNavbar.style.color = "white";

    return () => {
      selectedNavbar.style.background = "transparent";
      selectedNavbar.style.color = "black";
    };
  }, []);

  const [api, contextHolder] = notification.useNotification();

  const fetchCoupon = () => {
    let token = localStorage.getItem("logginId");
    const header = {
      headers: {
        Authorization: `Bearer ${token.split("--")[1]}`,
        // "Content-Type": "multipart/form-data",
      },
    };
    setLoader(true);
    fetchCoupons(header)
      .then((response) => {
        setLoader(false);
        console.log(response);
        setCoupon(response.data.coupon);
      })
      .catch((err) => {
        setLoader(false);
        console.error(err);
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

  useEffect(() => {
    fetchCoupon();
  }, []);

  const updateCoupon = (id) => {
    router.push(`/store/faq/update-coupon/${id}`);
  };

  const couponsDelete = (id) => {
    let token = localStorage.getItem("logginId");
    const header = {
      headers: {
        Authorization: `Bearer ${token.split("--")[1]}`,
        // "Content-Type": "multipart/form-data",
      },
    };
    setLoader(true);
    deleteCoupons(id, header).then((res) => {
      openNotification(res.data.message, true, "success");
      fetchCoupon();
    });
  };

  return (
    <>
      <AdminNavbar />
      {contextHolder}
      <div className="flex flex-col justify-center items-center py-3 w-full gap-y-10">
        <div className="flex w-[90%] items-start">
          <Link
            className="flex px-4 py-2 font-small cursor-pointer text-white bg-[#46AED1] items-center gap-x-2"
            href="/store/coupons/add-coupon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="white"
              strokeClassName="bi bi-plus"
              viewBox="0 0 16 16"
              stroke="white"
            >
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>{" "}
            Add Coupons
          </Link>
        </div>
        <div className="flex justify-center items-center w-full flex-col">
          {!loader ? (
            coupon.length ? (
              <>
                <h1 className="text-center text-3xl font-bold">~ Coupons ~</h1>
                <div className=" grid grid-cols-5 1024-768:grid-cols-4 768-425:grid-cols-3 max-425:grid-cols-2 gap-5 w-[90%] pb-6">
                  {coupon.map((item) => (
                    <div
                      key={item._id}
                      className="w-full h-[160px] p-[10px] flex flex-col justify-between border border-gray-300 rounded-xl"
                    >
                      <div className="text-xl font-bold">{item.coupon}</div>
                      <div className="text-lg">
                        Discount: {item.percentage}%
                      </div>
                      <Divider className="m-0"></Divider>
                      <div className="w-full flex justify-around">
                        <span onClick={() => updateCoupon(item._id)}>
                          <Icons string="pen" width="30px" height="30px" />
                        </span>
                        <span onClick={() => couponsDelete(item._id)}>
                          <Icons string="delete" width="30px" height="30px" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <>
                  <div className="w-full flex flex-col items-center justify-center py-7">
                    <div className="text-4xl font-small font-bold">
                      Don't have any Coupons. Create One!
                    </div>
                  </div>
                </>
              </>
            )
          ) : (
            <div className="w-full flex flex-col items-center justify-center py-7">
              <Icons string="loading" />
              <div className="text-4xl font-small font-bold">Loading</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CouponAdmin;
