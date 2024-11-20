"use client"

import React, { useEffect, useState, useRef } from "react";
import "react-quill/dist/quill.snow.css";
import Icons from "../Icons/Icons";
import axios from 'axios';
import ReactQuill from "react-quill";
import { useRouter } from "next/navigation";

const AddAmazonProducts = ({params = undefined}) => {
  const router = useRouter()
  const quillRef = useRef(null);
  const [discountOn, setDiscountOn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  const [deleteImageArr, setDeleteImageArr] = useState([]);
  const [fetchedImageArr, setFetchedImageArr] = useState([]);
  const [fetchData, setFetchData] = useState({});

  const [amazonProduct, setAmazonProduct] = useState({
    title: "",
    category: "Amazon Products",
    descriptions: "",
    price: "",
    discount: "",
    amazon_link: "",
    review: "",
    live: "true",
    imageurl: [],
  });

  // const { id } = useParams();
  const id = params ? params.productId : null

  //console.log("ID :", id);

  useEffect(() => {
    if (!!id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(
            `https://api.embarkyourcreativity.com/api/product_get/${id}`
          );
          console.log("Response Data Hard Copy :", response.data);
          const {
            title,
            category,
            descriptions,
            price,
            discount,
            amazon_link,
            review,
            live,
            images,
          } = response.data;
          let arr = [],
            array = [];
          images.forEach((v) => {
            arr.push(v.imageurl);
            array.push(v);
          });

          setFetchedImageArr(array);
          setFetchData(response.data);

          setAmazonProduct({
            title: title,
            category: category,
            descriptions: descriptions,
            price: price,
            discount: discount || "",
            amazon_link: amazon_link,
            review: review || "",
            live: live,
            imageurl: arr || [],
          });
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching product:", error);
          setIsLoading(false);
        }
      };
      fetchProduct();
    } else {
      setIsLoading(false);
    }
  }, [id]);

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

  console.log("Fetch Data : ", amazonProduct);

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
    // console.log("When Upload a images :", e.target.files);
    const files = Array.from(e.target.files);

    setAmazonProduct((prevData) => ({
      ...prevData,
      imageurl: [...prevData.imageurl, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    let array = [...deleteImageArr],
      arr = [...fetchedImageArr];
    array.push(fetchedImageArr[index].cloudinary_id);
    setDeleteImageArr(array);
    arr.splice(index, 1);
    setFetchedImageArr(arr);

    setAmazonProduct((prevData) => ({
      ...prevData,
      imageurl: prevData.imageurl.filter((_, i) => i !== index),
    }));
  };

  const handleSummit = async () => {
    if(amazonProduct.amazon_link && amazonProduct.price && amazonProduct.title && amazonProduct.imageurl){
      if(hardCopyProduct.amazon_link.includes('www.amazon')){
        let token = localStorage.getItem("logginId");
        const header = {
          headers: {
            Authorization: `Bearer ${token.split("--")[1]}`,
            "Content-Type": "multipart/form-data",
          },
        };
        setLoader(true);
        const formData = new FormData();
        formData.append("title", amazonProduct.title);
        formData.append("category", "Amazon Products");
        formData.append("descriptions", amazonProduct.descriptions);
        formData.append("price", amazonProduct.price);
        formData.append("live", "true");
        formData.append("discount", amazonProduct.discount);
        formData.append("amazon_link", amazonProduct.amazon_link);

        if (amazonProduct.imageurl && Array.isArray(amazonProduct.imageurl)) {
          amazonProduct.imageurl.forEach((imageFile) => {
            if (typeof imageFile !== "string") {
              formData.append("image", imageFile);
            }
          });
        }

        axios
          .put(
            `https://api.embarkyourcreativity.com/api/product_update/${id}`,
            { delete_image_ids: deleteImageArr },
            header
          )
          .then((res) => {
            console.log(res.data);
            setDeleteImageArr([]);
          })
          .catch((err) => {
            console.error(err);
          });

        try {
          if (id) {
            await axios.put(
              `https://api.embarkyourcreativity.com/api/product_update/${id}`,
              formData,
              header
            );
            setLoader(false);
            setFetchData({});
            router.push("/store/products");
          } else {
            await axios.post(
              "https://api.embarkyourcreativity.com/api/store_create",
              formData,
              header
            );
            setLoader(false);
            router.push("/store/products");
          }
        } catch (error) {
          setLoader(false);
          console.error("Error uploading product:", error);
        }
      } else {
        alert(`Can't Process because Amazon link is not correct. Must be amazon link included 'www.amazon....'`)
      }
    } else {
      alert('Please Fill all the required Field')
    }
  };

  const reactQuillDescription = (value) => {
    let obj = { ...amazonProduct };
    obj["descriptions"] = value;
    if (obj.imageurl.length === 0) {
      let arr = [];
      fetchedImageArr.forEach((v) => {
        arr.push(v.imageurl);
      });
      obj.imageurl = arr;
    }
    if (obj.title === "") {
      obj["title"] = fetchData.title;
    }
    setAmazonProduct(obj);
  };

  console.log("Hard Copy Product Details:", amazonProduct.imageurl);

  const onChangeInput = (e, key) => {
    setAmazonProduct({ ...amazonProduct, [key]: e.target.value });
  };
  return (
    <>
      <div className="flex justify-center items-center py-8">
        <div className="w-1/2 flex flex-col gap-y-5 items-start max-680:w-[90%]">
          <div className="flex flex-col w-full gap-y-[2px]">
            <div className="font-semibold text-[15px] flex gap-x-[4px]">Upload Cover Photo<span className="text-[red] h-auto">*</span></div>
            <div className="w-full flex gap-x-7 flex-col">
              <div className="w-[50px] h-[50px] relative">
                {/* <label htmlFor="sampleImage" className="cursor-pointer">
                  <Icons string="upload image" width="45px" height="45px" />
                </label> */}
                <input
                  id="sampleImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  // className="absolute top-0 invisible"
                  // style={{ display: "none" }}
                />
              </div>

              {amazonProduct.imageurl.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {amazonProduct.imageurl.map((file, index) => (
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
              value={amazonProduct.title}
              onChange={(e) => onChangeInput(e, "title")}
            />
          </div>

          <div className="flex flex-col w-full gap-y-2">
            <div className="text-base font-semibold font-small flex items-center gap-x-[4px]"><span className="text-black">Enter Description </span></div>
            <ReactQuill
              ref={quillRef}
              theme="snow"
              className="w-full"
              value={amazonProduct.descriptions}
              onChange={(e) => reactQuillDescription(e)}
            />
          </div>

          <div className="flex gap-x-2 w-full justify-between">
            <div className="flex gap-x-2 w-1/2 items-center bg-white px-3 py-2 border-1-616060">
              <Icons string="bookPrice" />
              <input
                type="number"
                placeholder="Enter Price (Required)"
                inputMode="numeric"
                className="border-0 outline-0"
                value={amazonProduct.price}
                onChange={(e) => onChangeInput(e, "price")}
              />
            </div>
            {discountOn ? (
              <div className="flex gap-x-2 w-[40%] items-center">
                <div className="flex gap-x-2 w-[80%] items-center bg-white px-3 py-2 border-1-616060">
                  <Icons string="percentage" />
                  <input
                    type="number"
                    placeholder="Any Discount"
                    className="w-full border-0 outline-0"
                    value={amazonProduct.discount}
                    onChange={(e) => onChangeInput(e, "discount")}
                  />
                </div>
                <span onClick={() => setDiscountOn(!discountOn)}>
                  <Icons string="cros" />
                </span>
              </div>
            ) : (
              <div
                className="py-2 px-4 text-white bg-red-700 select-none cursor-pointer font-small"
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
              placeholder="Enter Amazon Link (Required)"
              value={amazonProduct.amazon_link}
              onChange={(e) => onChangeInput(e, "amazon_link")}
            />
          </div>
          <div
            className="px-4 bg-green-700 text-white font-medium flex gap-x-2 items-center text-lg h-[40px] font-small cursor-pointer"
            onClick={handleSummit}
          >
            Submit
            {loader ? (
              <img src="/images/loadingSpinner.gif" className="w-[16px]" />
            ) : (
              <div className="w-[20px] h-[20px] border-2 border-white rounded-full flex justify-center items-center">
                <Icons string="summit" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAmazonProducts;
