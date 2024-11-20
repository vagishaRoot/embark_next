"use client";

import React, { useEffect, useState } from "react";
import Icons from "../../Icons/Icons";
import axios from "axios";
import { message, Pagination, Popconfirm } from "antd";
import { Tabs } from "antd";
import { notification } from "antd";
import { getBlogs, getTrash } from "../../services/blogAPI";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminNavbar from "@/app/components/AdminNavbar";

const cancel = (e) => {
  console.log(e);
  message.error("Click on No");
};

const BlogAdmin = () => {
  const router = useRouter();

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
  const items = [
    {
      key: "1",
      label: "All Blogs",
      children: <AllItem />,
    },
    {
      key: "2",
      label: "Trash Blogs",
      children: <DeleteItem />,
    },
  ];

  const onChange = (key) => {
    // console.log(key);
  };

  return (
    <>
      <AdminNavbar />
      <div className="flex justify-center w-full">
        <div className="w-[90%] max-1024:w-[95%] flex flex-col items-start py-5 gap-y-7">
          <Link
            href="/store/addblog"
            className=" bg-[#46AED1] text-center font-medium text-lg py-2 px-4 text-white "
          >
            + Add Blog
          </Link>
          <Tabs
            defaultActiveKey="1"
            items={items}
            className=" font-bold font-small w-full"
            size="large"
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
};
export default BlogAdmin;

const DeleteItem = () => {
  const [blogData, setBlogData] = useState([]);
  const [nextPageFetchLoader, setNextPageFetchLoader] = useState(false);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState();
  const [trashBlog, setTrashBlog] = useState(null);

  useEffect(() => {
    if (blogData.length === 0 && !!trashBlog) {
      handelUpdate(trashBlog);
    }
  }, [blogData, trashBlog]);

  const onChange = (page) => {
    console.log(page);
    setCurrent(page);
    fetchData(page);
  };

  const [api, contextHolder] = notification.useNotification();

  const fetchData = (page = undefined) => {
    if (!!page) {
      setNextPageFetchLoader(true);
    } else {
      setLoading(true);
    }
    getTrash(page)
      .then((res) => {
        // debugger
        setNextPageFetchLoader(false);
        setLoading(false);
        if (blogData.length) {
          setBlogData([...blogData, ...res.data.blogs]);
        } else {
          setBlogData(res.data.blogs);
        }
        setTotalItems(res.data.totalCount);
      })
      .catch((err) => {
        setNextPageFetchLoader(false);
        console.error(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    } else {
      return text;
    }
  };

  const handelUpdate = async (id) => {
    setLoading(true);
    console.log(`Update blog with id: ${id}`); // Debugging line
    const header = {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("logginId").split("--")[1]
        }`,
      },
    };
    try {
      const response = await axios.put(
        `https://api.embarkyourcreativity.com/api/blog_update/${id}`,
        { check: true },
        header
      );

      if (response.data) {
        setTrashBlog(null);
        const updatedBlogData = blogData.map((blog) =>
          blog._id === id ? { ...blog, check: false } : blog
        );
        openNotification("Blog is re-uploaded", true, "success");
        // setBlogData(updatedBlogData);
        fetchData();

        console.log("Update Api :", updatedBlogData);
      }
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const handelDelete = async (id) => {
    const header = {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("logginId").split("--")[1]
        }`,
      },
    };
    try {
      const response = await axios.delete(
        `https://api.embarkyourcreativity.com/api/blog_delete/${id}`,
        header
      );
      //response.data.check = false;
      //console.log("Delete response:", response.data.check); // Debugging line
      setBlogData((prevData) => prevData.filter((blog) => blog._id !== id));
      // message.error('this blog delete  permanantly');
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const openNotification = (message, pauseOnHover, type) => {
    api[type]({
      message: message,
      duration: 2,
      showProgress: true,
      pauseOnHover,
    });
  };

  return (
    <>
      {contextHolder}
      <div className="flex w-full flex-col items-center">
        {!loading ? (
          <>
            {blogData.length ? (
              <>
                <div className=" grid grid-cols-4 1330-768:grid-cols-3 768-425:grid-cols-2 768-425:gap-3 max-425:grid-cols-1 gap-5 w-[85%] max-1440:w-full mt-20  my-40    ">
                  {blogData.map((item) => (
                    <div className="w-full flex justify-center" key={item._id}>
                      <div className=" w-[280px]  h-[370px] flex flex-col justify-between rounded border-2 border-black">
                        <div className="h-[230px] p-[15px] 768-425:p-[10px] pb-0">
                          <img
                            src={item.imageurl}
                            alt="blog"
                            className="h-[210px] w-full border-2 object-cover"
                          />
                        </div>
                        <div className="pb-3 h-[140px] relative">
                          <h1 className="text-xl font-bold px-[20px] 768-425:px-[10px] h-8 w-[276px] truncate">
                            {item.title}
                            {/* {" "}
                            {truncateText(item.title, 20)} */}
                          </h1>
                          <div className="px-[20px] h-[48px] 768-425:px-[10px]">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: truncateText(item.descriptions, 40),
                              }}
                            />
                          </div>

                          {/* <div className=" flex  justify-between px-3 bg-[#46AED1] py-2 items-center ">
                          <div className=" flex items-center  font-medium gap-4">
                            <div className="flex gap-x-1 items-center">
                              <Icons string="view" width="30px" height="30px" className=" bg-white" />
                              <p className=" ">0</p>
                            </div>
                            <div className="flex gap-x-1 items-center">
                              <Icons string="like" width="20px" height="20px" className=" bg-white" />
                              <p className=" ">0</p>
                            </div>
                          </div>
                          <div className=" flex gap-5">
                            <span onClick={() => handelId(item._id)} ><Icons string="pen" width="20px" height="20px" /></span>
                            <Popconfirm
                              title="Delete the blog"
                              description="Are you sure to delete this blog?"
                              onConfirm={() => handleUpdate(item._id)}
                              onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                            >
                              <span className='bg-[#46AED1]'><Icons string="delete" width="20px" height="20px" /></span>
                            </Popconfirm>
                          </div>
                        </div> */}
                          <div className="w-full flex px-[5px] justify-center gap-x-[10px] absolute bottom-[5px]">
                            <span
                              className=" "
                              onClick={() => {
                                setBlogData([]), setTrashBlog(item._id);
                              }}
                            >
                              {/* <Icons string="update" width="20px" height="20px" /> */}
                              <button className=" bg-[#46AED1] text-sm text-white px-[10px] py-[15px] 550-425:px-[5px] 550-425:py-[5px]">
                                Re - upload
                              </button>
                            </span>

                            <Popconfirm
                              title="Delete the blog"
                              description="Are you sure, you want to delete this blog permanantly?"
                              onConfirm={() => {
                                handelDelete(item._id),
                                  openNotification(
                                    "Blog is deleted permanently",
                                    true,
                                    "success"
                                  );
                              }}
                              onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                            >
                              <button className=" bg-[#DC0000] text-sm text-white px-[10px] py-[15px] text-wrap 550-425:px-[5px] 550-425:py-[5px]">
                                Delete Permanantly
                              </button>
                            </Popconfirm>
                            {/* <span className=" " onClick={() => handelDelete(item._id)} >
                            <button className=" bg-[#DC0000] text-xm text-white  h-12 w-28    " >Delete Permanantly</button>
                          </span> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {nextPageFetchLoader ? (
                  <div className="w-full flex justify-center">
                    <Icons string="loading" />
                  </div>
                ) : (
                  <></>
                )}
                <Pagination
                  pageSize={6}
                  align="center"
                  className="flex justify-center"
                  current={current}
                  onChange={onChange}
                  total={totalItems}
                />
              </>
            ) : (
              <div className="w-full text-center">
                You dont have trashed Blogs
              </div>
            )}
          </>
        ) : (
          <div className="w-full flex justify-center">
            <Icons string="loading" />
          </div>
        )}
      </div>
    </>
  );
};

const AllItem = () => {
  const [blogData, setBlogData] = useState([]);
  const [nextPageFetchLoader, setNextPageFetchLoader] = useState(false);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(false);
  const [trashBlog, setTrashBlog] = useState(null);
  const [totalItems, setTotalItems] = useState();
  const router = useRouter();
  const onChange = (page) => {
    console.log(page);
    setCurrent(page);
    fetchData(page);
  };

  useEffect(() => {
    let selectedNavbar = document.querySelector(".blog-page");
    selectedNavbar.style.background = "#46aed1";
    selectedNavbar.style.color = "white";

    return () => {
      selectedNavbar.style.background = "transparent";
      selectedNavbar.style.color = "black";
    };
  }, []);

  const fetchData = (page = undefined) => {
    if (!!page) {
      setNextPageFetchLoader(true);
    } else {
      setLoading(true);
    }
    getBlogs(page)
      .then((response) => {
        // debugger
        setNextPageFetchLoader(false);
        setLoading(false);

        if (blogData.length === 0) {
          setTotalItems(response.data.totalCount);
          setBlogData(response.data.blogs);
        } else {
          setBlogData([...blogData, ...response.data.blogs]);
        }
      })
      .catch((error) => {
        setNextPageFetchLoader(false);
        console.error(error);
      });
  };

  const [api, contextHolder] = notification.useNotification();

  const openNotification = (message, pauseOnHover, type) => {
    api[type]({
      message: message,
      duration: 2,
      showProgress: true,
      pauseOnHover,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (blogData.length === 0 && !!trashBlog) {
      handleUpdate(trashBlog);
    }
  }, [blogData, trashBlog]);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    } else {
      return text;
    }
  };

  const handleUpdate = async (id) => {
    setLoading(true);
    console.log(`Update blog with id: ${id}`); // Debugging line
    const header = {
      headers: {
        Authorization: `Bearer ${
          localStorage.getItem("logginId").split("--")[1]
        }`,
      },
    };
    try {
      const response = await axios.put(
        `https://api.embarkyourcreativity.com/api/blog_update/${id}`,
        { check: false },
        header
      );
      // console.log("Updating Blog Data Using Blog Update  :", response);
      if (response.data) {
        const updatedBlogData = blogData.map((blog) =>
          blog._id === id ? { ...blog, check: true } : blog
        );
        // , { check: false }
        // setBlogData(updatedBlogData);
        openNotification(
          "Blog move to Trash Section. You can Re-use it",
          true,
          "success"
        );
        console.log("blog data:- ", blogData);
        setTrashBlog(null);
        fetchData();

        // console.log("Update Api :", updatedBlogData);
      }
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  const handelId = (id) => {
    router.push(`/store/updateblog/${id}`);
    // message.error('this blog updated');
  };

  return (
    <>
      {contextHolder}
      <div className="flex w-full flex-col items-center">
        {!loading ? (
          <>
            {blogData.length ? (
              <>
                <div className="w-full grid grid-cols-4 1330-768:grid-cols-3 768-425:grid-cols-2 768-425:gap-3 max-680:grid-cols-1 gap-5 max-1440:w-full mt-20  my-40">
                  {blogData.map((item) => (
                    <div className="w-full flex justify-center" key={item._id}>
                      <div className=" w-[280px]  h-[370px] flex flex-col justify-between rounded border-2 border-black">
                        <div className="h-[230px] p-[15px] 768-425:p-[10px] pb-0">
                          <img
                            src={item.imageurl}
                            alt="blog"
                            className="h-[210px] w-full border-2 object-cover"
                          />
                        </div>
                        <div className=" ">
                          <h1 className="text-xl font-bold px-[20px] 768-425:px-[10px] h-8 w-[276px] truncate">
                            {item.title}
                            {/* {" "}
                        {truncateText(item.title, 20)} */}
                          </h1>
                          <div className="px-[20px] h-[48px] 768-425:px-[10px]">
                            <p
                              dangerouslySetInnerHTML={{
                                __html: truncateText(item.descriptions, 40),
                              }}
                            />
                          </div>

                          <div className=" flex  justify-between px-3 bg-[#46AED1] py-2 items-center ">
                            <div className=" flex items-center  font-medium gap-4">
                              <div className="flex gap-x-1 items-center">
                                <Icons
                                  string="view"
                                  width="30px"
                                  height="30px"
                                  className=" bg-white"
                                />
                                <p className=" ">{item.views}</p>
                              </div>
                              {/*  <div className="flex gap-x-1 items-center">
                                <Icons
                                  string="like"
                                  width="20px"
                                  height="20px"
                                  className=" bg-white"
                                />
                                <p className=" ">0</p>
                              </div> */}
                            </div>
                            <div className=" flex gap-5">
                              <span onClick={() => handelId(item._id)}>
                                <Icons
                                  string="pen"
                                  width="20px"
                                  height="20px"
                                />
                              </span>

                              <Popconfirm
                                title="Delete the blog"
                                description="Are you sure, you want to move this blog to trash section"
                                onConfirm={() => {
                                  setBlogData([]), setTrashBlog(item._id);
                                }}
                                onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                              >
                                <span className="bg-[#46AED1]">
                                  <Icons
                                    string="delete"
                                    width="20px"
                                    height="20px"
                                  />
                                </span>
                              </Popconfirm>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {nextPageFetchLoader ? (
                  <div className="flex w-full justify-center">
                    <Icons string="loading" />
                  </div>
                ) : (
                  <></>
                )}
                <Pagination
                  pageSize={6}
                  align="center"
                  className="flex justify-center"
                  current={current}
                  onChange={onChange}
                  total={totalItems}
                />
              </>
            ) : (
              <div className="w-full text-center">
                You dont have Blogs. Create One !
              </div>
            )}
          </>
        ) : (
          <div className="flex w-full justify-center">
            <Icons string="loading" />
          </div>
        )}
      </div>
    </>
  );
};
