"use client"

import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
import Icons from "../Icons/Icons";
import { Avatar, Button, Pagination, Popover, Tabs, notification } from "antd";
import {
  addToCart,
  buyNowApi,
  getAllReviews,
  getAmazonProduct,
  getCart,
  getDigitalProduct,
  getHardCopyProduct,
  getWishlist,
  postWishlist,
  removeFromWishlist,
} from "../services/storeAPI";
import { useRecoilState } from "recoil";
import {
  cart,
  cookiesState,
  navigateState,
  shopCartLoader,
  wishlistArray,
} from "../state/appAtom";
import Cookies from "js-cookie";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Shop = () => {
  useEffect(() => {
    let secondDiv = document.getElementById("topHeader");
    secondDiv.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const onChange = (key) => {};

  const items = [
    {
      key: "1",
      label: "Digital Products",
      children: <DigitalProduct />,
    },
    {
      key: "2",
      label: "Hand Coloring Book",
      children: <HardCopyProduts />,
    },
    {
      key: "3",
      label: "Amazon Products",
      children: <AmazonProduts />,
    },
  ];
  return (
    <>
    <Navbar />
      <div className="w-full">
        <img src="/images/shop_banner.png" className="w-full" />
      </div>
      <div className=" w-[85%]  mx-auto max-768:w-[95%]">
        <Tabs
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
          size="large"
          centered
        />
      </div>
      <Footer />
    </>
  );
};

export default Shop;

const content = (
  <div>
    <p>Please Login First</p>
    <Link href="/login" className="underline text-cyan-600 font-lg">
      Click here to login
    </Link>
  </div>
);

const DigitalProduct = () => {
  const [digitalData, setDigitalData] = useState([]);
  const [navigation, setNavigation] = useRecoilState(navigateState);
  const [cookies, setCookies] = useRecoilState(cookiesState);
  const [cartDetails, setCartDetails] = useRecoilState(cart);
  const [productInCart, setProductInCart] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [wishlist, setWishlist] = useRecoilState(wishlistArray);
  const [cartLoader, setCartLoader] = useRecoilState(shopCartLoader);
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageLoading, setNextPageLoading] = useState(false);
  const [wishlistLoader, setWishlistLoader] = useState(null);
  const [cartByIDLoader, setCartByIDLoader] = useState(null);
  const [buyNowByIdLoader, setBuyNowByIdLoader] = useState(null);
  const [allWishlistLoader, setAllWishlistLoader] = useState(false);
  const [current, setCurrent] = useState(3);
  const [totalItems, setTotalItems] = useState();

  const onChange = (page) => {
    console.log(page);
    setCurrent(page);
    fetchData(page);
  };
  console.log("cookies:- ", Cookies.get('email'));
//   const navigate = useNavigate();


useEffect(()=>{
  if(Cookies.get('email')){
    let obj = {}
    obj['email'] = Cookies.get('email')
    obj['token'] = Cookies.get('token')
    obj['id'] = Cookies.get('userId')
    setCookies(obj)
  }
},[])
  const fetchData = (nextpage = undefined) => {
    getDigitalProduct(nextpage)
      .then((response) => {
        setNextPageLoading(false);
        if (nextpage === undefined) {
          setCurrentPage(1);
          setPagination(response.data.totalPages);
          setTotalItems(response.data.totalCount);
        }
        if (digitalData.length) {
          setDigitalData([...digitalData, ...response.data.stores]);
        } else {
          setDigitalData([...response.data.stores]);
        }
      })
      .catch((err) => {
        console.error(err);
        setNextPageLoading(false);
      });
  };

  const openNotification = (message, pauseOnHover, type) => {
    api[type]({
      message: message,
      closeIcon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          className="bi bi-x"
          viewBox="0 0 16 16"
        >
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
        </svg>
      ),
      onClose: closeNotification,
      // duration: 6,
      // showProgress: true,
      // pauseOnHover,
    });
  };

  const closeNotification = () => {
    // navigate(`/login/shop`);
  };

  useEffect(() => {
    fetchData();
    setNavigation("Shop");
    getReviews();
  }, []);

  const handleId = (id) => {
    // navigate(`/product_details/${id}`, { state: { id: id } });
  };

  const getReviews = () => {
    getAllReviews()
      .then((res) => {
        console.log("reviews:- ", res);
        setReviews(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addToCartFunc = (id) => {
    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        // "Content-Type": "multipart/form-data",
      },
    };
    let obj = {},
      cartObj = [];
    obj["userId"] = cookies.id;
    obj["productId"] = id;
    if (!!obj.userId) {
      setCartByIDLoader(id);
      addToCart(obj, header)
        .then((res) => {
          let arr = [];
          localStorage.setItem("cart", JSON.stringify(res));
          res.data?.products.filter((v) => {
            arr.push(v.productId);
          });
          setProductInCart(arr);
          cartDetails.forEach((v) => {
            if (v.productId._id !== id) {
              cartObj.push(v);
            }
          });
          let objs = {};
          objs["productId"] = digitalData.filter((v) => v._id === id)[0];
          objs["_id"] = res.data.products.filter(
            (v) => v.productId === id
          )[0]._id;
          cartObj.push(objs);
          setCartDetails(cartObj);
          // getCartDetails(true)
          setCartByIDLoader(null);
        })
        .catch((err) => {
          console.log(err);
          setCartByIDLoader(null);
        });
    }
  };

  useEffect(() => {
    if (Object.keys(cookies).length) {
      getCartDetails();
      getAllWishlist();
      console.log("cookies:- ", cookies);
    } else {
      setCartLoader(false);
    }
  }, [cookies]);

  const getCartDetails = (callFromFunction = undefined) => {
    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        // "Content-Type": "multipart/form-data",
      },
    };
    let arr = [];
    if (!callFromFunction) {
      setCartLoader(true);
    }
    getCart(cookies.id, header)
      .then((res) => {
          if (!callFromFunction) {
            setCartLoader(false);
          }
        if(res && res.data.length){
          console.log(res?.data[0]?.products);
          res.data[0].products.forEach((v) => {
            arr.push(v.productId._id);
          });
          setCartDetails(res?.data[0]?.products.filter((v) => !!v.productId));
          setProductInCart(arr);
        }
      })
      .catch((err) => {
        if (!callFromFunction) {
          setCartLoader(false);
        }
        console.log(err);
      });
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
        // navigate("/placing-order");
        setBuyNowByIdLoader(null);
      })
      .catch((err) => {
        console.log(err);
        setBuyNowByIdLoader(null);
      });
  };

  const getAllWishlist = () => {
    setAllWishlistLoader(true);
    if (Object.keys(cookies).length) {
      let id = cookies.id || cookies.userId;
      let arr = [];
      getWishlist(id)
        .then((res) => {
          setAllWishlistLoader(false);
          res.data[0].products.forEach((v) => {
            arr.push(v.productId?._id);
          });
          setWishlist(arr.length ? arr : []);
          localStorage.setItem("wishlist", JSON.stringify(arr));
        })
        .catch((err) => {
          setAllWishlistLoader(false);
        });
    }
  };

  const addWishlist = (id) => {
    if (Object.keys(cookies).length) {
      const header = {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          // "Content-Type": "multipart/form-data",
        },
      };
      let arr = [];
      let obj = {};
      obj["userId"] = cookies.id || cookies.userId;
      obj["productId"] = id;
      setWishlistLoader(id);
      postWishlist(obj, header)
        .then((response) => {
          if (response.response === undefined && Object.keys(cookies).length) {            
            let id = cookies.id || cookies.userId;
            let arr = [];
            getWishlist(id)
              .then((res) => {
                setAllWishlistLoader(false);
                res.data[0].products.forEach((v) => {
                  arr.push(v.productId?._id);
                });
                setWishlist(arr.length ? arr : []);
                setWishlistLoader(null)
                localStorage.setItem("wishlist", JSON.stringify(arr));
              })
              .catch((err) => {
                setAllWishlistLoader(false);
              });            
          }
        })
        .catch((error) => {
          console.log(error);
          setWishlistLoader(null);
        });
      // setDigitalData(arr)
    } else {
      openNotification("Please Login first", true, "warning");
    }
  };

  const removeWishlist = (id) => {
    if (Object.keys(cookies).length) {
      setWishlistLoader(id);
      const header = {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          // "Content-Type": "multipart/form-data",
        },
      };
      let arr = [];
      let obj = {};
      obj["userId"] = cookies.id || cookies.userId;
      obj["productId"] = id;
      removeFromWishlist(obj, header)
        .then((response) => {
          if (response.response === undefined && Object.keys(cookies).length) {            
            let id = cookies.id || cookies.userId;
            let arr = [];
            getWishlist(id)
              .then((res) => {
                setAllWishlistLoader(false);
                res.data[0].products.forEach((v) => {
                  arr.push(v.productId?._id);
                });
                setWishlist(arr.length ? arr : []);
                localStorage.setItem("wishlist", JSON.stringify(arr));
                setWishlistLoader(null)
              })
              .catch((err) => {
                setAllWishlistLoader(false);
              });            
          }
        })
        .catch((error) => {
          console.log(error);
          setWishlistLoader(null);
        });
      // setDigitalData(arr)
    } else {
      openNotification("Please Login first", true, "warning");
    }
  };

  return (
    <>
      {contextHolder}
      {digitalData.length && cartLoader === false ? (
        <div className="flex w-full flex-col gap-y-[20px]">
          <div className=" grid grid-cols-4 justify-center gap-10 my-10 1700-1024:grid-cols-3 1300-680:grid-cols-2 max-680:grid-cols-1 max-680:justify-items-center">
            {digitalData.map((item, index) =>
              (index + 1) % 8 === 0 && reviews[(index + 1) / 8 - 1] ? (
                <div
                  key={`additional-${index}`}
                  className="flex flex-col justify-between 768-650:my-3 max-768:h-auto p-4 bg-[#FFA585] rounded-lg opacity-70  w-[310px]"
                >
                  {console.log("reviews:- ", index)}
                  <div className=" h-[85%] overflow-y-hidden flex items-center gap-y-[20px] flex-col">
                    <div className="flex w-full justify-center">
                      <Avatar size={64}>
                        {reviews[(index + 1) / 8 - 1].name
                          .slice(0, 1)
                          .toUpperCase()}
                      </Avatar>
                    </div>
                    <h2 className="text-center font-bold text-xl mt-3 font-small ">
                      {reviews[(index + 1) / 8 - 1].name}
                    </h2>
                    <h2 className="text-center font-small text-lg font-bold">
                      {new Date(
                        reviews[(index + 1) / 8 - 1].createdAt
                      ).toDateString()}
                    </h2>

                    <p className="text-center px-8 font-small max-768:px-0 text-2xl capitalize">
                      {reviews[(index + 1) / 8 - 1].comment}
                    </p>
                  </div>
                  {/* <div className="text-center mb-3">
                    <button className="text-lg font-bold font-small max-768:text-sm">
                      View All Reviews <span className=" opacity-65">{">>"}</span>{" "}
                    </button>
                  </div> */}
                </div>
              ) : !!item.price ? (
                <div className="flex justify-center w-[310px] " key={item._id}>
                  {/* <Link to="product" className=' w-[300px]  max-768:my-3 '> */}
                  <div
                    // style={{ background: `url(${item.imageurl[0]})` }}
                    className={`relative h-[400px] bg-center-top bg-no-repeats w-full border-2 rounded-md border-black justify-end items-center flex flex-col`}
                  >
                    <div className=" relative w-full rounded-lg  h-[55%] ">
                      <img
                        className=" object-cover w-full h-full p-[2px] border border-gray-500"
                        src={item?.images[0].imageurl || item?.imageurl[0]}
                        alt="..."
                      />

                      {!!item.discount ? (
                        <h3 className=" absolute top-4 left-2 bg-[#000000] w-[70px] h-[30px] flex items-center justify-center text-white rounded-full text-center font-medium ">
                          On Sale
                        </h3>
                      ) : (
                        <></>
                      )}
                      {allWishlistLoader ? (
                        <Icons string="loading" width="24px" height="24px" />
                      ) : (
                        <>
                          {wishlistLoader === item._id ? (
                            <h3 className=" absolute top-4 right-3">
                              <Icons
                                string="loading"
                                width="30px"
                                height="30px"
                              />
                            </h3>
                          ) : (
                            <>
                              {wishlist?.includes(item._id) ? (
                                <h3
                                  className=" absolute top-4 right-3"
                                  onClick={() =>
                                    removeWishlist(item._id, index)
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="red"
                                    className="bi bi-heart-fill"
                                    viewBox="0 0 16 16"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                                    />
                                  </svg>
                                </h3>
                              ) : (
                                <h3
                                  className=" absolute top-4 right-3"
                                  onClick={() => addWishlist(item._id, index)}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    className="bi bi-heart"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15" />
                                  </svg>
                                </h3>
                              )}
                            </>
                          )}
                        </>
                      )}
                      <div className="  absolute  top-[79%]  w-full flex h-[46px] justify-start">
                        <div className="w-[120px] bg-white rating-box flex justify-center h-full py-2">
                          <div className="w-[100px] h-full flex justify-center items-center bg-[#ccc]">
                            {item.review}/5 ratings
                          </div>
                        </div>
                      </div>
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
                              {item.discount
                                ? parseFloat(
                                    parseFloat(item.price) -
                                      (parseFloat(item.price) * item.discount) /
                                        100
                                  ).toFixed(2)
                                : item.price}
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
                        {/* {item._id} */}
                        {/* {!!item.discount 
                              ? <div className="flex gap-x-[15px] items-center">
                                  <Icons string="bookSaleStatus" />
                                  <h1 className='px-2 py-1 rounded-full bg-[black] text-white font-bold text-sm font-small 1330-768:text-sm 931-768:text-base 931-768:font-medium'>On Sale</h1>
                                </div> 
                              : <></>} */}
                      </div>
                      <div className="w-full justify-between flex">
                        {Object.keys(cookies).length ? (
                          productInCart.includes(item._id) ||
                          (cartDetails?.length &&
                            cartDetails?.filter(
                              (v) => v.productId?._id === item._id
                            ).length) ? (
                            <div className="px-2 py-1 rounded text-white font-small text-[14px] font-medium text-base bg-[#E2425C] cursor-pointer">
                              {cartByIDLoader === item._id ? (
                                <Icons
                                  string="loading"
                                  width="24px"
                                  height="24px"
                                />
                              ) : (
                                "Added to Cart"
                              )}
                            </div>
                          ) : (
                            <div
                              className="px-2 py-1 rounded text-white font-small font-medium text-base bg-[#E2425C] cursor-pointer"
                              onClick={() => addToCartFunc(item._id)}
                            >
                              {cartByIDLoader === item._id ? (
                                <Icons
                                  string="loading"
                                  width="24px"
                                  height="24px"
                                />
                              ) : (
                                "Add to Cart"
                              )}
                            </div>
                          )
                        ) : (
                          <Popover content={content} trigger="click">
                            <div className="px-2 py-1 rounded text-white font-small font-medium text-base bg-[#E2425C] cursor-pointer">
                              Add to Cart
                            </div>
                          </Popover>
                        )}

                        {Object.keys(cookies).length ? (
                          <div
                            className="px-2 py-1 rounded text-white font-small font-medium text-base bg-[#689F38] cursor-pointer"
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
                          </div>
                        ) : (
                          <Popover content={content} trigger="click">
                            <div className="px-2 py-1 rounded text-white font-small font-medium text-base bg-[#689F38] cursor-pointer">
                              Buy Now
                            </div>
                          </Popover>
                        )}
                        <Link
                          href={`shop/product_details/${item._id}`}
                          className="px-2 py-1 rounded cursor-pointer text-white font-small font-medium text-base bg-[#46AED1] hover:text-white"
                        >
                          View More
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* </Link> */}
                </div>
              ) : (
                <></>
              )
            )}
          </div>
          {nextPageLoading ? (
            <div className="w-full flex justify-center">
              <Icons string="loading" height="100px" width="100px" />
            </div>
          ) : (
            <></>
          )}
          <Pagination
            align="end"
            className="flex justify-center"
            current={current}
            onChange={onChange}
            total={totalItems}
          />
          {/* {pagination.length 
            ? <div className="w-full flex items-center justify-center gap-[2px]">
                {pagination.map((v,i)=>
                  <div key={i} onClick={()=>currentPage >= v ? {} : nextPage(v)} className={`w-[50px] h-[50px] cursor-pointer border ${currentPage === v ? 'bg-blue-500 text-white border-blue-500' : currentPage > v ? 'bg-gray-200 text-gray-400 border-gray-400' : 'text-blue-500 border-blue-500'} flex justify-center items-center rounded`}>{v}</div>
                )}
                <div onClick={()=>currentPage === pagination[pagination.length - 1] ? {} : nextPage(currentPage + 1)} className={`w-[40px] h-[40px] ml-[5px] flex justify-center items-center rounded-[8px] ${currentPage === pagination[pagination.length - 1] ? 'bg-gray-200 text-gray-400 border-gray-400' : 'bg-blue-500 text-white border-blue-500'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-chevron-right" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                  </svg>
                </div>
              </div>
            : <></>
          } */}
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <Icons string="loading" />
        </div>
      )}
    </>
  );
};

const HardCopyProduts = () => {
  const [data, setData] = useState([]);
//   const navigate = useNavigate();
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageLoading, setNextPageLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  const nextPage = (page) => {
    setNextPageLoading(true);
    setCurrentPage(page);
    fetchData(page);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = (nextpage = undefined) => {
    setLoader(nextpage === undefined);
    getHardCopyProduct(nextpage)
      .then((response) => {
        setNextPageLoading(false);
        if (nextpage === undefined) {
          setCurrentPage(1);
          setPagination(
            Array.from(
              { length: response.data.totalPages },
              (_, index) => index + 1
            )
          );
        }
        setData([...data, ...response.data.stores]);
        if (nextpage === undefined) {
          setLoader(false);
        }
      })
      .catch((error) => {
        setNextPageLoading(false);
        console.log(error);
        if (nextpage === undefined) {
          setLoader(false);
        }
      });
  };

  console.log("data:- ", data);

  const handelId = (id) => {
    // navigate(`/product_details/${id}`, { state: { id: id} });
    // message.error('this blog updated');
  };
  return loader ? (
    <div className="flex w-full justify-center">
      <Icons string="loading" />
    </div>
  ) : (
    <>
      {data.length ? (
        <div className="flex w-full flex-col gap-y-[20px]">
          <div className=" grid grid-cols-4 justify-center gap-10 my-10 1600-1024:grid-cols-3 1024-425:grid-cols-2 max-680:grid-cols-1 max-680:justify-items-center">
            {data?.map((item, index) =>
              (index + 1) % 8 === 0 ? (
                <div
                  key={`additional-${index}`}
                  className="flex flex-col justify-between 768-650:my-3 max-768:h-auto p-4 bg-[#FFA585] rounded-lg opacity-70  w-[88%] 1562-1330:w-[95%] max-1330:w-[95%] 550-425:w-full"
                >
                  <div className=" h-[85%] overflow-y-hidden">
                    <Avatar>A</Avatar>
                    <h2 className="text-center font-bold text-lg mt-3 font-small ">
                      Anonymous
                    </h2>
                    <h2 className="text-center font-small ">2024-03-21</h2>
                    <h2 className="text-center font-bold text-lg my-5 font-small ">
                      Amazon Reviewer
                    </h2>
                    <p className="text-center px-8 font-small max-768:px-0">
                      Purchased this book last week. Did 4 pages already. It's
                      very relaxing and therapeutic.
                    </p>
                    <p className="text-center px-8 font-small max-768:px-0">
                      It also gives you time to recuperate with your stress
                      levels.
                    </p>
                  </div>

                  {/* <div className="text-center mb-3">
                        <button className="text-lg font-bold font-small max-768:text-sm">
                          View All Reviews <span className=" opacity-65">{">>"}</span>{" "}
                        </button>
                      </div> */}
                </div>
              ) : (
                item.price ?
                <div className="flex justify-center w-[310px]" key={item._id}>
                  {/* <Link to="product" className=' w-[300px]  max-768:my-3 '> */}
                  <div
                    // style={{ background: `url(${item.imageurl[0]})` }}
                    className={`relative h-[400px] bg-center-top bg-no-repeats w-full border-2 rounded-md border-black justify-end items-center flex flex-col`}
                  >
                    <div className=" relative w-full rounded-lg  h-[60%] ">
                      <img
                        className=" object-cover w-full h-full p-[2px] border border-gray-500"
                        src={item.images[0].imageurl}
                        alt="..."
                      />
                    </div>

                    <div className=" w-full h-[40%] min-1440:h-[50%] flex flex-col justify-between items-start relative bg-white py-4 px-[10px] gap-y-2 shadow-[0_-1px_1px]">
                      <div className="flex flex-col items-start gap-y-2">
                        <div className="flex gap-x-[15px] items-start">
                          <Icons string="bookTitle" />
                          <h1
                            className="leading-normal font-bold text-lg font-small 1330-768:text-lg 931-768:text-base 931-768:font-medium w-[250px] truncate"
                            title={item.title}
                          >
                            {item.title}
                          </h1>
                        </div>
                        <div className="flex gap-x-[15px] items-center">
                          <Icons string="bookPrice" />
                          <div className="flex justify-center gap-x-2 text-lg font-medium min-1440:text-lg ">
                            <p>${parseFloat(item.price).toFixed(2)}</p>
                            <p className="opacity-50 line-through font-small text-base min-1440:text-lg">
                              {item.offer_price}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full justify-center flex">
                        <Link href={item.amazon_link} target="_blank">
                          <div className="px-7 py-1 rounded text-white font-small font-medium text-base bg-[#46AED1]">
                            View More
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* </Link> */}
                </div> : <></>
              )
            )}
          </div>
          {nextPageLoading ? (
            <div className="w-full flex justify-center">
              <Icons string="loading" height="100px" width="100px" />
            </div>
          ) : (
            <></>
          )}
          {pagination.length ? (
            <div className="w-full flex items-center justify-center gap-[2px]">
              {pagination.map((v, i) => (
                <div
                  key={i}
                  onClick={() => (currentPage >= v ? {} : nextPage(v))}
                  className={`w-[50px] h-[50px] cursor-pointer border ${
                    currentPage === v
                      ? "bg-blue-500 text-white border-blue-500"
                      : currentPage > v
                      ? "bg-gray-200 text-gray-400 border-gray-400"
                      : "text-blue-500 border-blue-500"
                  } flex justify-center items-center rounded`}
                >
                  {v}
                </div>
              ))}
              <div
                onClick={() =>
                  currentPage === pagination[pagination.length - 1]
                    ? {}
                    : nextPage(currentPage + 1)
                }
                className={`w-[40px] h-[40px] ml-[5px] flex justify-center items-center rounded-[8px] ${
                  currentPage === pagination[pagination.length - 1]
                    ? "bg-gray-200 text-gray-400 border-gray-400"
                    : "bg-blue-500 text-white border-blue-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="white"
                  className="bi bi-chevron-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center py-5">
          <div className="text-3xl text-center font-bold">
            Hard Copy Products is not there. Will be Coming Soon!
          </div>
        </div>
      )}
    </>
  );
};
const AmazonProduts = () => {
  const [data, setData] = useState([]);
//   const navigate = useNavigate();
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageLoading, setNextPageLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  const nextPage = (page) => {
    setNextPageLoading(true);
    setCurrentPage(page);
    fetchData(page);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = (nextpage = undefined) => {
    setLoader(nextpage === undefined);
    getAmazonProduct(nextpage)
      .then((response) => {
        setNextPageLoading(false);
        if (nextpage === undefined) {
          setCurrentPage(1);
          setPagination(
            Array.from(
              { length: response.data.totalPages },
              (_, index) => index + 1
            )
          );
        }
        setData([...data, ...response.data.stores]);
        if (nextpage === undefined) {
          setLoader(false);
        }
      })
      .catch((error) => {
        setNextPageLoading(false);
        console.log(error);
        if (nextpage === undefined) {
          setLoader(false);
        }
      });
  };

  console.log("data:- ", data);

  const handelId = (id) => {
    // navigate(`/product_details/${id}`, { state: { id: id} });
    // message.error('this blog updated');
  };
  return loader ? (
    <div className="flex w-full justify-center">
      <Icons string="loading" />
    </div>
  ) : (
    <>
      {data.length ? (
        <div className="flex w-full flex-col gap-y-[20px]">
          <div className=" grid grid-cols-4 justify-center gap-10 my-10 1600-1024:grid-cols-3 1024-425:grid-cols-2 max-680:grid-cols-1 max-680:justify-items-center">
            {data?.map((item, index) =>
              (index + 1) % 8 === 0 ? (
                <div
                  key={`additional-${index}`}
                  className="flex flex-col justify-between 768-650:my-3 max-768:h-auto p-4 bg-[#FFA585] rounded-lg opacity-70  w-[88%] 1562-1330:w-[95%] max-1330:w-[95%] 550-425:w-full"
                >
                  <div className=" h-[85%] overflow-y-hidden">
                    <Avatar>A</Avatar>
                    <h2 className="text-center font-bold text-lg mt-3 font-small ">
                      Anonymous
                    </h2>
                    <h2 className="text-center font-small ">2024-03-21</h2>
                    <h2 className="text-center font-bold text-lg my-5 font-small ">
                      Amazon Reviewer
                    </h2>
                    <p className="text-center px-8 font-small max-768:px-0">
                      Purchased this book last week. Did 4 pages already. It's
                      very relaxing and therapeutic.
                    </p>
                    <p className="text-center px-8 font-small max-768:px-0">
                      It also gives you time to recuperate with your stress
                      levels.
                    </p>
                  </div>

                  {/* <div className="text-center mb-3">
                        <button className="text-lg font-bold font-small max-768:text-sm">
                          View All Reviews <span className=" opacity-65">{">>"}</span>{" "}
                        </button>
                      </div> */}
                </div>
              ) : (
                <div className="flex justify-center w-[310px]" key={item._id}>
                  {/* <Link to="product" className=' w-[300px]  max-768:my-3 '> */}
                  <div
                    // style={{ background: `url(${item.imageurl[0]})` }}
                    className={`relative h-[400px] bg-center-top bg-no-repeats w-full border-2 rounded-md border-black justify-end items-center flex flex-col`}
                  >
                    <div className=" relative w-full rounded-lg  h-[60%] ">
                      <img
                        className=" object-cover w-full h-full p-[2px] border border-gray-500"
                        src={item.images[0].imageurl}
                        alt="..."
                      />
                    </div>

                    <div className=" w-full h-[40%] min-1440:h-[50%] flex flex-col justify-between items-start relative bg-white py-4 px-[10px] gap-y-2 shadow-[0_-1px_1px]">
                      <div className="flex flex-col items-start gap-y-2">
                        <div className="flex gap-x-[15px] items-start">
                          <Icons string="bookTitle" />
                          <h1
                            className="leading-normal font-bold text-lg font-small 1330-768:text-lg 931-768:text-base 931-768:font-medium w-[250px] truncate"
                            title={item.title}
                          >
                            {item.title}
                          </h1>
                        </div>
                        <div className="flex gap-x-[15px] items-center">
                          <Icons string="bookPrice" />
                          <div className="flex justify-center gap-x-2 text-lg font-medium min-1440:text-lg ">
                            <p>${parseFloat(item.price).toFixed(2)}</p>
                            <p className="opacity-50 line-through font-small text-base min-1440:text-lg">
                              {item.offer_price}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="w-full justify-center flex">
                        <Link href={item.amazon_link} target="_blank">
                          <div className="px-7 py-1 rounded text-white font-small font-medium text-base bg-[#46AED1]">
                            View More
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/* </Link> */}
                </div>
              )
            )}
          </div>
          {nextPageLoading ? (
            <div className="w-full flex justify-center">
              <Icons string="loading" height="100px" width="100px" />
            </div>
          ) : (
            <></>
          )}
          {pagination.length ? (
            <div className="w-full flex items-center justify-center gap-[2px]">
              {pagination.map((v, i) => (
                <div
                  key={i}
                  onClick={() => (currentPage >= v ? {} : nextPage(v))}
                  className={`w-[50px] h-[50px] cursor-pointer border ${
                    currentPage === v
                      ? "bg-blue-500 text-white border-blue-500"
                      : currentPage > v
                      ? "bg-gray-200 text-gray-400 border-gray-400"
                      : "text-blue-500 border-blue-500"
                  } flex justify-center items-center rounded`}
                >
                  {v}
                </div>
              ))}
              <div
                onClick={() =>
                  currentPage === pagination[pagination.length - 1]
                    ? {}
                    : nextPage(currentPage + 1)
                }
                className={`w-[40px] h-[40px] ml-[5px] flex justify-center items-center rounded-[8px] ${
                  currentPage === pagination[pagination.length - 1]
                    ? "bg-gray-200 text-gray-400 border-gray-400"
                    : "bg-blue-500 text-white border-blue-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="white"
                  className="bi bi-chevron-right"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center py-5">
          <div className="text-3xl text-center font-bold">
            Amazon Product is not there. Will be Coming Soon!
          </div>
        </div>
      )}
    </>
  );
};
