"use client"

import React from "react";
import Icons from "../Icons/Icons";
import Link from "next/link";

const data = [
  {
    heading: "Home",
    subheading: "/",
  },
  {
    heading: "About Us",
    subheading: "/about_us",
  },
  {
    heading: "Shop",
    subheading: "/shop",
  },
  {
    heading: "Blogs",
    subheading: "/blogs",
  },
];

const data1 = [
  {
    heading: "Free Stuff",
    subheading: "/free_page",
  },
  {
    heading: "Your Account",
    subheading: "/dashboard",
  },
  {
    heading: "Wishlist",
    subheading: "/wishlist",
  },
  {
    heading: "FAQ",
    subheading: "/faq",
  },
];

const Footer = () => {
  return (
    <>
      <div className="w-full flex justify-center border-t-2 py-10 shadow-[0_-1px_6px_#ddd] footer">
        <div className="flex justify-center w-[85%] 1024-768:w-[95%] 768-425:flex-wrap max-425:flex-wrap max-425:w-[95%] 991-426:hidden">
          <div className=" w-1/4 768-425:w-1/2 768-425:my-5 px-10 flex justify-center items-start 768-425:justify-start max-425:justify-center 768-425:pl-0 max-425:w-full">
            <div className="w-[168px] flex flex-col gap-y-5">
              <img src="/images/logo.png" className=" object-contain " alt="..." />
              <div className=" flex justify-between icons-row max-425:hidden items-center">
                <Link href="https://www.instagram.com/embarkyourcreativity?igsh=NGVhN2U2NjQ0Yg==" target="_blank">
                  <Icons string="instagram" width="25px" height="25px" />
                </Link>
                <Link href="https://www.tiktok.com/@embarkyourcreativity?_t=8pcl1qMNEOx&_r=1" target="_blank">
                  <Icons string="tiktok" width="25px" height="25px" />
                </Link>
                <Link href="https://www.facebook.com/profile.php?id=61556235080928&mibextid=ZbWKwL" target="_blank">
                  <Icons string="facebook" width="25px" height="25px" />
                </Link>
                <Link href="https://in.pinterest.com/embarkyourcreativity/" target="_blank">
                  <Icons string="pinterest" width="25px" height="25px" />
                </Link>
                <Link href="https://www.amazon.com/stores/Embark-Your-Creativity/author/B0CYNS193P?ref=ap_rdr&isDramIntegrated=true&shoppingPortalEnabled=true" target="_blank">
                  <Icons string="amazon" width="25px" height="25px" />
                </Link>
              </div>
            </div>
          </div>          
          <div className="w-1/4 768-425:w-1/2 768-425:my-5 flex max-425:w-full max-425:my-5">
            <div className="flex flex-col gap-y-[3px]">
              <h2 className=" underline font-medium text-2xl 1024-768:text-xl 550-425:text-lg max-425:text-2xl">
                Get To Know Us
              </h2>
              {data.map((item, index) => (
                <Link href={item.subheading} key={index}>
                  <div
                    key={index}
                    className=" text-lg 1024-768:text-base font-medium  cursor-pointer 550-425:text-sm max-425:text-lg"
                  >
                    {item.heading}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="w-1/4 768-425:w-1/2 768-425:my-5 flex flex-col gap-y-[3px] max-425:w-full max-425:my-5">
            <h2 className=" underline font-medium text-2xl 1024-768:text-xl 550-425:text-lg max-425:text-2xl">
              Let Us Help You
            </h2>
            {data1.map((item, index) => (
              <Link href={item.subheading} key={index}>
                <div
                key={index}
                className=" text-lg 1024-768:text-base 550-425:text-sm font-medium max-425:text-lg"
                >
                  {item.heading}
                </div>
              </Link>
            ))}
          </div>
          <div className=" w-1/4 768-425:w-1/2 768-425:my-5 flex gap-y-2 flex-col max-425:w-full ">
            <div className=" mt-10 flex flex-col gap-y-3 max-425:mt-[10px] min-426:hidden">
              <p className=" font-bold text-xl  text-right max-425:text-left">Contact Us</p>
              <div className=" flex justify-end max-425:flex-row-reverse max-425:gap-x-[10px] items-center">
                <div className="flex flex-col items-end max-425:items-start">
                  <a href="mailto:embarkyourcreativity@gmail.com" className=" pr-2  font-medium">embarkyourcreativity@gmail.com</a>
                  <a href="mailto:info@embarkyourcreativity.com" className=" pr-2  font-medium">info@embarkyourcreativity.com</a>
                </div>
                <Icons string="gmail" width="20px" height="20px" />
              </div>
              <div className=" flex justify-end max-425:flex-row-reverse gap-x-[10px]">
                <div className="flex flex-col items-start">
                  <p className=" pr-2  font-medium">+1 (408) 471-7280</p>
                  <p className=" pr-2  font-medium">+1-510-621-3521</p>
                </div>
                <Icons string="contact" width="20px" height="20px" />
              </div>
              <div className="max-425:flex min-426:hidden mobile-view max-425:justify-end max-425:flex-row-reverse max-425:gap-x-[20px]">
                <Link href="https://www.instagram.com/embarkyourcreativity?igsh=NGVhN2U2NjQ0Yg==" target="_blank">
                  <img src="/images/instagram.png" className="w-[25px]" />
                </Link>
                <Link href="https://www.tiktok.com/@embarkyourcreativity?_t=8pcl1qMNEOx&_r=1" target="_blank">
                  <Icons string="tiktok" width="25px" height="25px" />
                </Link>
                <Link href="https://www.facebook.com/profile.php?id=61556235080928&mibextid=ZbWKwL" target="_blank">
                  <Icons string="facebook" width="25px" height="25px" />
                </Link>
                <Link href="https://in.pinterest.com/embarkyourcreativity/" target="_blank">
                  <Icons string="pinterest" width="25px" height="25px" />
                </Link>
                <Link href="https://www.amazon.com/stores/Embark-Your-Creativity/author/B0CYNS193P?ref=ap_rdr&isDramIntegrated=true&shoppingPortalEnabled=true" target="_blank">
                  <Icons string="amazon" width="25px" height="25px" />
                </Link>
              </div>
            </div>
            {/* <h2 className="  font-medium text-xl 1024-768:text-lg 550-425:text-base max-425:mt-[20px] max-425:text-xl">
              NewsLetter
            </h2>
            <div className="flex gap-x-1 w-full">
              <input
                type="text"
                placeholder="Enter Your Email"
                className="border border-black  w-[80%] h-[30px] outline-none px-1 "
              />
              <div className="bg-[#46AED1] p-1 px-2 ">
                <Icons string="send" width="20px" height="20px" />
              </div>
            </div> */}
            <div className="flex flex-col gap-y-3 max-425:hidden">
              <p className=" font-bold text-xl  text-right max-425:text-left">Contact Us</p>
              <div className="flex flex-col justify-end gap-[10px] items-end flex-wrap">
                <Icons string="gmail" width="20px" height="20px" />
                <div className="flex flex-col items-end">
                  <a href="mailto:embarkyourcreativity@gmail.com" className="font-medium text-wrap">embarkyourcreativity@gmail.com</a>
                  <a href="mailto:info@embarkyourcreativity.com" className="font-medium text-wrap">info@embarkyourcreativity.com</a>
                </div>
              </div>
              <div className=" flex justify-end items-end flex-col gap-[10px]">
                <Icons string="contact" width="20px" height="20px" />
                <div className="flex flex-col items-end">
                  <p className="font-medium">+1 (408) 471-7280</p>
                  <p className="font-medium">+1-510-621-3521</p>
                </div>
              </div>
              <div className="max-425:flex min-426:hidden mobile-view max-425:justify-end max-425:flex-row-reverse max-425:gap-x-[20px]">
                <Link href="https://www.instagram.com/embarkyourcreativity?igsh=NGVhN2U2NjQ0Yg==" target="_blank">
                  <img src="/images/instagram.png" className="w-[25px]" />
                </Link>
                <Link href="https://www.tiktok.com/@embarkyourcreativity?_t=8pcl1qMNEOx&_r=1" target="_blank">
                  <Icons string="tiktok" width="25px" height="25px" />
                </Link>
                <Link href="https://www.facebook.com/profile.php?id=61556235080928&mibextid=ZbWKwL" target="_blank">
                  <Icons string="facebook" width="25px" height="25px" />
                </Link>
                <Link href="https://in.pinterest.com/embarkyourcreativity/" target="_blank">
                  <Icons string="pinterest" width="25px" height="25px" />
                </Link>
                <Link href="https://www.amazon.com/stores/Embark-Your-Creativity/author/B0CYNS193P?ref=ap_rdr&isDramIntegrated=true&shoppingPortalEnabled=true" target="_blank">
                  <Icons string="amazon" width="25px" height="25px" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-around w-[95%] gap-x-[20px] 991-426:flex-wrap min-991:hidden max-425:hidden items-start">
          <div className=" w-1/4 991-426:w-auto 991-426:my-5 flex gap-y-2 flex-col max-425:w-full ">
            <div className=" flex flex-col gap-y-3">
              <p className=" font-bold text-xl  text-left">Contact Us</p>
              <div className=" flex justify-start gap-x-[10px] items-center">
                <Icons string="gmail" width="20px" height="20px" />
                <div className="flex flex-col items-start">
                  <a href="mailto:embarkyourcreativity@gmail.com" className=" pr-2  font-medium">embarkyourcreativity@gmail.com</a>
                  <a href="mailto:info@embarkyourcreativity.com" className=" pr-2  font-medium">info@embarkyourcreativity.com</a>
                </div>
              </div>
              <div className=" flex justify-start gap-x-[10px] items-center">
                <Icons string="contact" width="20px" height="20px" />
                <div className="flex flex-col items-start">
                  <p className=" pr-2  font-medium">+1 (408) 471-7280</p>
                  <p className=" pr-2  font-medium">+1-510-621-3521</p>
                </div>
              </div>
              <div className="max-425:flex max-425:gap-x-3 min-426:hidden mobile-view max-425:justify-end">
                <Link href="https://www.instagram.com/embarkyourcreativity?igsh=NGVhN2U2NjQ0Yg==" target="_blank">
                  <img src="/images/instagram.png" className="w-[25px]" />
                </Link>
                <Link href="https://www.tiktok.com/@embarkyourcreativity?_t=8pcl1qMNEOx&_r=1" target="_blank">
                  <Icons string="tiktok" width="25px" height="25px" />
                </Link>
                <Link href="https://www.facebook.com/profile.php?id=61556235080928&mibextid=ZbWKwL" target="_blank">
                  <Icons string="facebook" width="25px" height="25px" />
                </Link>
                <Link href="https://in.pinterest.com/embarkyourcreativity/" target="_blank">
                  <Icons string="pinterest" width="25px" height="25px" />
                </Link>
                <Link href="https://www.amazon.com/stores/Embark-Your-Creativity/author/B0CYNS193P?ref=ap_rdr&isDramIntegrated=true&shoppingPortalEnabled=true" target="_blank">
                  <Icons string="amazon" width="25px" height="25px" />
                </Link>
              </div>
            </div>            
          </div>
          <div className=" w-1/4 991-426:w-auto 991-426:my-5 flex max-425:hidden">
            <div className="flex flex-col gap-y-[3px]">
              <h2 className=" underline font-medium text-2xl 1024-768:text-xl 991-426:text-lg 550-425:text-lg">
                Get To Know Us
              </h2>
              {data.map((item, index) => (
                <Link href={item.subheading} key={index}>
                  <div
                    key={index}
                    className=" text-lg 1024-768:text-base font-medium  cursor-pointer 550-425:text-sm"
                  >
                    {item.heading}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className=" w-1/4 991-426:w-auto 991-426:my-5 flex flex-col gap-y-[3px] max-425:hidden">
            <h2 className=" underline font-medium text-2xl 1024-768:text-xl 550-425:text-lg 768-425:text-lg text-wrap">
              Let Us Help You
            </h2>
            {data1.map((item, index) => (
              <Link href={item.subheading} key={index}>
                <div
                key={index}
                className=" text-lg 1024-768:text-base 550-425:text-sm font-medium"
                >
                  {item.heading}
                </div>
              </Link>
            ))}
          </div>
          <div className="w-full flex justify-center">
            <div className="flex flex-col w-[500px] items-center">
              {/* <h2 className="  font-medium text-xl 1024-768:text-lg 550-425:text-base w-full">
                NewsLetter
              </h2>
              <div className="flex gap-x-1 w-full">
                <input
                  type="text"
                  placeholder="Enter Your Email"
                  className="border border-black  w-full h-[30px] outline-none px-1 "
                />
                <div className="bg-[#46AED1] p-1 px-2 ">
                  <Icons string="send" width="20px" height="20px" />
                </div>
              </div> */}
              <div className="w-full flex justify-around icons-row max-425:hidden mt-[15px]">
                <Link href="https://www.instagram.com/embarkyourcreativity?igsh=NGVhN2U2NjQ0Yg==" target="_blank">
                  <img src="/images/instagram.png" className="w-[25px]" />
                </Link>
                <Link href="https://www.tiktok.com/@embarkyourcreativity?_t=8pcl1qMNEOx&_r=1" target="_blank">
                  <Icons string="tiktok" width="25px" height="25px" />
                </Link>
                <Link href="https://www.facebook.com/profile.php?id=61556235080928&mibextid=ZbWKwL" target="_blank">
                  <Icons string="facebook" width="40px" height="40px" />
                </Link>
                <Link href="https://in.pinterest.com/embarkyourcreativity/" target="_blank">
                  <Icons string="pinterest" width="40px" height="40px" />
                </Link>
                <Link href="https://www.amazon.com/stores/Embark-Your-Creativity/author/B0CYNS193P?ref=ap_rdr&isDramIntegrated=true&shoppingPortalEnabled=true" target="_blank">
                  <Icons string="amazon" width="40px" height="40px" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
