"use client"

import React, { useEffect, useState } from "react";
// import blog from "../assets/blog_page.png";

// import { useNavigate } from "react-router-dom";
import { getBlogs } from "../services/blogAPI";
// import { navigateState } from "../state/AppAtom";
// import { useRecoilState } from "recoil";
import { Pagination } from "antd";
import Icons from "../Icons/Icons";
import Navbar from "../components/Navbar";
import Link from "next/link";
import Footer from "../components/Footer";

const Blogs = () => {
  const [blogData, setBlogData] = useState([]);
//   const [navigation, setNavigation] = useRecoilState(navigateState);
//   const navigate = useNavigate();
  const [current, setCurrent] = useState(1);
  const [totalItems, setTotalItems] = useState();
  const [nextPageFetchLoader, setNextPageFetchLoader] = useState(false)

  const onChange = (page) => {
    console.log(page);
    setCurrent(page);
    fetchBlogs(page)
  };

  const fetchBlogs = (nextPage = undefined) => {
    if(!!nextPage) {
      setNextPageFetchLoader(true)
    }
    getBlogs(nextPage)
      .then((response) => {
        let data = response.data.blogs.filter((blog) => blog.check === true)
        if(blogData.length){
          setNextPageFetchLoader(false)
          setBlogData([...blogData, ...data]);
        } else {
          setTotalItems(response.data.totalCount)
          setBlogData(data);
        }
      })
      .catch((error) => {
        setNextPageFetchLoader(false)
        console.log(error);
      });
  }
  useEffect(() => {
    // debugger
    fetchBlogs()
    // setNavigation("Blogs");
  }, []);

  useEffect(() => {
    // let secondDiv = document.getElementById("topHeader");
    // secondDiv?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    } else {
      return text;
    }
  };

  const handelId = (id) => {
    // navigate("/blog_details", { state: { id: id } });
  };

  return (
    <>
    <Navbar />
      <div>
        <img
          src="/images/blog_page.png"
          alt="blog image"
          className=" w-full max-h-[600px] object-cover"
        />
      </div>

      {blogData?.length > 0 ? (
        <div className="flex justify-center items-center w-full flex-col">
          <div className="grid grid-cols-4 gap-10 1440-1024:grid-cols-3  w-[70%] max-1800:w-[90%] 1024-600:grid-cols-2 my-20 max-690:w-full max-600:grid-cols-1">
            {blogData &&
              blogData.map((item) => (
                <div
                  key={item._id}
                  className="max-600:mx-auto  rounded border border-black h-[500px] flex flex-col w-[280px]"
                >
                  <div className=" border border-black m-4 h-[60%] rounded ">
                    <img
                      src={item.imageurl}
                      alt="blog"
                      className=" object-cover h-[100%] w-[100%] p-4 "
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold px-4 capitalize">
                      {truncateText(item.title, 20)}
                    </h1>
                    {/* <p className='px-4 mt-4 h-10'  >{truncateText(item.descriptions, 60)} </p> */}
                    <div className="px-4 mt-4 h-10">
                      <p className="w-full text-wrap w-[246px] truncate"
                        dangerouslySetInnerHTML={{
                          __html: truncateText(item.descriptions, 60),
                        }}
                      />
                    </div>

                    <div className=" flex justify-end px-5 mt-5 items-center">
                      <Link
                        href={`/blogs/${item._id}`}
                        className=" p-2 bg-blue-500 text-white font-bold "
                      >
                        Read More...
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {nextPageFetchLoader 
          ? <div className="w-full flex flex-col items-center justify-center">
              <Icons string="loading" />
            </div>
        : <></>}
          <Pagination pageSize={6} align="end" className="flex justify-center" current={current} onChange={onChange} total={totalItems} />
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-7">
          <Icons string="loading" />
          <div className="text-4xl font-small font-bold">Loading</div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Blogs;
