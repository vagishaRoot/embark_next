"use client"

import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Icons from "../../../Icons/Icons";
import { notification } from "antd";
import { getBlog } from "../../../services/blogAPI";
import { addBlog, updateBlog } from "../../../adminServices/AdminBlog";
import { useRouter } from "next/navigation";
import Link from "next/link";


const Updateblog = ({params}) => {
  const [data, setData] = useState({
    title: "",
    descriptions: "",
    check: true,
    link: "",
    subtitle: "",
    imageurl: [],
  });
  const [updateData, setUpdateData] = useState({});

  console.log("updateData:- ", updateData);

  const [check, setCheck] = useState(false);
  const [imageUpdate, setImageUpdate] = useState(false);
  const [loader, setLoader] = useState(false);
  const [inputChange, setInputChange] = useState(false)


  const id = params.blogId;
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  useEffect(()=>{
    if(localStorage.getItem('logginId') === null){
      router.push('/store')
    } else {
      if(localStorage.getItem('loginTime') === null){
        router.push('/store')
      } else {
        let time = JSON.parse(localStorage.getItem('loginTime'))
        if(parseInt((new Date() - new Date(time)) / (1000 * 60 * 60)) > 23){
          localStorage.removeItem('loggedId')
          localStorage.removeItem('loginTime')
          router.push('/store')
        }
      }
    }
  },[])

  useEffect(() => {
    if (id) {
      setCheck(true);
      setImageUpdate(true);
      const fetchBlogData = () => {
        getBlog(id)
          .then((response) => {
            const { title, descriptions, imageurl, link, subtitle } = response.data;
            let obj = {
              title: title,
              descriptions: descriptions,
              link: link,
              subtitle: subtitle, // Make sure to match this with the state variable
              image: imageurl,
            };
            setUpdateData(obj);
          })
          .catch((error) => {
            console.error("Error fetching blog data:", error);
          });
      };
      fetchBlogData();
    }
  }, [id]);

  const handleImageUpload = (e) => {
    if (id) {
      setUpdateData({ ...updateData, image: e.target.files[0] });
    } else {
      setData({...data, image: e.target.files[0] });
    }
    setCheck(true);
    setImageUpdate(true);
  };

  const handleDescriptionChange = (value) => {
    if(inputChange){
      if (id) {
        let obj = {...updateData}
        obj['descriptions'] = value
        setUpdateData(obj)
      } else {
        setData({ ...data, descriptions: value });
      }
      inputChange === false && setInputChange(true)
    }
  };

  const handleSubmit = () => {
    setLoader(true)
    const formData = new FormData();
    let token = localStorage.getItem('logginId')
    const header = {
      headers: {
        "Authorization": `Bearer ${token.split('--')[1]}`,
        "Content-Type": "multipart/form-data",
      },
    };
    if (id) {
      console.log("updateData:- ", updateData);
      formData.append("title", updateData.title);
      formData.append("descriptions", updateData.descriptions);
      formData.append("link", updateData.link || "");
      formData.append("subtitle", updateData.subtitle || "");
      if (updateData.image && typeof updateData.image !== "string") {
        formData.append("image", updateData.image);
      }
      // Update existing blog post
      updateBlog(id, formData, header)
        .then((response) => {
          setLoader(false)
          openNotification("Blog updated", true, "success");
        })
        .catch((err) => {
          setLoader(false)
          console.log(err)
        });
      // console.log("Blog updated successfully:", response.data);
      setTimeout(() => {
        router.push("/store/blogs");
      }, 2000);
    } else {
      formData.append("title", data.title);
      formData.append("descriptions", data.descriptions);
      formData.append("link", data.link || "");
      formData.append("subtitle", data.subtitle || "");
      if (data.image && typeof data.image !== "string") {
        formData.append("image", data.image);
      }
      // Create new blog post
      addBlog(formData, header)
        .then((response) => {
          setLoader(false)
          openNotification("Blog added", true, "success");
          handleImageUpdate();
          setTimeout(()=>window.location.reload(),2000)
          // setData({
          //   title: "",
          //   descriptions: "",
          //   check: true,
          //   link: "",
          //   subtitle: "",
          //   imageurl: [],
          // });
          // setTimeout(() => {
          //   router.push("/store/blogs");
          // }, 2000);
        })
        .catch((err) => {
          setLoader(false)
          console.log(err)
        });

      //  console.log("New blog created successfully:", response.data);
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

  const handleImageUpdate = () => {
    setImageUpdate(false);
    setCheck(false);
  };

  const onChangeUpdate = (value,name) => {
    let obj = {...updateData}
    obj[name] = value
    setUpdateData(obj)
  }

  return (
    <>
      {contextHolder}
      <div className="bg-gray-100 ">
        <Link href="/store/blogs">
          <button className="  bg-[#46AED1] w-40 text-white font-bold text-xl h-12 mx-16 my-10 ">
            {" "}
            {"<"} Back to Blog{" "}
          </button>
        </Link>
      </div>
      <div className="w-full flex justify-center bg-gray-100 ">
        <div className="w-[75%] flex flex-col gap-y-4 items-start">
          {!imageUpdate && !check && (
            <div>
              <h1 className="font-bold text-lg mb-3">Upload Image</h1>
              <label htmlFor="sampleImage" className="cursor-pointer  ">
                <div className=" border-2 flex justify-center h-20 w-20 items-center  border-black">
                  <Icons string="upload" width="40px" height="40px" />
                </div>
              </label>
              <input
                id="sampleImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>
          )}

          {data.image && imageUpdate && (
            <div>
              <h1 className="font-bold text-lg mb-3">Image Uploaded</h1>
              <div className="flex">
                <div className=" border-2 border-black p-7 my-4 ">
                  <img
                    src={
                      typeof data.image === "string"
                        ? data.image
                        : URL.createObjectURL(data.image)
                    }
                    alt="Uploaded"
                    className="w-full h-auto max-h-[300px] "
                  />
                </div>
                <span onClick={handleImageUpdate}>
                  <Icons string="cros" />
                </span>
              </div>
            </div>
          )}
          {updateData.image && imageUpdate && (
            <div>
              <h1 className="font-bold text-lg mb-3">Image Uploaded</h1>
              <div className="flex">
                <div className=" border-2 border-black p-7 my-4 ">
                  <img
                    src={
                      typeof updateData.image === "string"
                        ? updateData.image
                        : URL.createObjectURL(updateData.image)
                    }
                    alt="Uploaded"
                    className="w-full h-auto max-h-[300px] "
                  />
                </div>
                <span onClick={handleImageUpdate}>
                  <Icons string="cros" />
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col w-full  mt-5">
            <div className="text-lg font-bold">Enter Title:-</div>
            <div className="w-full  my-3 border-2 border-black">
              <input
                type="text"
                placeholder="Enter Title"
                className="h-[40px] border-0 outline-0 w-full px-3  text-lg font-semibold"
                value={id ? updateData.title : data.title}
                onChange={(e) => id ? onChangeUpdate(e.target.value, 'title') : setData({ ...data, title: e.target.value })}
              />
            </div>
          </div>
          <div>
            <div className=" flex items-center gap-x-2">
              <div className="text-lg font-bold">Enter Link :-</div>
              <div className=" font-semibold opacity-60 text-base ">
                (this will be your top header link)
              </div>
            </div>
            <div className=" flex  gap-x-[30px] w-full max-680:flex-col max-680:items-start">
              <div className="w-1/2 my-3 border-2 border-black max-680:w-full">
                <input
                  type="url"
                  placeholder="Enter Text (this will show on link)"
                  className="h-[40px] border-0 outline-0 w-full px-3  text-lg font-semibold"
                  value={id ? updateData.link : data.link}
                  onChange={(e) => id ? onChangeUpdate(e.target.value, 'link') : setData({ ...data, link: e.target.value })}
                />
              </div>
              <div className="w-1/2 my-3 border-2 border-black max-680:w-full">
                <input
                  type="text"
                  placeholder="Enter Text for button"
                  className="h-[40px] border-0 outline-0 w-full px-3  text-lg font-semibold"
                  value={id ? updateData.subtitle : data.subtitle}
                  onChange={(e) => id ? onChangeUpdate(e.target.value, 'subtitle') : setData({ ...data, subtitle: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <div className="text-lg font-bold">Enter Description:-</div>
            <ReactQuill
              theme="snow"
              className="w-full h-[69vh] my-4"
              value={id ? updateData.descriptions : data.descriptions}
              onChange={(e)=>{setInputChange(true);handleDescriptionChange(e)}}
            />
          </div>
          <div className=" flex  gap-x-10 mb-10 mx-0">
            <div
              className="bg-green-700 py-4 text-xl rounded px-8 text-white font-semibold cursor-pointer flex gap-x-2 items-center"
              onClick={handleSubmit}
            >
              Submit
              {loader
              ? <img src="/images/loadingSpinner.gif" className="w-[16px]" />
              : <div className="w-[20px] h-[20px] border-2 border-white rounded-full flex justify-center items-center">
                  <Icons string="summit" />
                </div>}
            </div>
            <div
              className="bg-[#CC0000]  py-4 text-xl rounded px-8 text-white font-semibold cursor-pointer "
              onClick={() => {
                setData({
                  title: "",
                  descriptions: "",
                  check: true,
                  link: "",
                  subtitle: "",
                  imageurl: [],
                });
                handleImageUpdate();
              }}
            >
              Reset
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Updateblog;
