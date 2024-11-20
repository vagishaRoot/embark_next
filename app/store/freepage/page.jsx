"use client"

import React, { useEffect, useState } from "react";
import Icons from "../../Icons/Icons";
import { message, Pagination, Popconfirm } from "antd";
import { deleteImages, getFreeImages } from "../../adminServices/FreeImageApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/app/components/AdminNavbar";

const cancel = (e) => {
  console.log(e);
  message.error("Click on No");
};

const FreePages_Admin = () => {
  const [image, setImage] = useState([]);
  const [current, setCurrent] = useState(1);
  const [totalItems, setTotalItems] = useState();
  const [nextPageFetchLoader, setNextPageFetchLoader] = useState(false);
  const [loader, setLoader] = useState(false);

  const onChange = (page) => {
    console.log(page);
    setCurrent(page);
    fetchImage(page);
  };

  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem("logginId") === null) {
      router.push("/store");
    } else {
      if (localStorage.getItem("loginTime") === null) {
        router.push("/store");
      } else {
        let time = JSON.parse(localStorage.getItem("loginTime"));
        if (parseInt((new Date() - new Date(time)) / (1000 * 60 * 60)) > 23) {
          localStorage.removeItem("loggedId");
          localStorage.removeItem("loginTime");
          router.push("/store");
        }
      }
    }
  }, []);

  useEffect(() => {
    let selectedNavbar = document.querySelector(".free-page");
    selectedNavbar.style.background = "#46aed1";
    selectedNavbar.style.color = "white";

    return () => {
      selectedNavbar.style.background = "transparent";
      selectedNavbar.style.color = "black";
    };
  }, []);

  const fetchImage = (page = undefined) => {
    if (!!page) {
      setNextPageFetchLoader(true);
    } else {
      setLoader(true);
    }
    getFreeImages(page)
      .then((response) => {
        setNextPageFetchLoader(false);
        setLoader(false);
        if (response.data.images.length) {
          if (image.length) {
            setNextPageFetchLoader(false);
            setImage([...image, ...response.data.images]);
          } else {
            setTotalItems(response.data.totalCount);
            setImage(response.data.images);
          }
        }
      })
      .catch((err) => {
        setLoader(false);
        setNextPageFetchLoader(false);
        console.error(err);
      });
  };
  useEffect(() => {
    fetchImage();
  }, []);

  const handleDelete = (id) => {
    console.log(`Delete blog with id: ${id}`); // Debugging line
    let token = localStorage.getItem("logginId");
    const header = {
      headers: {
        Authorization: `Bearer ${token.split("--")[1]}`,
        // "Content-Type": "multipart/form-data",
      },
    };
    deleteImages(id, header)
      .then((response) => {
        console.log("Delete response:", response); // Debugging line
        setImage((prevData) => prevData.filter((image) => image._id !== id));
      })
      .catch((err) => {
        console.error("Error deleting blog:", err);
      });
  };

  return (
    <>
        <AdminNavbar />
        <div className="flex flex-col justify-center items-center py-3 w-full gap-y-10">
        <div className="flex w-[90%] items-start">
            <Link
            className="flex px-4 py-2 font-small cursor-pointer text-white bg-[#46AED1] items-center gap-x-2"
            href="/store/freepage/addimage"
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="white"
                strokecClassName="bi bi-plus"
                viewBox="0 0 16 16"
                stroke="white"
            >
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>{" "}
            Add Image
            </Link>
        </div>
        <div className="flex justify-center items-center w-full flex-col">
            {!loader ? (
            image.length ? (
                <>
                <div className=" grid grid-cols-3 768-425:grid-cols-2 max-425:grid-cols-1 gap-5 w-[70%] max-1330:w-[90%] pb-6">
                    {image.map((item) => (
                    <div key={item._id} className="  rounded h-[560px] ">
                        <div className="  p-5 border-2 1024-768:p-2 650-425:p-2 rounded flex justify-center h-[521px] w-full">
                        <img
                            src={item.url}
                            alt="blog"
                            className=" p-6 border-2 shadow-xl rounded object-cover w-full"
                        />
                        </div>

                        <div className=" flex  justify-between px-5 1024-768:px-2 650-425:px-1 bg-[#46AED1] py-2 items-center ">
                        <div className=" flex items-center  font-medium  gap-3 650-425:gap-1">
                            <Icons
                            string="download"
                            width="20px"
                            height="20px"
                            className=" bg-white"
                            />
                            <p className="650-425:text-sm">
                            {item.count || "0"} downloads
                            </p>
                        </div>
                        <div className=" flex gap-5">
                            <Popconfirm
                            title="Delete the Image"
                            description="Are you sure to delete this Image?"
                            onConfirm={() => handleDelete(item._id)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No"
                            >
                            <span className="bg-[#46AED1] cursor-pointer">
                                <Icons string="delete" width="20px" height="20px" />
                            </span>
                            </Popconfirm>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                {nextPageFetchLoader ? (
                    <div className="w-full flex flex-col items-center justify-center">
                    <Icons string="loading" />
                    {/* <div className="text-4xl font-small font-bold">Loading</div> */}
                    </div>
                ) : (
                    <></>
                )}
                <Pagination
                    pageSize={10}
                    align="end"
                    className="flex justify-center"
                    current={current}
                    onChange={onChange}
                    total={totalItems}
                />
                </>
            ) : (
                <>
                <>
                    <div className="w-full flex flex-col items-center justify-center py-7">
                    <div className="text-4xl font-small font-bold">
                        Don't have any images. Create One!
                    </div>
                    </div>
                </>
                </>
            )
            ) : (
            <div className="w-full flex flex-col items-center justify-center py-7">
                <Icons string="loading" />
                <div className="text-4xl font-small font-bold">Loading</div>
            </div>
            )}
        </div>
        </div>
    </>
  );
};

export default FreePages_Admin;
