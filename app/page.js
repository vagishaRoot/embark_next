"use client";

import React, { useEffect, useState } from "react";
// import "../css/home.css";

import Icons from "./Icons/Icons";
import { useRecoilState } from "recoil";
import { cart, cookiesState, navigateState } from "./state/appAtom";
import {
  addToCart,
  buyNowApi,
  deleteProductCart,
  getCart,
  getStoreProduct,
  postWishlist,
  removeFromWishlist,
} from "./services/storeAPI";

import { Popover } from "antd";
import Cookies from "js-cookie";
import Link from "next/link";
import Navbar from "./components/Navbar";

const Home = () => {
  const [navigation, setNavigation] = useRecoilState(navigateState);
  const [storeData, setStoreData] = useState([]);
  const [cookies, setCookies] = useRecoilState(cookiesState);
  const [cartDetails, setCartDetails] = useRecoilState(cart);
  const [productInCart, setProductInCart] = useState([]);
  const [loader, setLoader] = useState(null);
  const [loading, setLoading] = useState(false);
  const [buyNowByIdLoader, setBuyNowByIdLoader] = useState(null);

  useEffect(() => {
    setNavigation("Home");
    fetchProduct();
    // let secondDiv = document.getElementById("topHeader")
    // secondDiv.scrollIntoView({ behavior: "smooth", block: "start" })
  }, []);

  const fetchProduct = () => {
    setLoading(true);
    getStoreProduct()
      .then((response) => {
        setLoading(false);
        setStoreData(response.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if (Object.keys(cookies).length && (cookies.id || cookies.userId)) {
      getCartDetails(cookies);
      console.log("cookies:- ", cookies);
    }
  }, [cookies]);

  console.log(storeData);

  const handleId = (id) => {
    // console.log("Digital Product ID :",id);
    // navigate(`/product_details/${id}`, { state: { id: id } });
  };

  const addToCartFunc = (id) => {
    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        // "Content-Type": "multipart/form-data",
      },
    };
    let cartObj = [];
    let obj = {};
    setLoader(id);
    obj["userId"] = cookies.id;
    obj["productId"] = id;
    if (!!obj.userId) {
      addToCart(obj, header)
        .then((res) => {
          // getCartDetails(cookies)
          let arr = [];

          localStorage.setItem("cart", JSON.stringify(res));
          res.data?.products.filter((v) => {
            arr.push(v.productId);
          });
          setProductInCart(arr);
          setLoader(null);
          cartDetails.forEach((v) => {
            if (v.productId._id !== id) {
              cartObj.push(v);
            }
          });
          let objs = {};
          objs["productId"] = storeData.filter((v) => v._id === id)[0];
          objs["_id"] = res.data?.products.filter(
            (v) => v.productId === id
          )[0]._id;
          cartObj.push(objs);

          setCartDetails(cartObj);
        })
        .catch((err) => {
          setLoader(null);
          console.log(err);
        });
    }
  };

  const content = (
    <div>
      <p>Please Login First</p>
      <Link href="/login/home" className="underline text-cyan-600 font-lg">
        Click here to login
      </Link>
    </div>
  );

  const getCartDetails = (cookie) => {
    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        // "Content-Type": "multipart/form-data",
      },
    };
    let arr = [];
    getCart(cookie.id, header)
      .then((res) => {
        setLoader(null);
        console.log(res.data[0].products);
        res.data[0].products.forEach((v) => {
          arr.push(v.productId._id);
        });
        setCartDetails(res.data[0]?.products.filter((v) => !!v.productId));
        setProductInCart(arr);
      })
      .catch((err) => console.log(err));
  };

  const buyNow = (obj) => {
    let { _id, discount, price } = obj;
    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };
    let objs = {
      userId: cookies.id || cookies.userId,
      items: [
        {
          productId: _id,
          quantity: 1,
          price: !!discount
            ? parseFloat(
                parseFloat(price) - (parseFloat(price) * discount) / 100
              ).toFixed(2)
            : price,
        },
      ],
    };
    setBuyNowByIdLoader(_id);
    buyNowApi(objs, header)
      .then((res) => {
        console.log(res);
        // navigate('/placing-order')
        setBuyNowByIdLoader(null);
      })
      .catch((err) => {
        console.log(err);
        setBuyNowByIdLoader(null);
      });
  };

  return (
    <>
    <Navbar  />
      <div className="w-full">
        <img src="/images/home_banner.png" className="w-full" />
        {/* <div className=" circle w-[310px] h-[300px] flex flex-col justify-center gap-y-4  ">
          <h1 className=" text-2xl font-bold text-black  underline underline-offset-4 font-small">
            Embark Your Creativity
          </h1>
          <p className=" text-xl font-medium text-black leading-8 font-small ">
            Relax, unwind, and create with reverse coloring books
          </p>
        </div> */}
      </div>

      <div className=" flex justify-center mt-8 ">
        <div className="w-[80%] flex items-center py-2">
          <div className="w-[99%] max-768:hidden">
            <img src="/images/line_2.png" className="w-full" alt="Line image" />
          </div>
          <div className="w-1/2 flex justify-center max-768:w-full">
            <p className="text-2xl text-center text-[#FFA585] px-6">
              About Our Idea . . .
            </p>
          </div>
          <div className="w-[99%] max-768:hidden">
            <img src="/images/line_2.png" className="w-full" alt="Line image" />
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full">
        <p className="w-[70%] text-lg mt-7 font-small text-center">
          Introducing our innovative concept: the Reverse Colouring Book. This
          isn't just any colouring book; it's a canvas for emotional expression
          and personal growth. Our reverse colouring book stands as a testament
          to our creativity, where one of us brings life to ideas through vivid
          sketches that reflect deep, personal emotions, while the other weaves
          words into intricate tapestries that tell our stories.
        </p>
      </div>

      <div className=" flex justify-center my-6">
        <img src="/images/home_gallery.png" alt="gallery image..." />
      </div>

      <div className=" flex justify-center mt-8 ">
        <div className="w-[80%] flex items-center py-2">
          <div className="w-[99%] max-768:hidden">
            <img src="/images/line_2.png" className="w-full" alt="Line image" />
          </div>
          <div className="w-1/2 flex justify-center max-768:w-full">
            <p className="text-2xl text-center text-[#46AED1] px-6 font-bold">
              What's Trending
            </p>
          </div>
          <div className="w-[99%] max-768:hidden">
            <img src="/images/line_2.png" className="w-full" alt="Line image" />
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center">
        {loading ? (
          <Icons string="loading" />
        ) : (
          <div className="w-[70%] 1700-1024:w-[85%] max-1024:w-[85%] grid grid-cols-4 justify-center gap-10 my-10 1700-1024:grid-cols-3 1300-680:grid-cols-2 max-680:grid-cols-1 max-680:justify-items-center">
            {storeData?.filter((v) => !!v.price)
              ?.slice(0, 4)
              .map((item, i) => (
                <div className="w-full flex justify-center" key={i}>
                  <div className="flex justify-center w-[310px]">
                    <div
                      className={`relative h-[400px] bg-center-top bg-no-repeats w-full border-2 rounded-md border-black justify-end items-center flex flex-col`}
                    >
                      <div className=" relative w-full rounded-lg  h-[55%] ">
                        <img
                          className=" object-cover w-full h-full p-[2px] border border-gray-500"
                          src={item.images[0].imageurl}
                          alt="..."
                        />

                        {!!item.discount ? (
                          <h3 className=" absolute top-4 left-2 bg-[#000000] w-[70px] h-[30px] flex items-center justify-center text-white rounded-full text-center font-medium ">
                            On Sale
                          </h3>
                        ) : (
                          <></>
                        )}
                        {item.category === "Digital" ? (
                          <div className="  absolute  top-[79%]  w-full flex h-[46px] justify-start">
                            <div className="w-[120px] bg-white rating-box flex justify-center h-full py-2">
                              <div className="w-[100px] h-full flex justify-center items-center bg-[#ccc]">
                                {`${item.review || 5}`}/5 ratings
                              </div>
                            </div>
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>

                      <div className=" w-full h-[45%] min-1440:h-[50%] flex flex-col justify-between items-start relative bg-white py-4 px-[10px] gap-y-2 shadow-[0_-1px_1px]">
                        <div className="flex flex-col items-start gap-y-2">
                          <div className="flex gap-x-[15px] items-start">
                            <Icons string="bookTitle" />
                            <h1
                              className="leading-normal text-lg font-small 1330-768:text-lg 931-768:text-base 931-768:font-medium w-[250px] truncate"
                              title={item.title}
                            >
                              {item.title}
                            </h1>
                          </div>
                          <div className="flex gap-x-[15px] items-center">
                            <Icons string="bookPrice" />
                            <div className="flex justify-center gap-x-2 text-lg font-medium min-1440:text-lg ">
                              <p>
                                $
                                {parseFloat(
                                  parseFloat(item.price) -
                                    (parseFloat(item.price) * item.discount) /
                                      100
                                ).toFixed(2)}
                              </p>
                              {!!item.discount ? (
                                <p className="opacity-50 line-through font-small text-base min-1440:text-lg">
                                  ${parseFloat(item.price).toFixed(2)}
                                </p>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-x-[15px] items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              fill="grey"
                              className="bi bi-asterisk"
                              viewBox="0 0 16 16"
                            >
                              <path d="M8 0a1 1 0 0 1 1 1v5.268l4.562-2.634a1 1 0 1 1 1 1.732L10 8l4.562 2.634a1 1 0 1 1-1 1.732L9 9.732V15a1 1 0 1 1-2 0V9.732l-4.562 2.634a1 1 0 1 1-1-1.732L6 8 1.438 5.366a1 1 0 0 1 1-1.732L7 6.268V1a1 1 0 0 1 1-1" />
                            </svg>
                            <h1 className="font-small font-bold 1330-768:text-sm 931-768:text-base 931-768:font-medium">
                              {item.category} Product
                            </h1>
                          </div>
                        </div>
                        <div
                          className={`w-full ${
                            item.category === "Digital"
                              ? "justify-between"
                              : "justify-center"
                          } flex`}
                        >
                          {item.category === "Digital" ? (
                            <>
                              {Object.keys(cookies).length ? (
                                productInCart.includes(item._id) ||
                                (cartDetails?.length &&
                                  cartDetails?.filter(
                                    (v) => v.productId?._id === item._id
                                  ).length) ? (
                                  <button
                                    className="flex gap-x-[2px] flex-wrap px-2 py-1 rounded text-white font-small font-medium text-base bg-[#E2425C] cursor-pointer"
                                    title="Remove from cart"
                                  >
                                    Added to Cart
                                  </button>
                                ) : (
                                  <button
                                    className="flex gap-x-[2px] flex-wrap px-2 py-1 rounded text-white font-small font-medium text-base bg-[#E2425C] cursor-pointer"
                                    onClick={() => addToCartFunc(item._id)}
                                  >
                                    {loader === item._id ? (
                                      <Icons
                                        string="loading"
                                        width="24px"
                                        height="24px"
                                      />
                                    ) : (
                                      "Add to Cart"
                                    )}
                                  </button>
                                )
                              ) : (
                                <Popover content={content} trigger="click">
                                  <div className="flex gap-x-[2px] flex-wrap px-2 py-1 rounded text-white font-small font-medium text-base bg-[#E2425C] cursor-pointer">
                                    {loader === item._id ? (
                                      <Icons
                                        string="loading"
                                        width="24px"
                                        height="24px"
                                      />
                                    ) : (
                                      "Add to Cart"
                                    )}
                                  </div>
                                </Popover>
                              )}
                              {Object.keys(cookies).length ? (
                                <button
                                  className="px-2 py-1 rounded text-white font-small font-medium text-base bg-[#689F38]"
                                  onClick={() => buyNow(item)}
                                >
                                  {buyNowByIdLoader === item._id ? (
                                    <Icons
                                      string="loading"
                                      width="24px"
                                      height="24px"
                                    />
                                  ) : (
                                    "Buy Now"
                                  )}
                                </button>
                              ) : (
                                <Popover content={content} trigger="click">
                                  <div className="px-2 py-1 rounded text-white font-small font-medium text-base bg-[#689F38]">
                                    Buy Now
                                  </div>
                                </Popover>
                              )}
                            </>
                          ) : (
                            <></>
                          )}

                          <Link
                            href={
                              item.category === "Digital"
                                ? `/shop/product_details/${item._id}`
                                : item.amazon_link
                            }
                            target={item.category === "Digital" ? "" : "_blank"}
                            className="px-2 py-1 rounded cursor-pointer text-white font-small font-medium text-base bg-[#46AED1]"
                          >
                            View More
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
