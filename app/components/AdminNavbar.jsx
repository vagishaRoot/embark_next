"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const AdminNavbar = () => {
    const router = useRouter()
  const [menuClick, setMenuClick] = useState(false);

  const handleNavigation = (path) => {
    setMenuClick(false);
    router.push(path);
  };

  const logout = () => {
    localStorage.removeItem('logginId')
    localStorage.removeItem('loginTime')
    router.push("/store");
    window.location.reload()
  }

  return (
    <>
      <div className="w-full flex justify-between pl-8 max-768:px-0 relative shadow-[0px_1px_3px_#ccc]">
        <div className="flex gap-x-[30px] max-991:gap-x-0 max-991:justify-between max-650:hidden">
          <Link className="text-base py-[10px] px-[10px] font-semibold dashboard-page" href="/store/dashboard">Dashboard</Link>
          <Link className="text-base py-[10px] px-[10px] font-semibold store-page" href="/store/products">Store</Link>
          <Link className="text-base py-[10px] px-[10px] font-semibold free-page" href="/store/freepage">Free Pages</Link>
          <Link className="text-base py-[10px] px-[10px] font-semibold blog-page" href="/store/blogs">Blog</Link>
          <Link className="text-base py-[10px] px-[10px] font-semibold user-page" href="/store/user">Users</Link>
          <Link className="text-base py-[10px] px-[10px] font-semibold faq-page" href="/store/faq">FAQ</Link>
          <Link className="text-base py-[10px] px-[10px] font-semibold coupon-page" href="/store/coupons">Coupons</Link>
          <Link className="text-base py-[10px] px-[10px] font-semibold go-to-page" href="/">Main website</Link>
        </div>
        <div className={`pl-6 min-651:hidden max-650:flex mob-nav ${menuClick ? "menu-open" : ""}`} onClick={() => setMenuClick(!menuClick)}>
        </div>
        <div className={`min-651:hidden menu-list w-[250px] z-10 bg-white shadow p-3 flex flex-col absolute max-425:top-[47px] 650-426:top-[47px] ${!menuClick ? "menu-close" : "menu-open"}`}>
          <Link
            href="/store/dashboard"
            className="font-bold font-small py-3 cursor-pointer px-2"
            onClick={() => handleNavigation("/store/dashboard")}
          >
            Dashboard
          </Link>
          <Link
            href="/store/products"
            className="font-bold font-small py-3 cursor-pointer px-2"
            onClick={() => handleNavigation("/store/products")}
          >
            Store
          </Link>
          <Link
            href="/store/freepage"
            className="font-bold font-small py-3 cursor-pointer px-2"
            onClick={() => handleNavigation("/store/freepage")}
          >
            Free Page
          </Link>
          <Link
            href="/store/blogs"
            className="font-bold font-small py-3 cursor-pointer px-2"
            onClick={() => handleNavigation("/store/blogs")}
          >
            Blogs
          </Link>
          <Link
            href="/store/blogs"
            className="font-bold font-small py-3 cursor-pointer px-2"
            onClick={() => handleNavigation("/store/user")}
          >
            Users
          </Link>
          <Link
            href="/store/blogs"
            className="font-bold font-small py-3 cursor-pointer px-2"
            onClick={() => handleNavigation("/store/faq")}
          >
            FAQ
          </Link>
          <Link
            href="/store/coupons"
            className="font-bold font-small py-3 cursor-pointer px-2"
            onClick={() => handleNavigation("/store/coupons")}
          >
            Coupon
          </Link>
          <Link
            href="/"
            className="font-bold font-small py-3 cursor-pointer px-2"
            onClick={() => handleNavigation("/")}
          >
            Main website
          </Link>
        </div>
        <div className="text-base py-[10px] px-[10px] font-semibold bg-[red] text-white cursor-pointer" onClick={logout}>Logout</div>
      </div>

      {/* <div className="h-1 border bg-black"></div> */}
    </>
  );
};

export default AdminNavbar;
