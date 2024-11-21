"use client";

import React, { useEffect, useState } from "react";
import Icons from "../Icons/Icons";
import { Button } from "antd";
import { cookiesState, navigateState, prevOrderArray } from "../state/appAtom";
import { useRecoilState } from "recoil";
import { placedOrder } from "../services/storeAPI";
import { getPrevOrder } from "../services/cartOrder";
import Cookies from "js-cookie";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const data = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 3,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
  {
    id: 7,
  },
];

const AllOrders = () => {
  const [cookies, setCookies] = useRecoilState(cookiesState);
  const [loading, setLoading] = useState(false);
  const [navigation, setNavigation] = useRecoilState(navigateState);
  const [loader, setLoader] = useState(false);
  const [allOrders, setAllOrders] = useRecoilState(prevOrderArray);

  useEffect(() => {
    setNavigation("");
    let secondDiv = document.getElementById("topHeader");
    secondDiv.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (!!cookies.id) {
      getPlacedOrder();
      getAllOrders(cookies);
    }
  }, [cookies]);

  const getAllOrders = (obj) => {
    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };
    setLoading(true);
    getPrevOrder(obj.id, header)
      .then((res) => {
        setLoading(false);
        if (res.response) {
          console.log(res);
          setAllOrders([]);
        } else {
          console.log(res);
          res.data.product ? setAllOrders(res.data.product) : setAllOrders([]);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

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
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Navbar />
      {loader ? (
        <div className="flex w-full justify-center">
          <Icons string="loading" />
        </div>
      ) : (
        <>
          {Object.keys(cookies).length ? (
            <div className="flex flex-col justify-center py-[20px]">
              <div className="text-2xl font-bold w-full text-center underline underline-offset-4">
                All Previous Orders
              </div>
              {loading ? (
                <div className="w-full flex justify-center">
                  <Icons string="loading" />
                </div>
              ) : (
                <>
                  {allOrders?.length ? (
                    <div className=" w-[85%]  mx-auto max-768:w-[95%] grid grid-cols-4 justify-center gap-10 mt-[15px] mb-10 1600-1024:grid-cols-3 1024-425:grid-cols-2 max-680:grid-cols-1 max-680:justify-items-center">
                      {allOrders.map((idx, i) => (
                        <div
                          key={i}
                          className="h-[400px] w-[310px] flex flex-col justify-start border-4 items-center p-5 gap-y-[10px] "
                        >
                          <div className="h-[55%] w-full">
                            <img
                              src={idx.productId.images[0].imageurl}
                              alt="..."
                              className="object-cover w-full h-full p-[2px] border border-gray-500"
                            />
                          </div>
                          <div className="h-[45%] flex flex-col w-full justify-between">
                            <div className="hidden">{idx.productId._id}</div>
                            <div className="flex gap-x-[15px] w-full items-center">
                              <Icons string="bookTitle" />
                              <h3 className="text-left font-bold font-small text-lg w-[219px] truncate">
                                {idx.productId.title}
                              </h3>
                            </div>
                            <div className=" flex  items-center gap-[10px] w-full">
                              <Icons string="bookPrice" />
                              <h3 className="font-semibold">
                                {idx.productId.discount
                                  ? parseFloat(
                                      parseFloat(idx.productId.price) -
                                        (parseFloat(idx.productId.price) *
                                          idx.productId.discount) /
                                          100
                                    ).toFixed(2)
                                  : parseFloat(idx.productId.price).toFixed(2)}
                              </h3>
                              {!!idx.productId.discount ? (
                                <p className="opacity-50 line-through font-small text-base min-1440:text-lg">
                                  ${parseFloat(idx.productId.price).toFixed(2)}
                                </p>
                              ) : (
                                <></>
                              )}
                            </div>
                            <Link
                              href={`/product_details/${idx.productId._id}`}
                            >
                              <Button type="primary">View Detail</Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-lg py-4 font-bold w-full text-center">
                      You didn't ordered any book
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-center py-[20px] bg-[#f1f3f6]">
                <div className="w-1/2 flex flex-col items-center bg-white py-[15px]">
                  <img
                    src="/images/missingCartItems.jpg"
                    className="h-[250px]"
                  />
                  <div className="text-lg font-small font-semibold">
                    Missing Wishlist items?
                  </div>
                  <div className="text-base font-small">
                    Login to see the items you added previously
                  </div>
                  <Link
                    href="/login/wishlist"
                    className="bg-[#46AED1] flex justify-center text-white w-[100px] py-[5px] font-small mt-[15px]"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </>
          )}
        </>
      )}
      <Footer />
    </>
  );
};

export default AllOrders;
