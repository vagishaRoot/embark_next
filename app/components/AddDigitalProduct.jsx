"use client"

import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Icons from "../Icons/Icons";
import axios from 'axios';
import { useRouter } from "next/navigation";

const AddDigitalProduct = ({params = undefined}) => {

  const quillRef = useRef(null);
  const router = useRouter();
  const [loader, setLoader] = useState(false)
  const [discountOn, setDiscountOn] = useState(false);
  const [deleteImageArr, setDeleteImageArr] = useState([])

  const [digitalData, setDigitalData] = useState({
    title: "",
    category: "Digital",
    descriptions: "",
    price: "",
    discount: "",
    digital_product_link: "",
    review: 5,
    live: "true",
    imageurl: [],
  });

  const [fetchedImageArr, setFetchedImageArr] = useState([])

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

  const id = params ? params.productId : null
  // const {id} = useParams()

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`https://api.embarkyourcreativity.com/api/product_get/${id}`);
          let arr = [], array = []
          const { title, category, descriptions, price, discount, digital_product_link, review, live, images } = response.data;
          images.forEach((v)=>{
            arr.push(v.imageurl)
            array.push(v)
          })
          setDigitalData({
            title: title || "",
            category: category || "Digital",
            descriptions: descriptions || "",
            price: price || "",
            discount: discount || "",
            digital_product_link: digital_product_link || "",
            review: review || 5,
            live: live || "true",
            imageurl: arr || [],
          });
          setFetchedImageArr(array)
          //  setIsLoading(false); // Set loading to false after data is fetched
        } catch (error) {
          console.error('Error fetching product:', error);
          //setIsLoading(false); // Set loading to false in case of error
        }
      };
      fetchProduct();
    } else {
      // setIsLoading(false); // Set loading to false if no id
    }
  }, [params, id]);

  const reactQuillDescription = (value) => {
    setDigitalData({
      ...digitalData,
      descriptions: value
    });
  };

  // useEffect(() => {
  //   let selectedNavbar = document.querySelector(".store-page");
  //   selectedNavbar.style.background = "#46aed1";
  //   selectedNavbar.style.color = "white";

  //   return () => {
  //     selectedNavbar.style.background = "transparent";
  //     selectedNavbar.style.color = "black";
  //   };
  // }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setDigitalData((prevData) => ({
      ...prevData,
      imageurl: [...prevData.imageurl, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    let array = [...deleteImageArr], arr = [...fetchedImageArr]
    console.log(digitalData)
    array.push(fetchedImageArr[index].cloudinary_id);
    setDeleteImageArr(array)
    arr.splice(index, 1)
    setFetchedImageArr(arr)
    setDigitalData((prevData) => ({
      ...prevData,
      imageurl: prevData.imageurl.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if(digitalData.digital_product_link && digitalData.price && digitalData.title && digitalData.imageurl){
      if(digitalData.digital_product_link.includes('drive.google.com')){
        setLoader(true)
        let token = localStorage.getItem('logginId')
        const header = {
          headers: {
            "Authorization": `Bearer ${token.split('--')[1]}`,
            "Content-Type": "multipart/form-data",
          },
        };
        const formData = new FormData();
        formData.append('title', digitalData.title);
        formData.append('category', "Digital");
        formData.append('descriptions', digitalData.descriptions);
        formData.append('price', digitalData.price);
        formData.append('live', "true");
        formData.append('review', 5);
        formData.append('discount', digitalData.discount);
        formData.append('digital_product_link', digitalData.digital_product_link);
        

        if (digitalData.imageurl && Array.isArray(digitalData.imageurl)) {
          digitalData.imageurl.forEach((imageFile, index) => {
            if (typeof imageFile.imageurl !== "string") {
              formData.append('image', imageFile);
            }
          });
        }
        if(id && deleteImageArr.length > 0){
          console.log(deleteImageArr);
          // debugger
          axios.put(`https://api.embarkyourcreativity.com/api/product_update/${id}`, {"delete_image_ids" : deleteImageArr}, header)
            .then((res)=>{
              console.log(res.data);
              setDeleteImageArr([])
            })
            .catch((err)=>{
              console.error(err);
            })
        }

        try {
          if (id) {
            const response = await axios.put(`https://api.embarkyourcreativity.com/api/product_update/${id}`, formData, header);
            console.log("Product Updated:", response);
            router.push('/store/products');
            setLoader(false)
          } else {
            const response = await axios.post('https://api.embarkyourcreativity.com/api/store_create', formData, header);
            console.log("Product Created:", response);
            setLoader(false)
            router.push('/store/products');
          }
        } catch (error) {
          setLoader(false)
          console.error('Error uploading product:', error);
        }
      } else {
        alert(`Can't Process because Digital link is not correct. Must be drive link included 'drive.google.com'`)
      }
    } else {
      alert('Please Fill all the required Field')
    }
  };

  const onChangeInput = (e, key) => {
    setDigitalData({ ...digitalData, [key]: e.target.value });
  }

  // if (isLoading) {
  //   return <div>Loading...</div>; // Show loading indicator while data is being fetched
  // }

  return (
    <>
      <div className="flex justify-center items-center py-8">
        <div className="w-1/2 flex flex-col gap-y-5 items-start max-680:w-[95%]">
          <div className="flex flex-col w-full gap-y-[2px]">
            <div className="font-semibold text-[15px] flex gap-x-[4px]">Upload Cover Photo<span className="text-[red] text-base">*</span></div>
            <div className="w-full flex gap-x-7">
              <div className="w-[50px] h-[50px] relative">
                <label htmlFor="sampleImage" className="cursor-pointer">
                  <Icons string="upload image" width="45px" height="45px" />
                </label>
                <input
                  id="sampleImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </div>

              {digitalData.imageurl.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {digitalData.imageurl.map((file, index) => (
                    <div key={index} className="relative flex gap-4">
                      {typeof file === "string" ? (
                        <img
                          src={file}
                          alt="Uploaded"
                          className="w-[100px] h-[100px] object-cover"
                        />
                      ) : (
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Uploaded"
                          className="w-[100px] h-[100px] object-cover"
                        />
                      )}
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                      >
                        <Icons string="cros" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-x-3 w-1/2 items-center bg-white px-3 py-1 border-1-616060 max-680:w-[90%]">
            <Icons string="bookTitle" />
            <span className="border-r" />
            <input
              type="text"
              className="h-[30px] w-full bg-transparent border-0 outline-0"
              placeholder="Enter Book Title (Required)"
              value={digitalData.title}
              onChange={(e) => onChangeInput(e, 'title')}
            />
          </div>

          <div className="flex flex-col w-full gap-y-2">
            <div className="text-base font-semibold font-small flex items-center gap-x-[4px]">Enter Description</div>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              className="w-full"
              value={digitalData.descriptions}
              onChange={(e) => reactQuillDescription(e)}
            />
          </div>

          <div className="flex gap-x-2 w-full justify-between">
            <div className="flex gap-x-2 w-1/2 items-center bg-white px-3 py-1 border border-gray-600">
              <Icons string="bookPrice" />
              <input
                type="number"
                placeholder="Enter Price (Required)"
                inputMode="numeric"
                className="border-0 outline-0"
                value={digitalData.price}
                onChange={(e) => setDigitalData({ ...digitalData, price: e.target.value })}
              />
            </div>
            {discountOn ? (
              <div className="flex gap-x-2 w-[40%] items-center">
                <div className="flex gap-x-2 w-[80%] items-center bg-white px-3 py-1 border border-gray-600">
                  <Icons string="percentage" />
                  <input
                    type="number"
                    placeholder="Any Discount"
                    className="w-full border-0 outline-0"
                    value={digitalData.discount}
                    onChange={(e) => setDigitalData({ ...digitalData, discount: e.target.value })}
                  />
                </div>
                <span onClick={() => setDiscountOn(!discountOn)}>
                  <Icons string="cros" />
                </span>
              </div>
            ) : (
              <div
                className="py-1 px-2 text-white bg-red-700 font-small select-none cursor-pointer text-lg h-[40px]"
                onClick={() => setDiscountOn(!discountOn)}
              >
                Any Discount?
              </div>
            )}
          </div>

          <div className="flex gap-x-3 items-center bg-white px-3 py-1 border-1-616060 w-full">
            <Icons string="urlLink" />
            <span className="border-r" />
            <input
              type="url"
              className="h-[30px] w-full bg-transparent border-0 outline-0"
              placeholder="Enter Digital Product Link (Required)"
              value={digitalData.digital_product_link}
              onChange={(e) => setDigitalData({ ...digitalData, digital_product_link: e.target.value })}
            />
          </div>

          

          <div className="px-4 bg-green-700 text-white font-medium flex gap-x-2 items-center text-lg h-[40px] font-small cursor-pointer" onClick={() => loader ? {} :handleSubmit()}>
            Submit
            {loader ? <img src="/images/loadingSpinner.gif" className="w-[16px]" /> 
            :<div className="w-[20px] h-[20px] border-2 border-white rounded-full flex justify-center items-center">
              <Icons string="summit" />
            </div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDigitalProduct;
