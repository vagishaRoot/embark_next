// "use client"

import React, { useEffect, useState } from "react";
// import logo from "/images/logo.png";
// import Icons from "../Icons/Icons";
// import { Link, NavLink, useNavigate } from "react-router-dom";
// import "../css/navbar.css";
// import line from "../assets/line.png";
// import { cart, cookiesState, navigateState, wishlistArray } from "../state/AppAtom";
import { useRecoilState } from "recoil";
import { Badge, Popover } from "antd";
import Cookies from "js-cookie";
import Icons from "../Icons/Icons";
import Link from "next/link";
import Line from "./Line";

const Navbar = () => {
//   const navigate = useNavigate();
  const heading = [
    {
      id: 1,
      head: "Home",
      path: "/",
    },
    {
      id: 2,
      head: "Shop",
      path: "/shop",
    },
    {
      id: 3,
      head: "About Us",
      path: "/about_us",
    },
    {
      id: 4,
      head: "Blogs",
      path: "/blogs",
    },
    {
      id: 5,
      head: "Free Stuff",
      path: "/free_page",
    },
    // {
    //   id: 6,
    //   head: "More",
    //   path: "/more",
    // },
  ];

  const handleNavigation = (path) => {
    setMenuClick(false);
    // navigate(path);
  };

  const [menuClick, setMenuClick] = useState(false);
//   const [navigation, setNavigation] = useRecoilState(navigateState);
  const [cookies, setCookies] = useState({});
//   const [cartDetails, setCartDetails] = useRecoilState(cart);
//   const [wishlist, setWishlist] = useRecoilState(wishlistArray);

useEffect(()=>{
    let obj = {}
    obj['email'] = Cookies.get('email')
    obj['username'] = Cookies.get('username')

    setCookies(obj)
},[])

  const logout = () => {
    Cookies.remove('userId')
    Cookies.remove('username')
    Cookies.remove('token')
    Cookies.remove('email')
    setCookies({})
    // setCartDetails([]);
    // navigate('/login');
    // localStorage.removeItem('reload')
    // setJumpToLoagin(true);
  }

  // console.log("wishlist:- ", wishlist)
  const content = (
    <div className="text-lg font-bold underline underline-offset-8 decoration-2" onClick={logout}>Logout</div>
  );

  return (
    <>
      <div className="flex flex-col w-full" id="topHeader">
        <div className="py-2 bg-[#FFA585] flex justify-center">
          <div className="font-semibold font-capitalize max-768:w-[90%] max-768:text-center max-425:text-xs">
            TREAT YOURSELF TO A MOMENT OF PEACE DOWNLOAD OUR FREE REVERSE
            COLORING BOOK
          </div>
        </div>
      </div>

      <div className=" shadow-lg my-4 max-650:hidden">
        <div className=" flex  mt-5 justify-between mx-[10%] ">
          <div>
            <img src="/images/logo.png" className="w-[22%]  " alt="..." />
          </div>

          <div className=" flex  gap-10 items-center">
            {Object.keys(cookies).length ? (
              <Link href="/dashboard">
                <Icons string="user" />
              </Link>
            ) : (
              <Link href="/login">
                <Icons string="login" />
              </Link>
            )}
            <Link href="/wishlist">
                <Icons
                  string="whislist"
                  color="black"
                  width="30px"
                  height="30px"
                />
              {/* <Badge count={wishlist.filter(v=>v).length}>
              </Badge> */}
            </Link>
            <Link href="/cart">
                <Icons string="cart" />
              {/* <Badge count={cartDetails?.length}>
              </Badge> */}
            </Link>
          </div>
        </div>
        <div className="flex justify-center mt-5 ">
          <Line width="100%" fullLine={true} />
        </div>
        <div className=" flex justify-around px-[10%]">
          {heading.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={`font-bold font-small py-3 px-2 cursor-pointer`}
            >
              {item.head === "More" ? "More >>" : item.head}
            </Link>
          ))}
        </div>
      </div>
      <div className="min-651:hidden w-full flex mobile-view-nav flex-col py-1">
        <div className="w-full bg-white h-[30px]">
          <div
            className={`menu-toggle relative px-5 py-4 ${
              menuClick ? "menu-open" : ""
            }`}
            onClick={() => setMenuClick(!menuClick)}
          ></div>
        </div>
        <div
          className={`min-651:hidden menu-list w-[250px] bg-white shadow p-3 flex flex-col absolute max-425:top-[86px] 650-426:top-[102px] z-[9999]
         ${!menuClick ? "menu-close" : "menu-open"}`}
        >
          {/* <div
            className={`menu-toggle relative pb-5 px-2 py-2 ${
              menuClick ? "menu-open" : ""
            }`}
            onClick={(e) => {e.stopPropagation();setMenuClick(!menuClick)}}
          ></div> */}

          {heading.map((item) => (
            <Link
              key={item.id}
              href={item.path}
              className={`font-bold font-small py-3 px-2 cursor-pointer`}
              onClick={() => handleNavigation(item.path)}
            >
              {item.head}
            </Link>
          ))}

          <div className="flex w-full justify-center py-3 nav-bar-utilities">
            <div className="px-5">
              {Object.keys(cookies).length ? (
                <Link href="/dashboard" onClick={() => handleNavigation('/dashboard')}>
                  <Icons string="user" />
                </Link>
              ) : (
                <Link href="/login" onClick={() => handleNavigation('/login')}>
                  <Icons string="login" />
                </Link>
              )}              
            </div>
            <div className="px-5">
              <Link href="/wishlist" onClick={() => handleNavigation('/wishlist')}>
                <Icons
                  string="whislist"
                  color="black"
                  width="30px"
                  height="30px"
                />
              </Link>
            </div>
            <div className="px-5" onClick={() => handleNavigation("/cart")}>
              <Link href="/cart">
                <Icons string="cart" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
