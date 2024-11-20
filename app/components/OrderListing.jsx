"use client";

import React, { useEffect, useState } from "react";
import { placedOrder } from "../services/storeAPI";
import {
  cart,
  cookiesState,
  couponObject,
  orderDiscount,
  placedOrders,
  prevOrderArray,
} from "../state/appAtom";
import { useRecoilState } from "recoil";
import Icons from "../Icons/Icons";
import { getPrevOrder, payment, sendEmail } from "../services/cartOrder";
import { notification } from "antd";
import Cookies from "js-cookie";
import { updateCoupons, verifyCoupon } from "../services/coupon";
import { useRouter } from "next/navigation";

const OrderListing = ({ setCurrent }) => {
  const router = useRouter();
  const [cookies, setCookies] = useRecoilState(cookiesState);
  const [orders, setOrders] = useRecoilState(placedOrders);
  const [totalPrice, setTotalPrice] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState(false);
  const [allOrders, setAllOrders] = useRecoilState(prevOrderArray);
  const [cartDetails, setCartDetails] = useRecoilState(cart);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [prevOrderDiscount, setPrevOrderDiscount] =
    useRecoilState(orderDiscount);
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useRecoilState(couponObject);

  useEffect(() => {
    getPlacedOrder();
    // getAllOrders(cookies)
  }, [cookies]);

  console.log("====================================");
  console.log(prevOrderDiscount);
  console.log("====================================");

  // const getAllOrders = (obj) => {
  //   getPrevOrder(obj.id)
  //   .then((res)=>{
  //      debugger
  //     if(!!res.response){
  //       console.log(res);
  //     } else {
  //       console.log(res.data.orders);
  //       debugger
  //       localStorage.setItem('orders', JSON.stringify(res.data.orders))
  //       if(res.data.orders.length){
  //         let arr = res.data.orders.reduce((acc, item) => {
  //           // Loop through each product in the current item
  //           item.product.forEach(product => {
  //             // Check if the productId already exists in the accumulator
  //             const existingProduct = acc.find(existing => existing._id === product.productId._id);

  //             // If it doesn't exist, add it to the accumulator
  //             if (!existingProduct) {
  //               acc.push(product.productId);
  //             }
  //           });
  //           return acc;
  //         }, []);
  //         setAllOrders(arr)
  //       }
  //     }
  //   })
  //   .catch((err)=>{
  //     console.log(err);
  //   })
  // }

  console.log("allOrders:- ", allOrders);

  const getPlacedOrder = () => {
    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };
    let id = cookies.id || cookies.userId;
    placedOrder(id, header)
      .then((res) => {
        console.log(res);
        let arr = [];
        res.data.orders[res.data.orders.length - 1].items.forEach((v) => {
          let obj = {};
          if (!!v.productId) {
            obj["productId"] = v.productId;
            obj["_id"] = v._id;
          }
          if (Object.keys(obj).length) {
            arr.push(obj);
          }
        });
        if (arr.length) {
          setOrders(arr);
        } else {
          router.push("/shop");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const sendEmails = () => {
    // getAllOrders(cookies)
    setLoader(true);
    let obj = {},
      objs = {};
    obj["userid"] = cookies.id;
    obj["username"] = cookies.username;
    obj["user_email"] = cookies.email;
    obj["discount"] = Object.keys(couponApplied).length
      ? couponApplied.percentage
      : !!prevOrderDiscount
      ? prevOrderDiscount + " %"
      : 0;
    obj["product"] = [];
    orders.forEach((v) => {
      let obj2 = {};
      obj2["productId"] = v.productId._id;
      obj.product.push(obj2);
    });
    objs["user_name"] = cookies.username;
    objs["total_amount"] = Object.keys(couponApplied).length
      ? parseFloat(
          totalPrice - totalPrice * (couponApplied.percentage / 100)
        ).toFixed(2)
      : prevOrderDiscount
      ? parseFloat(totalPrice - totalPrice * (prevOrderDiscount / 100))
      : parseFloat(totalPrice).toFixed(2);
    objs["currency"] = "USD";
    objs["description"] = `Payment of ${
      cookies.username
    } on ${new Date().toDateString()}`;

    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };
    // debugger
    payment(objs, header)
      .then((res) => {
        setLoader(false);
        console.log(res);
        window.location.href = res.data.forwardLink;
      })
      .catch((err) => {
        setLoader(false);
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
    // debugger
    let arr = 0;
    console.log("orders:- ", orders);
    if (orders.length) {
      orders.forEach((v) => {
        // debugger
        if (v.productId) {
          if (!!v.productId?.discount) {
            arr =
              parseFloat(arr) +
              parseFloat(
                parseFloat(v.productId.price) -
                  (parseFloat(v.productId.price) * v.productId.discount) / 100
              );
          } else {
            arr = parseFloat(arr) + parseFloat(v.productId?.price);
          }
        }
      });
      console.log(arr);
      setTotalPrice(arr);
    }
  }, [orders]);

  const verifyingToken = () => {
    setRefreshLoader(true);
    let obj = {};
    obj["user_email"] = cookies.email;
    obj["coupon"] = couponInput;

    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };

    verifyCoupon(obj, header)
      .then((res) => {
        setRefreshLoader(false);
        console.log(res);
        if (res.response === undefined) {
          localStorage.setItem(
            "couponApplied",
            JSON.stringify(res.data.coupon)
          );
          setCouponApplied(res.data.coupon);
        } else {
          openNotification(res.response.data.message, true, "error");
        }
      })
      .catch((err) => {
        setRefreshLoader(false);
        console.log(err);
      });
  };

  const removeAppliedCoupon = () => {
    setRefreshLoader(true);
    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };
    updateCoupons(couponApplied._id, { check: false }, header)
      .then((res) => {
        setRefreshLoader(false);
        if (res.response === undefined) {
          localStorage.removeItem("couponApplied");
          setCouponApplied({});
        }
      })
      .catch((err) => {
        console.log(err);
        setRefreshLoader(false);
      });
  };

  console.log(
    "prev order discount",
    Object.keys(couponApplied).length
      ? parseFloat(
          totalPrice - totalPrice * (couponApplied.percentage / 100)
        ).toFixed(2)
      : prevOrderDiscount
      ? parseFloat(totalPrice - totalPrice * (prevOrderDiscount / 100))
      : parseFloat(totalPrice).toFixed(2)
  );

  return (
    <>
      {contextHolder}
      <div className="flex gap-x-[20px] justify-between max-768:flex-col max-768:gap-y-[20px] cart-section 1024-768:gap-x-[10px]">
        {orders.length ? (
          <div className="w-[1000px] flex flex-col max-1024:w-full gap-[10px] p-[15px] max-600:px-[5px] border-2 border-solid border-[#FFA585] rounded-lg bg-[#ffa68552]">
            {orders.map((idx, i) =>
              !!idx.productId ? (
                <div
                  key={i}
                  className="flex max-600:flex-col justify-start items-center gap-x-[30px] max-600:h-auto h-[200px] cart-product-section 1024-768:gap-x-[10px]"
                >
                  <div className=" h-full w-[200px] max-600:w-[300px] max-600:h-[300px] 1024-768:h-[200px] 1024-768:w-[200px]">
                    <img
                      className=" object-cover w-full h-full border border-gray-500"
                      src={idx.productId?.images[0].imageurl}
                      alt="..."
                    />
                  </div>
                  <div className="flex flex-col items-start h-full justify-around py-[20px]">
                    <div className="flex flex-col items-start gap-y-[10px]">
                      <h3 className="text-left font-bold font-small text-lg truncate">
                        {idx.productId?.title}
                      </h3>
                      Order id: {idx._id}
                    </div>
                    <div className=" flex  items-center gap-[10px] w-full">
                      <h3 className="font-semibold text-2xl">
                        $
                        {parseFloat(
                          parseFloat(idx.productId?.price) -
                            (parseFloat(idx.productId?.price) *
                              idx.productId?.discount) /
                              100
                        ).toFixed(2)}
                      </h3>
                      {idx.productId.discount !== null ? (
                        <h3 className="line-through text-gray-400 font-semibold">
                          ${parseFloat(idx.productId?.price).toFixed(2)}
                        </h3>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  {/* <div className=' flex gap-x-3 items-center  '>
                <Icons string="plus" height="20" width="20" />
                <h3 className=' border h-6 w-5 text-center  ' >5</h3>
                <Icons string="plus" height="20" width="20" />
              </div> */}
                  {/* <Button type="primary">Add to Cart</Button> */}
                </div>
              ) : (
                <></>
              )
            )}
          </div>
        ) : (
          <Icons string="loading" />
        )}
        <div className="w-[300px] 768-425:ml-auto max-425:mx-auto 1024-768:w-[400px]">
          <div className="flex flex-col items-center py-[15px] px-[20px] border-[2px] rounded-[8px] border-[#46AED1] bg-[#46aed120] gap-y-[10px]">
            <>
              <div className="font-small text-2xl text-[#46aed1] font-bold underline underline-offset-[6px]">
                Order Summary
              </div>
              <div className="flex justify-between w-full mt-5">
                <div className="font-medium text-xl">Book Total:</div>
                <div className="font-medium text-lg w-[75px]">
                  $ {parseFloat(totalPrice).toFixed(2)}
                </div>
              </div>
              {Object.keys(couponApplied).length ? (
                <></>
              ) : (
                <div className="flex justify-between w-full">
                  <div className="font-medium text-xl">Discount:</div>
                  <div className="font-medium text-lg w-[75px]">
                    {prevOrderDiscount
                      ? parseFloat(prevOrderDiscount).toFixed(2)
                      : 0}
                    %
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center w-full">
                {Object.keys(couponApplied).length ? (
                  <>
                    <div className="font-medium text-xl">
                      Coupon: {couponApplied.coupon}
                    </div>
                    <button
                      className="bg-red-600 px-[5px] text-white"
                      onClick={removeAppliedCoupon}
                    >
                      {refreshLoader ? (
                        <Icons string="loading" width="30px" height="30px" />
                      ) : (
                        "Remove"
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Any Coupon"
                      className="h-[30px] pl-[5px] outline-0 border border-black"
                      onChange={(e) => setCouponInput(e.target.value)}
                      value={couponInput}
                    />
                    <button
                      className="bg-black px-[10px] h-[30px] flex justify-center items-center text-white rounded-md"
                      onClick={verifyingToken}
                    >
                      {refreshLoader ? (
                        <Icons string="loading" width="30px" height="30px" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </>
                )}
              </div>
              <div className="flex justify-between w-full">
                <div className="font-medium text-xl">Total Price:</div>
                <div className="font-medium text-lg w-[75px]">
                  ${" "}
                  {Object.keys(couponApplied).length
                    ? parseFloat(
                        totalPrice -
                          totalPrice * (couponApplied.percentage / 100)
                      ).toFixed(2)
                    : prevOrderDiscount
                    ? parseFloat(
                        totalPrice - totalPrice * (prevOrderDiscount / 100)
                      ).toFixed(2)
                    : parseFloat(totalPrice).toFixed(2)}
                </div>
              </div>
              <button
                className="bg-[#46AED1] rounded-[8px] text-lg font-semibold text-white px-[20px] py-[10px]"
                onClick={() => (loader ? {} : sendEmails())}
              >
                {loader ? (
                  <img src="/images/loadingSpinner.gif" className="w-[16px]" />
                ) : (
                  "Place Order"
                )}
              </button>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderListing;
