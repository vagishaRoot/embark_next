"use client"

import React, { useEffect, useState } from "react";
import { saveAs } from "file-saver";
import Icons from "../Icons/Icons";
import { getFreePage, numberOfDownload } from "../services/freePageAPI";
import { useRecoilState } from "recoil";
import { cookiesState, navigateState } from "../state/appAtom";
import { Pagination, Popover } from "antd";
import Link from "next/link";
import Navbar from "../components/Navbar";

const content = (
  <div>
    <p>Please Login First</p>
    <Link href="/login" className="underline text-cyan-600 font-lg">
      Click here to login
    </Link>
  </div>
);

const Free_Pages = () => {
  const [images, setImages] = useState([]);
  const [navigation, setNavigation] = useRecoilState(navigateState);
  const [current, setCurrent] = useState(1);
  const [totalItems, setTotalItems] = useState();
  const [nextPageFetchLoader, setNextPageFetchLoader] = useState(false);
  const [cookies, setCookies] = useRecoilState(cookiesState);

  const onChange = (page) => {
    console.log(page);
    setCurrent(page);
    fetchPages(page)
  };

  useEffect(() => {
    let page = document.querySelector(".free-pages-div");
    page.addEventListener("keydown", function (event) {
      // F12
      if (event.keyCode === 123) {
        event.preventDefault();
      }
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (
        event.ctrlKey &&
        event.shiftKey &&
        (event.keyCode === 73 || event.keyCode === 74 || event.keyCode === 67)
      ) {
        event.preventDefault();
      }
      // Ctrl+U
      if (event.ctrlKey && event.keyCode === 85) {
        event.preventDefault();
      }
    });
    page.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
    setNavigation("Free_Stuff");
  }, []);

  useEffect(() => {
    fetchPages()
  }, []);

  const fetchPages = (page = undefined) => {
    if(!!page){
      setNextPageFetchLoader(true)
    }
    getFreePage(page)
      .then((response) => {
        // debugger
        if(images.length){
          setNextPageFetchLoader(false)
          setImages([...images, ...response.data.images]);
        } else {
          setTotalItems(response.data.totalCount)
          setImages(response.data.images);
        }
      })
      .catch((err) => {
        setNextPageFetchLoader(false)
        console.error("Error fetching images:", err);
      });
  }

  useEffect(() => {
    let secondDiv = document.getElementById("topHeader");
    secondDiv.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleDownload = async (e, url, id) => {
    numberOfDownload(id)
    .then((res)=>{
      console.log(res);
    })
    .catch((error)=>{
      console.error(error);
    })
    if (!url) {
      return; // Handle potential missing image URL gracefully
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch image"); // Handle fetch errors
    }

    const blob = await response.blob();
    const pngBlob = new Blob([blob], { type: "image/png" }); // Ensure PNG format
    saveAs(pngBlob, `${Date.now()}.png`); // Generate unique filename
  };

  return (
    <>
    <Navbar />
      <div className="w-full flex flex-col justify-center items-center bg-[#ffa5851f] gap-y-6 free-pages-div">
        <div className=" flex justify-center mt-20 w-[90%] items-center">
          <div className="w-[99%] max-768:hidden">
            <img src="/images/line_2.png" className="w-full" alt="Line image" />
          </div>
          <div className="w-full flex flex-col justify-center items-center">
            <p className="  text-2xl text-center text-[#46AED1] px-6 font-bold">
              Let Your Art Speak
            </p>
            <p>(Click on the Image to download{Object.keys(cookies).length === 0 ? ' after Login' : ''})</p>
          </div>
          <div className="w-[99%] max-768:hidden">
            <img src="/images/line_2.png" className="w-full" alt="Line image" />
          </div>
        </div>

        {images.length > 0 ? (
          <>
            <div className="grid grid-cols-3 w-[60%] 1440-1024:w-[80%] max-1024:w-[95%] gap-10 1024-650:grid-cols-2 max-650:grid-cols-1 max-425:w-[95%]">
              {images.map((item) => (
                <div
                  key={item._id}
                  className="h-[450px] flex justify-center items-center"
                >
                  {Object.keys(cookies).length
                  ? <div className="relative w-full h-full" onClick={(e) => handleDownload(e, item.url, item._id)}>
                      <img src={item.url} className="w-full h-[100%] object-cover" alt="..." />
                      <div
                        className="bg-[red] absolute top-[8px] right-0 ant-ribbon cursor-pointer"                      
                      >
                        <div className="text-white ant-ribbon-text">
                          Download (HD)
                        </div>
                        <div className="ant-ribbon-corner"></div>
                      </div>
                    </div>
                  : <Popover content={content} trigger="click">
                      <div className="relative w-full h-full">
                        <img src={item.url} className="w-full h-[100%] object-cover" alt="..." />
                        <div
                          className="bg-[red] absolute top-[8px] right-0 ant-ribbon cursor-pointer"                      
                        >
                          <div className="text-white ant-ribbon-text">
                            Download (HD)
                          </div>
                          <div className="ant-ribbon-corner"></div>
                        </div>
                      </div>
                    </Popover>
                  }
                  {/* <div className='  text-center flex justify-center w-[90%] bg-blue-500  '>
                    <button
                      className='font-bold text-xl text-white py-2'
                      onClick={() => handleDownload(item.url)}
                    >
                      DOWNLOAD
                    </button>
                  </div> */}
                </div>
              ))}
            </div>
            
          </>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-7">
            <Icons string="loading" />
            <div className="text-4xl font-small font-bold">Loading</div>
          </div>
        )}
        {nextPageFetchLoader 
        ? <div className="w-full flex flex-col items-center justify-center">
            <Icons string="loading" />
            {/* <div className="text-4xl font-small font-bold">Loading</div> */}
          </div>
        : <></>
        }

        {images.length ? <Pagination pageSize={10} align="end" className="flex justify-center" current={current} onChange={onChange} total={totalItems} /> : <></>}

        
      </div>

      {/* <div className="border h-1 bg-black  mb-14"></div> */}
    </>
  );
};

export default Free_Pages;
