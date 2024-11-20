"use client";

import React, { useEffect, useState } from "react";
import Icons from "../Icons/Icons";
import { Button } from "antd";
import { cookiesState, navigateState } from "../state/appAtom";
import { useRecoilState } from "recoil";
import Navbar from "../components/Navbar";
import { getWishlist } from "../services/storeAPI";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Wishlist = () => {
  const router  = useRouter()
  const [cookies, setCookies] = useRecoilState(cookiesState);
  const [wishlist, setWishlist] = useState([]);
  const [navigation, setNavigation] = useRecoilState(navigateState);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setNavigation("");
    let secondDiv = document.getElementById("topHeader");
    secondDiv.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (Object.keys(cookies).length) {
      getAllWishlist();
      console.log("cookies:- ", cookies);
    }
  }, [cookies]);

  const getAllWishlist = () => {
    if (Object.keys(cookies).length) {
      // debugger
      setLoader(true);
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
          setLoader(false);
        })
        .catch((err) => {
          setLoader(false);
        });
    }
  };

  const viewMore = (id) => {
    router.push(`/product_details/${id}`);
  };

  return (
    <>
    <Navbar />
      {loader ? (
        <div className="flex w-full justify-center h-[370px]">
          <Icons string="loading" />
        </div>
      ) : (
        <>
          {Object.keys(cookies).length ? (
            <div className="flex justify-center flex-col py-[20px]">
              {wishlist.length ? (
                <>
                  <div className="w-full flex justify-center text-2xl font-bold">
                    All Wishlist
                  </div>
                  <div className=" w-[85%]  mx-auto max-768:w-[95%] grid grid-cols-4 justify-center gap-10 my-10 1700-1024:grid-cols-3 1300-680:grid-cols-2 max-680:grid-cols-1 max-680:justify-items-center">
                    {wishlist.map((idx, i) => (
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
                          <div className="flex gap-x-[15px] w-full items-center">
                            <Icons string="bookTitle" />
                            <h3 className="text-left w-full font-bold font-small text-lg w-[219px] truncate">
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
                            {idx.productId.discount ? (
                              <h3 className="line-through text-gray-400 font-semibold">
                                {parseFloat(idx.productId.price).toFixed(2)}
                              </h3>
                            ) : (
                              <></>
                            )}
                          </div>
                          <Button
                            type="primary"
                            onClick={() => viewMore(idx.productId._id)}
                          >
                            View Detail
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-lg py-4 font-bold w-full flex justify-center gap-x-[15px] items-center h-[370px]">
                  <Icons string="empty wishlist" />
                  <span className="text-3xl">No items in Wishlist</span>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-center py-[20px] bg-[#f1f3f6]">
                <div className="w-1/2 flex flex-col items-center bg-white py-[15px] max-650:w-[80%] max-425:w-full">
                  <img src="/images/missingCartItems.jpg" className="h-[250px]" />
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
    </>
  );
};

export default Wishlist;
