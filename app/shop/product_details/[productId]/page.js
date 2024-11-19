"use client"

import React, { useEffect, useState } from "react";

import { Avatar, Button, Carousel, Form, Modal, Popover, Rate } from "antd";
import axios from "axios";
import {
  cart,
  cookiesState,
  navigateState,
  prevOrderArray,
  wishlistArray,
} from "../../../state/appAtom";
import { useRecoilState } from "recoil";
import {
  addReviews,
  addToCart,
  buyNowApi,
  getCart,
  getDigitalProduct,
  getReviewsById,
  getWishlist,
  postWishlist,
  removeFromWishlist,
  updateProductRatings,
} from "../../../services/storeAPI";
import TextArea from "antd/es/input/TextArea";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Icons from "@/app/Icons/Icons";
import Navbar from "@/app/components/Navbar";

const Product_Details = ({params}) => {
  console.log("params:- ", params);
  const [wishlisted, setWishlisted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [digitalData, setDigitalData] = useState([]);
  const [cookies, setCookies] = useRecoilState(cookiesState);
  const [wishlist, setWishlist] = useRecoilState(wishlistArray);

  const [cartDetails, setCartDetails] = useRecoilState(cart);
  const [productInCart, setProductInCart] = useState(false);
  const [cartApiCalled, setCartApiCalled] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewInput, setReviewInput] = useState({ comment: "" });
  const [reviewError, setReviewError] = useState(false);
  const [commentError, setCommentError] = useState(false);
  const [buyNowLoader, setBuyNowLoader] = useState(null);
  const [addToCartLoader, setAddToCartLoader] = useState(null);
  const [wishlistByIdLoader, setWishlistByIdLoader] = useState(null);
  const [wishlistLoader, setWishlistLoader] = useState(false);
  const [reviewRatings, setReviewRatings] = useState();
  const [loader, setLoader] = useState("");
  const [allOrders, setAllOrders] = useRecoilState(prevOrderArray);
  const [data, setData] = useState({
    title: "",
    category: "Digital",
    descriptions: "",
    price: "",
    discount: "",
    digital_product_link: "",
    review: 5,
    live: "true",
    imageurl: [],
  });

  // const params = usePathname();
  // console.log(params.replace('/shop/product_details/',''))
//   const navigate = useNavigate();

  const id = params.productId;
  const [form] = Form.useForm();
  const [navigation, setNavigation] = useRecoilState(navigateState);

  useEffect(() => {
    let secondDiv = document.getElementById("topHeader");
    secondDiv.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `https://embark-backend.vercel.app/api/product_get/${id}`
          );
          const {
            title,
            category,
            descriptions,
            price,
            discount,
            digital_product_link,
            review,
            live,
            images,
          } = response.data;
          setData({
            title: title,
            category: category,
            descriptions: descriptions,
            price: price,
            discount: discount,
            digital_product_link: digital_product_link,
            review: review,
            live: live,
            images: images,
          });
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      };
      fetchProduct();
      fetchData(id);
      setNavigation("Shop");
      getAllReviews();
    } else {
    }
  }, [id]);

  const getAllWishlist = () => {
    if (Object.keys(cookies).length) {
      setWishlistLoader(true);
      let userId = cookies.id || cookies.userId;
      let arr = [];
      const header = {
        headers: {
          "Authorization": `Bearer ${Cookies.get('token')}`,
          // "Content-Type": "multipart/form-data",
        },
      };
      getWishlist(userId, header)
        .then((res) => {
          res.data[0].products.forEach((v) => {
            if (!!v.productId) {
              arr.push(v.productId._id);
            }
          });
          setWishlist(arr.length ? arr : []);
          setWishlisted(arr.indexOf(id) != -1);
          localStorage.setItem("wishlist", JSON.stringify(arr));
          setWishlistLoader(false);
        })
        .catch((err) => {
          console.log(err);
          setWishlistLoader(false);
        });
    }
  };

  const buyNow = (object = undefined) => {
    let discount = "",
      price = "";
    if (!!object) {
      discount = object.discount;
      price = object.price;
    } else {
      discount = data.discount;
      price = data.price;
    }

    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };

    let objs = {
      userId: cookies.id || cookies.userId,
      items: [
        {
          productId: !!object ? object._id : id,
          quantity: 1,
          price: !!discount
            ? parseFloat(
                parseFloat(price) - (parseFloat(price) * discount) / 100
              ).toFixed(2)
            : price,
        },
      ],
    };
    setBuyNowLoader(!!object ? object._id : id);
    buyNowApi(objs, header)
      .then((res) => {
        setBuyNowLoader(null);
        console.log(res);
        // navigate("/placing-order");
      })
      .catch((err) => {
        setBuyNowLoader(null);
        console.log(err);
      });
  };

  const fetchData = (id) => {
    getDigitalProduct().then((response) => {
      setDigitalData(
        response.data.stores.filter((v) => v._id !== id).slice(0, 8)
      );
    });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const content = (
    <div className="flex gap-x-3">
      {/* <div className="p-2">
        <Icons string="facebook" width="30px" height="30px" />
      </div> */}
      <Link
        className="p-2"
        target="_blank"
        href={`https://api.whatsapp.com/send?text=${
          data.title
        },%20Price:${parseFloat(data.price).toFixed(2)}%0A${
          window.location.origin
        }${window.location.pathname}`}
      >
        <Icons string="whatsapp" width="30px" height="30px" />
      </Link>
      {/* <div className="p-2">
        <Icons string="pinterest" width="30px" height="30px" />
      </div> */}
    </div>
  );

  const contents = (
    <div>
      <p>Please Login First</p>
      <Link
        href={`/login/product_details-${id}`}
        className="underline text-cyan-600 font-lg"
      >
        Click here to login
      </Link>
    </div>
  );

  const addToCartFunc = (productId = undefined) => {
    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        // "Content-Type": "multipart/form-data",
      },
    };
    let obj = {};
    obj["userId"] = cookies.id;
    obj["productId"] = !!productId
      ? digitalData.filter((v) => v._id === productId)[0]._id
      : id;
    if (!!productId) {
      setLoader(productId);
    } else {
      setAddToCartLoader(id);
    }
    addToCart(obj, header)
      .then((res) => {
        let cartObj = [];
        if (!!productId) {
          setLoader(null);
        } else {
          setAddToCartLoader(null);
        }
        localStorage.setItem("cart", JSON.stringify(res));
        setProductInCart(id);
        cartDetails.forEach((v) => {
          if (!!productId && v.productId._id !== productId) {
            cartObj.push(v);
          } else if (productId === undefined && v.productId._id !== id) {
            cartObj.push(v);
          }
        });
        let objs = {};
        objs["productId"] = !!productId
          ? digitalData.filter((v) => v._id === productId)[0]
          : data;
        objs["_id"] = !!productId
          ? res.data.products.filter((v) => v.productId === productId)[0]._id
          : res.data.products.filter((v) => v.productId === id)[0]._id;
        cartObj.push(objs);
        setCartDetails(cartObj);
        // getCartDetails()
      })
      .catch((err) => {
        setAddToCartLoader(null);
        console.log(err);
      });
  };

  const getCartDetails = () => {
    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        // "Content-Type": "multipart/form-data",
      },
    };
    getCart(cookies.id, header)
      .then((res) => {
        res?.data[0]?.products.filter((v) => {
          if (v.productId._id === id) {
            setProductInCart(id);
            // return
          }
        });
        setCartDetails(res?.data[0]?.products.filter((v) => !!v.productId));
        setCartApiCalled(true);
        // setProductInCart(res.data.filter(v=>v))
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    let obj = { review: reviewRatings };
    const header = {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    };
    updateProductRatings(id, obj, header)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reviewRatings]);

  useEffect(() => {
    if (Object.keys(cookies).length) {
      if (cartDetails?.length === 0 && cartApiCalled === false) {
        getCartDetails();
      } else if (cartDetails?.length) {
        cartDetails?.filter((v) => {
          if (v.productId?._id === id) {
            setProductInCart(v.productId._id === id);
            // return
          }
        });
      }
    }
  }, [cookies, cartDetails, id, cartApiCalled]);

  useEffect(() => {
    if (!!id && Object.keys(cookies).length) {
      getAllWishlist();
    }
  }, [id, cookies]);

  // const deleteFromCart = (productId = undefined) => {
  //   setLoader(productId)
  //   if(!!productId){
  //     setLoader(productId)
  //   } else {
  //     setAddToCartLoader(id)
  //   }
  //   let obj = {};
  //   obj["userId"] = cookies.id;
  //   obj["productId"] = !!productId ? digitalData.filter((v)=>v._id === productId)[0]._id : id;
  //   deleteProductCart(obj).then((res) => {
  //     let cartObj = []
  //     if(!!productId){
  //     setLoader(null)
  //   } else {
  //     setAddToCartLoader(null)
  //   }
  //     console.log(res);
  //     setProductInCart(false);
  //     cartDetails.forEach((v)=>{
  //       if(!!productId && v.productId._id !== productId){
  //         cartObj.push(v)
  //       } else if (productId === undefined && v.productId._id !== id){
  //         cartObj.push(v)
  //       }
  //     })
  //     setLoader(null);
  //     setCartDetails(cartObj)
  //     // getCartDetails()
  //   });
  // };

  const addWishlist = () => {
    if (Object.keys(cookies).length) {
      setWishlistByIdLoader(id);
      let arr = [];
      let obj = {};
      obj["userId"] = cookies.id || cookies.userId;
      obj["productId"] = id;
      const header = {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          // "Content-Type": "multipart/form-data",
        },
      };
      postWishlist(obj, header)
        .then((response) => {
          console.log("wishlist:-", wishlist);
          response.data.products.forEach((v) => {
            arr.push(v.productId);
          });
          setWishlisted(arr.indexOf(id) != -1);
          let arr2 = wishlist.slice(0);
          arr2.push(id);
          setWishlist(arr2);
          localStorage.setItem("wishlist", JSON.stringify(arr));
          setWishlistByIdLoader(null);
        })
        .catch((error) => {
          setWishlistByIdLoader(null);
          console.log(error);
        });
      // setDigitalData(arr)
    } else {
      openNotification("Please Login first", true, "warning");
    }
  };

  const removeWishlist = () => {
    if (Object.keys(cookies).length) {
      const header = {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          // "Content-Type": "multipart/form-data",
        },
      };
      setWishlistByIdLoader(id);
      let arr = [];
      let obj = {};
      obj["userId"] = cookies.id || cookies.userId;
      obj["productId"] = id;
      removeFromWishlist(obj, header)
        .then((response) => {
          response.data.list.products.forEach((v) => {
            arr.push(v.productId);
          });
          let arr2 = wishlist.slice(0);
          arr2.splice(arr.indexOf(id), 1);
          setWishlist(arr2);
          setWishlisted(arr.indexOf(id) != -1);
          localStorage.setItem("wishlist", JSON.stringify(arr));
          setWishlistByIdLoader(null);
        })
        .catch((error) => {
          setWishlistByIdLoader(null);
          console.log(error);
        });
      // setDigitalData(arr)
    } else {
      openNotification("Please Login first", true, "warning");
    }
  };

  const getAllReviews = () => {
    let sum = 0;
    getReviewsById(id)
      .then((res) => {
        console.log(res);
        res.data.forEach((v) => {
          sum = sum + v.rating;
        });
        let rate = sum / res.data.length;
        setReviews(res.data);

        if (res.data.length) {
          setReviewRatings(parseInt(rate));
        } else {
          setReviews(5);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinish = (e) => {
    // debugger
    let obj = { ...e, name: cookies.username, productId: id };
    let arr = [];
    const header = {
      headers: {
        "Authorization": `Bearer ${Cookies.get('token')}`,
        // "Content-Type": "multipart/form-data",
      },
    };
    addReviews(obj, header)
      .then((res) => {
        console.log(res);

        arr.push(res.data.review);
        let sum = 0;
        arr.forEach((v) => {
          sum = sum + v.rating;
        });
        sum = sum + res.data.review.rating;
        let rate = sum / arr.length;
        if (arr.length) {
          setReviewRatings(parseInt(rate));
        }
        form.resetFields();
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.log(error);
        setReviewError(false);
        setCommentError(false);
      });
    setReviews(arr);
  };

  const onFinishFailed = (e) => {
    console.log(e);
  };

  const viewMore = () => {
    setReviews([]);
    setData({
      title: "",
      category: "Digital",
      descriptions: "",
      price: "",
      discount: "",
      digital_product_link: "",
      review: 5,
      live: "true",
      imageurl: [],
    });
    setDigitalData([]);
  };

  console.log("cartDetails:- ", cartDetails);
  return (
    <>
    <Navbar />
      <div className="flex justify-center w-full product-detail-page">
        <div className="w-[80%] max-1440:w-[95%] flex flex-col gap-y-5 items-start">
          <Link href="/shop" className="w-full">
            <div className=" text-[#46AED1] font-semibold mt-10 text-xl ">
              {"<"} All Products
            </div>
          </Link>
          {!!data.title && !!data.price && data?.images?.length ? (
            <>
              <div className="grid grid-cols-2 gap-10 w-full max-680:grid-cols-1">
                <div className="flex justify-center items-start">
                  <div className="w-[70%] 1330-1024:w-[90%] border border-[#333] p-[15px] bg-[#ccc] max-h-[650px]">
                    <Carousel arrows infinite={true}>
                      {data.images.map((url, index) => (
                        <img
                          key={index}
                          src={url.imageurl}
                          alt="..."
                          className="max-h-[615px] object-cover"
                        />
                      ))}
                    </Carousel>
                  </div>
                </div>
                <div className="flex flex-col gap-y-6 product-detail-page-section">
                  <h1 className=" text-3xl font-bold font-small">
                    {data.title}
                  </h1>
                  <div className=" flex items-center gap-x-3">
                    <p className=" font-semibold text-2xl">
                      $
                      {!!data.discount ? (
                        <>
                          {parseFloat(
                            parseFloat(data.price) -
                              (parseFloat(data.price) * data.discount) / 100
                          ).toFixed(2)}
                        </>
                      ) : (
                        data.price
                      )}
                    </p>
                    {!!data.discount ? (
                      <p className=" line-through font-medium opacity-50 texts-xl">
                        ${parseFloat(data.price).toFixed(2)}
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                  {!!data.discount ? (
                    <h3 className=" text-red-600 text-xl font-semibold">
                      You save ${" "}
                      {parseFloat(
                        (parseFloat(data.price) * data.discount) / 100
                      ).toFixed(2)}{" "}
                      ( {data.discount}% )
                    </h3>
                  ) : (
                    <></>
                  )}

                  {reviewRatings ? (
                    <div className="flex gap-x-[10px]">
                      <Rate allowHalf disabled defaultValue={reviewRatings} />
                      <div className="text-gray-400 text-sm font-bold">
                        ( {reviews.length} )
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}

                  <div className="file-format w-[310px] gap-y-3 flex flex-col border-2 p-4 border-black">
                    <div className="flex gap-x-3">
                      <div className="font-bold w-[48%]">File Name </div>
                      <div className="font-bold w-[50%]">{data.title}</div>
                    </div>
                    <div className="flex gap-x-3">
                      <div className="font-bold w-[48%]">Format </div>
                      <div className="font-bold w-[50%]">PDF Format</div>
                    </div>
                    <div className="flex gap-x-3">
                      <div className="font-bold w-[48%]">Storage Required </div>
                      <div className="font-bold w-[50%]">28 MB</div>
                    </div>
                  </div>
                  <div className=" flex justify-between items-center w-full">
                    <div className=" flex gap-8 items-center w-full">
                      <div className="flex items-center gap-[15px] 950-650:flex-col 950-650:items-start">
                        {Object.keys(cookies).length ? (
                          productInCart === id ||
                          cartDetails?.filter((v) => v.productId?._id === id)
                            .length ? (
                            <button className=" bg-[#E2425C] text-white py-2 px-4 rounded  text-lg font-medium 950-650:text-base">
                              {addToCartLoader === id ? (
                                <Icons
                                  string="loading"
                                  width="24px"
                                  height="24px"
                                />
                              ) : (
                                "Added to Cart"
                              )}
                            </button>
                          ) : (
                            <button
                              className=" bg-[#3186D4] text-white py-2 px-4 rounded  text-lg font-medium 950-650:text-base"
                              onClick={() => addToCartFunc(undefined)}
                            >
                              {addToCartLoader === id ? (
                                <Icons
                                  string="loading"
                                  width="24px"
                                  height="24px"
                                />
                              ) : (
                                "Add To Cart"
                              )}
                            </button>
                          )
                        ) : (
                          <Popover content={contents} trigger="click">
                            {productInCart ? (
                              <button className=" bg-[#3186D4] text-white py-2 px-4 rounded  text-lg font-medium 950-650:text-base">
                                Added to Cart
                              </button>
                            ) : (
                              <button className=" bg-[#3186D4] text-white py-2 px-4 rounded  text-lg font-medium 950-650:text-base">
                                Add To Cart
                              </button>
                            )}
                          </Popover>
                        )}
                        {Object.keys(cookies).length ? (
                          <button
                            className=" bg-lime-700 text-white py-2 px-4 rounded  text-lg font-medium 950-650:text-base"
                            onClick={() => buyNow(undefined)}
                          >
                            {buyNowLoader === id ? (
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
                          <Popover content={contents} trigger="click">
                            <button className=" bg-lime-700 text-white py-2 px-4 rounded  text-lg font-medium 950-650:text-base">
                              Buy Now
                            </button>
                          </Popover>
                        )}
                      </div>
                      {Object.keys(cookies).length === 0 ? (
                        <Popover content={contents} trigger="click">
                          <button className="bg-transparent">
                            {wishlisted ? (
                              <Icons
                                string="wishlisted"
                                width="30px"
                                height="30px"
                              />
                            ) : (
                              <Icons
                                string="whislist"
                                width="30px"
                                height="30px"
                              />
                            )}
                          </button>
                        </Popover>
                      ) : (
                        <>
                          {wishlistLoader ? (
                            <Icons
                              string="loading"
                              width="24px"
                              height="24px"
                            />
                          ) : (
                            <button
                              className="bg-transparent"
                              onClick={() =>
                                wishlisted ? removeWishlist() : addWishlist()
                              }
                            >
                              {wishlistByIdLoader === id ? (
                                <Icons
                                  string="loading"
                                  width="24px"
                                  height="24px"
                                />
                              ) : (
                                <>
                                  {wishlisted ? (
                                    <Icons
                                      string="wishlisted"
                                      width="30px"
                                      height="30px"
                                    />
                                  ) : (
                                    <Icons
                                      string="whislist"
                                      width="30px"
                                      height="30px"
                                    />
                                  )}
                                </>
                              )}
                            </button>
                          )}
                        </>
                      )}
                      <Popover
                        placement="bottom"
                        content={content}
                        trigger="click"
                      >
                        <Button className="border-none border-0 shadow-none">
                          <Icons string="share" width="20px" height="20px" />
                        </Button>
                      </Popover>
                    </div>
                  </div>

                  {/* <h1 className="font-small font-bold text-xl underline underline-offset-4 decoration-double">
                    Review
                  </h1> */}
                  <div className="flex flex-col gap-y-[10px] items-start">
                    <div className="flex w-full justify-between">
                      {Object.keys(cookies).length ? (
                        <div
                          className="px-3 py-2 bg-[#46AED1] text-white font-small font-medium rounded-[5px] text-lg flex cursor-pointer"
                          onClick={showModal}
                        >
                          {allOrders ? 'Write a review' : 'Loading'}
                        </div>
                      ) : (
                        <Popover content={contents} trigger="click">
                          <div className="px-3 py-2 bg-[#46AED1] text-white font-small font-medium rounded-[5px] text-lg flex cursor-pointer">
                            Write a review
                          </div>
                        </Popover>
                      )}

                      {reviews?.length > 1 ? (
                        <button className="px-[5px] py-[3px] underline text-blue-700">
                          More
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                    {reviews?.length ? (
                      reviews.slice(0, 1).map((r, i) => (
                        <div
                          className="flex items-start p-[10px] gap-x-[20px] border-gray-50 rounded drop-shadow-sm border w-full"
                          key={i}
                        >
                          <Avatar>
                            {(r.name || "Anonymous").slice(0, 1).toUpperCase()}
                          </Avatar>
                          <div className="flex flex-col items-start gap-y-[5px]">
                            <div className="font-bold capitalize">
                              {r.name || "Anonymous"}
                            </div>
                            <Rate allowHalf disabled defaultValue={r.rating} />
                            <div className="capitalize">{r.comment}</div>
                            <div className="text-gray-400">
                              {parseInt(
                                (new Date() - new Date(r.createdAt)) /
                                  (1000 * 60 * 60) /
                                  24
                              ) === 0
                                ? "Today"
                                : `${parseInt(
                                    (new Date() - new Date(r.createdAt)) /
                                      (1000 * 60 * 60) /
                                      24
                                  )} days ago`}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full flex justify-center">
                <div className=" flex flex-col gap-y-4 w-[80%] max-425:w-[90%]">
                  <h1 className="text-xl font-bold text-center">
                    Description :-
                  </h1>
                  <p
                    className="text-center"
                    dangerouslySetInnerHTML={{ __html: data.descriptions }}
                  />
                </div>
              </div>
              {reviews.length > 1 ? (
                <div
                  className="review-section flex flex-col gap-y-[10px] w-full"
                  id="review-section"
                >
                  <div className="text-[28px] font-bold">All Reviews</div>
                  <div className="grid gap-[20px] grid-cols-4 1440-1024:grid-cols-3 1024-768:grid-cols-2 768-650:grid-cols-2 650-425:grid-cols-1 max-425:grid-cols-1">
                    {reviews.length ? (
                      reviews.map((r, i) => (
                        <div
                          className="flex items-start p-[10px] gap-x-[20px] border-gray-50 rounded drop-shadow-sm border w-full"
                          key={i}
                        >
                          <Avatar>
                            {(r.name || "Anonymous").slice(0, 1).toUpperCase()}
                          </Avatar>
                          <div className="flex-col items-start gap-y-[2px]">
                            <div className="font-bold capitalize">
                              {r.name || "Anonymous"}
                            </div>
                            <Rate allowHalf disabled defaultValue={r.rating} />
                            <div className="capitalize">{r.comment}</div>
                            <div className="text-gray-400">
                              {parseInt(
                                (new Date() - new Date(r.createdAt)) /
                                  (1000 * 60 * 60) /
                                  24
                              ) === 0
                                ? "Today"
                                : `${parseInt(
                                    (new Date() - new Date(r.createdAt)) /
                                      (1000 * 60 * 60) /
                                      24
                                  )} days ago`}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <div className="w-full flex justify-center">
              <Icons string="loading" />
            </div>
          )}
        </div>
      </div>

      {!!data.title && !!data.price && data.images.length ? (
        <div className=" flex justify-center mt-20 items-center">
          <div className="w-[36%] max-768:hidden">
            <img src="/images/line_2.png" className="w-full" alt="Line image" />
          </div>
          <p className="  text-2xl  text-black font-small px-6 font-bold text-center">
            Featured Products
          </p>
          <div className="w-[36%] max-768:hidden">
            <img src="/images/line_2.png" className="w-full" alt="Line image" />
          </div>
        </div>
      ) : (
        <></>
      )}

      <div className="flex justify-center w-full">
        <div className="w-[80%] max-1440:w-[95%] flex flex-nowrap justify-start mt-9 gap-x-5 overflow-x-auto pb-[10px]">
          {digitalData.length ? (
            digitalData.map((item) => (
              <div className="flex justify-center w-[310px] " key={item._id}>
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
                          className="leading-normal font-bold text-lg font-small 1330-768:text-lg 931-768:text-base 931-768:font-medium w-[250px] truncate"
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
                                (parseFloat(item.price) * item.discount) / 100
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
                    </div>
                    <div className="w-full justify-between flex">
                      {Object.keys(cookies).length > 0 ? (
                        <>
                          {cartDetails?.filter(
                            (v) => v.productId._id === item._id
                          ).length > 0 ? (
                            <button className="px-2 py-1 rounded text-white font-small font-medium text-base bg-[#E2425C]">
                              {loader === item._id ? (
                                <Icons
                                  string="loading"
                                  width="24px"
                                  height="24px"
                                />
                              ) : (
                                "Added to Cart"
                              )}
                            </button>
                          ) : (
                            <button
                              className="px-2 py-1 rounded text-white font-small font-medium text-base bg-[#E2425C]"
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
                          )}
                        </>
                      ) : (
                        <>
                          {cartDetails?.filter(
                            (v) => v.productId._id === item._id
                          ).length > 0 ? (
                            <Popover content={contents} trigger="click">
                              <button className="px-2 py-1 rounded text-white font-small font-medium text-base bg-[#E2425C]">
                                Added to Cart
                              </button>
                            </Popover>
                          ) : (
                            <Popover content={contents} trigger="click">
                              <button className="px-2 py-1 rounded text-white font-small font-medium text-base bg-[#E2425C]">
                                Add to Cart
                              </button>
                            </Popover>
                          )}
                        </>
                      )}
                      {Object.keys(cookies).length > 0 ? (
                        <button
                          className="px-2 py-1 rounded text-white font-small font-medium text-base bg-[#689F38]"
                          onClick={() => buyNow(item)}
                        >
                          Buy Now
                        </button>
                      ) : (
                        <Popover content={contents} trigger="click">
                          <button className="px-2 py-1 rounded text-white font-small font-medium text-base bg-[#689F38]">
                            Buy Now
                          </button>
                        </Popover>
                      )}
                      <Link
                        href={`/shop/product_details/${item._id}`}
                        onClick={() => viewMore()}
                        className="px-2 py-1 rounded cursor-pointer text-white font-small font-medium text-base bg-[#46AED1]"
                      >
                        View More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[]}
      > 
        {console.log("allOrders:- ", allOrders)}
        {allOrders?.filter((v) => v.productId._id === id).length ? (
          <div className="flex items-start flex-col gap-y-4">
            <div className="text-xl font-small font-bold underline underline-offset-2">
              Write a review :-{" "}
            </div>
            <div className="flex items-center gap-x-4">
              <div className="bg-[#ddd] h-[40px] w-[40px] rounded-full"></div>
              <div className="flex flex-col items-start">
                <div className="font-small font-bold">{cookies.username}</div>
                <div className="font-small font-medium text-[#ccc] leading-tight">
                  Posting Publically
                </div>
              </div>
            </div>
            <div className="flex w-full justify-center flex-col">
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
                <Form.Item name="rating" label="Ratings">
                  <Rate />
                </Form.Item>
                <Form.Item
                  name="comment"
                  label="Comment"
                  rules={[
                    { min: 10 },
                    { required: true },
                    { warningOnly: true },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form>
            </div>
            {/* <button className="bg-blue-600 text-white font-medium px-[10px] py-[5px] rounded" onClick={submitReview}>Submit</button> */}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center gap-y-3">
            <img src="/images/dontRate.gif" className="w-[150px]" />
            <div className="text-2xl font-bold">
              Haven't purchased this product?
            </div>
            <div className="text-xl text-gray-700 text-center">
              Sorry! You are not allowed to review this product since you
              haven't bought it.
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Product_Details;
