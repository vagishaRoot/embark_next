"use client";

import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import axios from "axios";
// import { useRecoilState } from "recoil";
// import { navigateState } from "../state/AppAtom";
import { getBlog, getIp } from "../../services/blogAPI";
import { Skeleton } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/app/components/Navbar";

const Blog_details = ({ params }) => {
  //   const [navigation, setNavigation] = useRecoilState(navigateState);
  console.log("params:- ", params);
  const router = usePathname();
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState("");
  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
  });

  //   const location = useLocation();
  const {blogId} = params;

  useEffect(() => {
    getIp()
      .then((res) => {
        console.log(res);
        setIp(res.data.ip);
      })
      .catch((err) => {
        console.log(err);
      });
    // let secondDiv = document.getElementById("topHeader")
    // secondDiv.scrollIntoView({ behavior: "smooth", block: "start" })
  }, []);

  useEffect(() => {
    if (!!blogId && !!ip) {
      setLoading(true);
      let obj = { ip: ip };
      getBlog(blogId, obj)
        .then((response) => {
          const { title, descriptions, imageurl, link, subtitle } =
            response.data;
          setLoading(false);
          setBlogData({
            title,
            description: descriptions, // Make sure to match this with the state variable
            image: imageurl,
            link,
            subtitle,
          });
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
        });
      //   setNavigation("Blogs");
    }
  }, [blogId, ip]);

  const goToPage = () => {
    window.location.replace(`https://${blogData.link}`);
  };

  return (
    <>
      <Navbar />
      <Link href="/blogs">
        <button className="p-2 bg-blue-500 text-white text-xl font-bold ml-[40px] mt-6 max-650:ml-[20px]">
          {"<<"} All Blogs
        </button>
      </Link>

      {loading ? (
        <div className="flex justify-center py-[30px]">
          <div className="w-[50%] flex flex-col gap-y-6 mt-10 items-center">
            <Skeleton.Image active={true} size="large" width="100%" />
            <Skeleton.Button
              active={true}
              size="large"
              shape="square"
              block={true}
            />
            <div className="flex flex-col gap-y-2 w-full">
              <Skeleton.Button
                active={true}
                size="small"
                shape="square"
                block={true}
              />
              <Skeleton.Button
                active={true}
                size="small"
                shape="square"
                block={true}
              />
              <Skeleton.Button
                active={true}
                size="small"
                shape="square"
                block={true}
              />
              <Skeleton.Button
                active={true}
                size="small"
                shape="square"
                block={true}
              />
              <Skeleton.Button
                active={true}
                size="small"
                shape="square"
                block={true}
              />
              <Skeleton.Button
                active={true}
                size="small"
                shape="square"
                block={true}
              />
              <Skeleton.Button
                active={true}
                size="small"
                shape="square"
                block={true}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center mb-20 mt-10  ">
          {Object.keys(blogData).length ? (
            <div className="flex flex-col items-center w-[70%] gap-y-[20px] 768-425:w-[85%] max-425:w-[90%]">
              {blogData.image && (
                <img
                  src={blogData.image}
                  alt="..."
                  className=" object-contain  w-[70%] h-60  mx-auto max-425:w-[250px] "
                />
              )}
              {blogData.title && (
                <h1 className="text-xl font-bold w-full capitalize ">
                  {blogData.title}
                </h1>
              )}
              {blogData.link && blogData.subtitle ? (
                <button
                  onClick={goToPage}
                  className="bg-blue-500 text-white px-[20px] py-[10px]"
                >
                  {blogData.subtitle}
                </button>
              ) : (
                <></>
              )}
              {blogData.description && (
                <div
                  className="text-justify w-full "
                  dangerouslySetInnerHTML={{ __html: blogData.description }}
                />
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
};

export default Blog_details;
