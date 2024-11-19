"use client"

import React, { useEffect, useState } from "react";
import Icons from "../Icons/Icons";
import { cart, cartLoading, cookiesState, navigateState } from "../state/appAtom";
import { useRecoilState } from "recoil";
import { buyNowApi, deleteProductCart, getCart } from "../services/storeAPI";
import Cookies from "js-cookie";
import Link from "next/link";
import Navbar from "../components/Navbar";

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
    id: 5,
  },
  {
    id: 6,
  },
  {
    id: 7,
  },
];

const Cart = () => {
  const [cartDetails, setCartDetails] = useRecoilState(cart);
  const [totalPrice, setTotalPrice] = useState([]);
  const [cartLoader, setCartLoader] = useRecoilState(cartLoading);
  const [cookies, setCookies] = useRecoilState(cookiesState);
  const [navigation, setNavigation] = useRecoilState(navigateState);
  const [cartByIdLoader, setCartByIdLoader] = useState(null)
  const [loader, setLoader] = useState(false)

  useEffect(()=>{
  if(Cookies.get('email')){
    let obj = {}
    obj['email'] = Cookies.get('email')
    obj['token'] = Cookies.get('token')
    obj['id'] = Cookies.get('userId')
    setCookies(obj)
  }
},[])

  useEffect(()=>{
    // debugger
    setNavigation("Cart");
    if(Object.keys(cookies).length){
      getCartDetails()
    }
    // let secondDiv = document.getElementById("topHeader")
    // secondDiv.scrollIntoView({ behavior: "smooth", block: "start" })
  },[cookies])

  useEffect(() => {
    // debugger
    let arr = 0;
    console.log("cartDetails:- ", cartDetails);
    if(cartDetails?.length){
      cartDetails.forEach((v) => {
        // debugger
        if(v.productId){
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
  }, [cartDetails]);

  const deleteFromCart = (id) => {
    setCartByIdLoader(id)
    let obj = {};
    obj["userId"] = cookies.id;
    obj["productId"] = id;
    const header = {
      headers: {
        "Authorization": `Bearer ${Cookies.get('token')}`,
      },
    };
    deleteProductCart(obj, header).then((res) => {
      console.log("cartDetails:- ", res);
      getCartDetails();
      setCartByIdLoader(null)
    })
    .catch((err)=>{
      setCartByIdLoader(null)
    })
  };

  const getCartDetails = () => {
    debugger
    const header = {
      headers: {
        "Authorization": `Bearer ${Cookies.get('token')}`,
        // "Content-Type": "multipart/form-data",
      },
    };
    getCart(cookies.id, header)
      .then((res) => {
        console.log(res.data[0].products);

        setCartDetails(res?.data[0]?.products.filter(v=>!!v.productId));
      })
      .catch((err) => console.log(err));
  };

  const buyNow = (product = undefined) => {
    setLoader(true)
    let obj = {
      userId: cookies.id || cookies.userId,
      items: [],
    };
    let arr = []
    // debugger
    if(!!product){
      let objs = {};
      objs['productId'] = product._id
      objs['quantity'] = 1
      objs['price'] = !!product.discount ? parseFloat(parseFloat(product.price) - (parseFloat(product.price) * product.discount) / 100).toFixed(2) : parseFloat(product.price).toFixed(2)
      arr.push(objs)
    } else {
      cartDetails.forEach((v)=>{
        let objs = {};
        objs['productId'] = v.productId._id
        objs['quantity'] = 1
        objs['price'] = !!v.productId.discount ? parseFloat(parseFloat(v.productId.price) - (parseFloat(v.productId.price) * v.productId.discount) / 100).toFixed(2) : parseFloat(v.productId.price).toFixed(2)
        arr.push(objs)
      })
    }
    const header = {
      headers: {
        "Authorization": `Bearer ${Cookies.get('token')}`,
      },
    };
    obj.items = arr
    console.log(obj);
    buyNowApi(obj, header)
    .then((res)=>{
      setLoader(false)
      console.log(res);
    //   navigate('/placing-order')
    })
    .catch((err)=>{
      setLoader(false)
      console.log(err);
    })
  };

  console.log("cartDetails:- ", cartDetails);

  return Object.keys(cookies).length ? (
    <>
    <Navbar />
      {cartDetails?.length ? (
        <div className="flex flex-col items-center w-full">
          <div className="text-4xl underline underline-offset-4">Cart Items</div>
          <div className="flex justify-center gap-x-[30px] items-start max-1024:flex-col max-1024:gap-y-[20px] pt-[15px] pb-[30px] cart-section w-[80%]">
            <div className="w-[1000px] flex flex-col max-1024:w-full p-[15px] max-600:px-[5px] border-2 border-solid border-[#FFA585] rounded-lg bg-[#ffa68552] gap-y-[20px]">
              {cartDetails.map((idx, i) => (
                idx.productId
                ? <div
                  key={i}
                  className="flex max-600:flex-col justify-start items-center gap-x-[30px] max-600:h-auto h-[200px] cart-product-section"
                  >
                    <div className=" h-full w-[200px] max-600:w-[200px] max-600:h-[300px]">
                      <img
                        className=" object-cover w-full h-full border border-gray-500"
                        src={idx.productId?.images[0].imageurl}
                        alt="..."
                      />
                    </div>
                    <div className="flex flex-col items-start h-full justify-between py-[10px]">
                      <h3 className="text-left font-bold font-small text-lg truncate">
                        {idx.productId?.title}
                      </h3>
                      <div>Order id: {idx._id}</div>
                      {/* {idx._id} */}
                      <div className=" flex  items-center gap-[10px] w-full">
                        <h3 className="font-semibold">
                          $
                          {parseFloat(
                            parseFloat(idx.productId?.price) -
                              (parseFloat(idx.productId?.price) *
                                idx.productId?.discount) /
                                100
                          ).toFixed(2)}
                        </h3>
                        {idx.productId.discount !== null ? <h3 className="line-through text-gray-400 font-semibold">
                          ${parseFloat(idx.productId?.price).toFixed(2)}
                        </h3> : <></>}
                      </div>
                      <div className="flex gap-x-[10px]">
                        <div
                          className="py-2 px-2 bg-[#E2425C] text-white font-medium cursor-pointer"
                          onClick={() => deleteFromCart(idx.productId._id)}
                        >
                          {cartByIdLoader === idx.productId._id ? <Icons string="loading" width="24px" height="24px" /> : 'Remove from cart'}
                        </div>
                      </div>
                    </div>
                    {/* <div className=' flex gap-x-3 items-center  '>
                      <Icons string="plus" height="20" width="20" />
                      <h3 className=' border h-6 w-5 text-center  ' >5</h3>
                      <Icons string="plus" height="20" width="20" />
                    </div> */}
                    {/* <Button type="primary">Add to Cart</Button> */}
                  </div>
                :  <></>
              ))}
            </div>
            <div className="flex flex-col items-center py-[15px] px-[20px] w-[310px] max-425:w-full max-1024:ml-auto max-600:mx-auto border-[2px] rounded-[8px] border-[#46AED1] bg-[#46aed120] gap-y-[20px]">
              <div className="font-small text-2xl text-[#46aed1] font-bold underline underline-offset-[6px]">
                Order Summary
              </div>
              <div className="flex justify-between w-full mt-5">
                <div className="font-medium text-xl">Total:</div>
                <div className="font-medium text-lg">$ {parseFloat(totalPrice).toFixed(2)}</div>
              </div>
              <div className="w-full flex justify-center">
                <button className="bg-[#46AED1] rounded-[8px] text-lg font-semibold text-white px-[20px] py-[10px]" onClick={()=>loader ? {} : buyNow()}>
                  {loader ? <img src="/images/loadingSpinner.gif" className="w-[16px]" /> :'Proceed to Checkout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : cartLoader ? (
        <div className="w-full flex justify-center h-[400px] items-center">
          <Icons string="loading" />
        </div>
      ) : (
        <div className="w-full flex justify-center py-6 gap-x-[15px] items-center h-[400px]">
          <Icons string="empty cart" />
          <div className="text-2xl font-bold">No Product in Cart</div>
        </div>
      )}
    </>
  ) : (
    <div className="flex w-full justify-center bg-[#f1f3f6] py-[20px] h-[80vh] items-center">
      <div className="w-1/2 flex flex-col items-center bg-white py-[15px] max-650:w-[80%] max-425:w-full">
        <img src="/images/missingCartItems.jpg" className="h-[250px]" />
        <div className="text-lg font-small font-semibold">
          Missing Cart items?
        </div>
        <div className="text-base font-small">
          Login to see the items you added previously
        </div>
        <Link
          href="/login/cart"
          className="bg-[#46AED1] flex justify-center text-white w-[100px] py-[5px] font-small mt-[15px]"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Cart;