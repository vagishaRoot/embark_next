"use client"

import React, { useEffect, useRef, useState } from "react";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Icons from "../../Icons/Icons";
import { Rate, notification } from "antd";
import {
  deleteBulk,
  deleteProduct,
  getDigitalProduct,
  getPhysicalProduct,
  getProduct,
} from "../../adminServices/ShopApi";
import { getAmazonProduct } from "../../services/storeAPI";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminNavbar from "@/app/components/AdminNavbar";

const Store = () => {
    const router = useRouter()
  const [check, setCheck] = useState(false);
  const [checkChecked, setCheckChecked] = useState("digital");
  const [storeData, setStoreData] = useState([]);
  const [deleteId, setDeleteID] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loader, setLoader] = useState(false)


  const nextPage = (page) => {  
    setCurrentPage(page)
    getCategoryWise(checkChecked, page)
    // fetchStoreData(page)
  }

  const fetchStoreData = (nextPage = undefined) => {
    getDigitalProduct(nextPage)
      .then((res) => {
        console.log(res);
        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getCategoryWise = (val, nextPage = undefined, deleteProduct = undefined) => {
    setLoader(true)
    
    if (val === "hard") {
      getPhysicalProduct(nextPage)
        .then((res) => {
          setLoader(false)
          console.log(res);
          if(!!deleteProduct){
            setStoreData(res.data.stores)
          } else {
            setStoreData([...storeData, ...res.data.stores]);
          }
          if(nextPage === undefined){
            setCurrentPage(1)
            setPagination(Array.from({ length: res.data.totalPages }, (_, index) => index + 1))
          }
        })
        .catch((err) => {
          setLoader(false)
          console.log(err);
        });
      } else if (val === "digital") {
        getDigitalProduct(nextPage)
        .then((res) => {
          setLoader(false)
          console.log(res);
          if(res.data.stores.length){
            // debugger
            if(!!deleteProduct){
              setStoreData(res.data.stores)
            } else {
              setStoreData([...storeData, ...res.data.stores]);
            }
            if(nextPage === undefined){
              setCurrentPage(1)
              setPagination(Array.from({ length: res.data.totalPages }, (_, index) => index + 1))
            }
          }
        })
        .catch((err) => {
          setLoader(false)
          console.log(err);
        });
    } else if(val === "AmazonProduct") {
        getAmazonProduct(nextPage)
        .then((res) => {
          setLoader(false)
          console.log(res);
          if(res.data.stores.length){
            // debugger
            if(!!deleteProduct){
              setStoreData(res.data.stores)
            } else {
              setStoreData([...storeData, ...res.data.stores]);
            }
            if(nextPage === undefined){
              setCurrentPage(1)
              setPagination(Array.from({ length: res.data.totalPages }, (_, index) => index + 1))
            }
          }
        })
        .catch((err) => {
          setLoader(false)
          console.log(err);
        });

    }
  }

  const changeCategory = (val, nextPage = undefined) => {
    console.log(val);
    setCheckChecked(val);
    if(nextPage === undefined){
      setStoreData([])
      setPagination([])
    }
  };

  useEffect(()=>{
    if(storeData.length == 0 && pagination == 0){
      getCategoryWise(checkChecked)
    }
  },[checkChecked,storeData,pagination])

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

    // window.addEventListener('scroll', handleScroll)
  }, []);

  // useEffect(() => {
  //   getCategoryWise(checkChecked)
  // }, []);

  useEffect(() => {
    let selectedNavbar = document.querySelector(".store-page");
    selectedNavbar.style.background = "#46aed1";
    selectedNavbar.style.color = "white";

    return () => {
      selectedNavbar.style.background = "transparent";
      selectedNavbar.style.color = "black";
    };
  }, []);

  const onChange = (id) => {
    setDeleteID((prevIds) => {
      if (prevIds.includes(id)) {
        // If ID is already in the array, remove it
        return prevIds.filter((item) => item !== id);
      } else {
        // Otherwise, add the ID to the array
        return [...prevIds, id];
      }
    });

    // Update the check state based on whether all items are checked or not
    let items = [...storeData];
    const allIds = items.map((item) => item._id);
    if (allIds.length === deleteId.length) {
      setCheck(true);
    } else {
      setCheck(false);
    }
  };

  const checkAll = () => {
    let items = [...storeData];
    const allIds = items.map((item) => item._id);
    // If all items are not already selected, select all; otherwise, deselect all
    if (deleteId.length === allIds.length) {
      setDeleteID([]);
      setCheck(false);
    } else {
      setDeleteID(allIds);
      setCheck(true);
    }
  };

  const handleDelete = async (id) => {
    //console.log("Id :", id);
    setDeleteLoading(id);
    const header = {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('logginId').split('--')[1]}`,
      },
    };
    deleteProduct(id, header)
      .then((res) => {
        console.log("delete product by id:- ", res);
        setDeleteLoading(null);
        openNotification(res.data.message, true, "success");
        setStoreData([])
        getCategoryWise(checkChecked, undefined , 'delete')
      })
      .catch((err) => {
        setDeleteLoading(null);
        console.log("error deleting product:- ", err);
      });
  };

  const handleUpdate = (id, category) => {
    // console.log("Id :", id);
    //  console.log("Category :", category);

    if (category === "Digital") {
      router.push(`/store/updateproducts/digital_product/${id}`);
    } else if (category === "Hard Copy") {
      router.push(`/store/updateproducts/hard_copy_product/${id}`);
    } else if (category === "Amazon Products") {
      router.push(`/store/updateproducts/amazon_products/${id}`);
    }
  };

  /* const handleManyProductDelete = () => {
    let obj = { data: { ids: deleteId } };
    setDeleteLoading(true);
    const header = {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('logginId').split('--')[1]}`,
      },
    };
    deleteBulk(obj, header)
      .then((res) => {
        console.log(res);
        setDeleteLoading(null);
        openNotification(res.data.message, true, "success");
        getCategoryWise(checkChecked, undefined , 'delete')
      })
      .catch((err) => {
        setDeleteLoading(null);
        console.log(err);
      });
  }; */

  const openNotification = (message, pauseOnHover, type) => {
    api[type]({
      message: message,
      duration: 4,
      showProgress: true,
      pauseOnHover,
    });
  };

  console.log(storeData)

  return (
    <>
     <AdminNavbar/>
      {contextHolder}
      <div className="flex flex-col w-full relative">
        <div className="flex flex-col w-full">
          <div className="flex w-full justify-center py-6 ">
            <div className="w-[90%] flex">
              <div className=" flex  items-center gap-5 ">
                <div className=" flex flex-col">
                  <Link
                    className="flex px-4 py-2 font-small cursor-pointer text-white bg-[#46AED1] items-center gap-x-2"
                    href="/store/addproducts"
                  >
                    <Icons string="add" width="30px" height="30px" />
                    Add Product
                  </Link>
                </div>
                {loader 
                ? <Icons string="loading" width="100px" />
                : <div className=" flex border-2">
                    <select
                      className="w-[220px] py-[9px] outline-0 max-425:w-[150px]"
                      value={checkChecked}
                      onChange={(e)=>changeCategory(e.target.value)}
                    >
                      <option value="hard">Hand Coloring Book</option>
                      <option value="digital">Digital Book</option>
                      <option value="AmazonProduct">Amazon Products</option>
                    </select>
                  </div>
                }
                {/* <div>
                  <button className="px-[10px] h-[45px] text-xl bg-[#46AED1] font-medium font-small cursor-pointer">
                    Filter
                  </button>
                </div> */}
                {/* <div className={`text-white px-[10px] h-[45px] flex justify-center items-center p-1 font-medium ${deleteId.length > 0 ? 'bg-[#C00000] cursor-pointer '

                  : 'bg-[#c0000057] cursor-not-allowed'} font-small`} title={!checkChecked ? "You haven't selected any row" : ''}>
                  Delete in Bulk
                </div> */}

                {/* <div className="text-white h-[45px] flex justify-center items-center font-medium ">
                  {deleteId.length > 0 ? (
                    <Popconfirm
                      title="Delete the Product"
                      description="Are you sure to delete all product ?"
                      onConfirm={() => {
                        handleManyProductDelete();
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <button className="bg-[#C00000] h-[46px] w-32 cursor-pointer flex justify-center items-center">
                        Delete in Bulk{" "}
                        {deleteLoading ? (
                          <Icons string="loading" width="30px" height="30px" />
                        ) : (
                          <></>
                        )}
                      </button>
                    </Popconfirm>
                  ) : (
                    <button className="bg-[#ffe6e6] h-[46px] cursor-not-allowed text-gray-400 w-32">
                      Delete in Bulk
                    </button>
                  )}
                </div> */}
              </div>
            </div>
          </div>

          <div className=" flex flex-col mt-[30px] max-991:overflow-x-auto" id="storeShopListing">
            <div className=" flex gap-4 justify-center w-[90%] mx-auto px-3 max-991:w-[1500px]">
              {/* <div
                className="w-[26px] h-[23px] border border-[#7a7a7a] rounded-full flex justify-center items-center"
                onClick={checkAll}
              >
                <div
                  className={`w-[15px] h-[15px] rounded-full ${
                    check ? "bg-blue-700" : "bg-transparent"
                  }`}
                ></div>
              </div> */}
              <h1 className="w-[28%] text-xl font-semibold flex justify-center">
                Image
              </h1>
              <h1 className="w-[20%] text-xl font-semibold flex justify-center">
                Title
              </h1>
              <h1 className="w-[10%] text-xl font-semibold  flex justify-center">
                Price
              </h1>
              <h1 className="w-[10%] text-xl font-semibold flex justify-center">
                Any Discount
              </h1>
              <h1 className="w-[10%] text-xl font-semibold flex justify-center">
                Link Available
              </h1>
              {checkChecked === 'digital' ? <h1 className="w-[10%] text-xl font-semibold flex justify-center">
                Ratings
              </h1> : <></>}
              {/* <h1 className="w-[10%] text-xl font-semibold flex justify-center">
                Live
              </h1> */}
              <h1 className="w-[10%] text-xl font-semibold flex justify-center">
                Change
              </h1>
            </div>

            <div className=" flex flex-col justify-center w-[90%] mx-auto max-991:w-[1500px] ">
              {loader === false 
              ? <>
                  {storeData.length ? storeData.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 my-4 justify-center border px-3 py-5 rounded"
                    >
                      {/* <div
                        className="w-[26px] h-[23px] border border-[#7a7a7a] rounded-full flex justify-center items-center"
                        onClick={() => onChange(item._id)}
                      >
                        <div
                          className={`w-[15px] h-[15px] rounded-full ${
                            deleteId.includes(item._id)
                              ? "bg-blue-700"
                              : "bg-transparent"
                          }`}
                        ></div>
                      </div> */}

                      <div className="w-[28%]  flex justify-center">
                        {/* <Image
                        width={200}
                        height={100}
                        src={item.imageurl}
                        className=" object-cover"
                      /> */}
                      
                      <img
                          className=" object-contain   w-[80%] h-40 "
                          src={item.images[0].imageurl}
                        />
                      </div>
                      <h1 className="w-[20%]  flex justify-center items-center">
                        {item.title}
                      </h1>
                      <h1 className="w-[10%]  flex justify-center items-center">
                        {item.price || <span className="text-white bg-red-700 p-[4px] black rounded">not mentioned</span>}
                      </h1>
                      <h1 className="w-[10%]  flex justify-center items-center">
                        {item.discount === null || item.discount === undefined
                          ? "Any Discount"
                          : item.discount}
                      </h1>
                      <h1 className="w-[10%] flex justify-center items-center truncate">
                        {item.amazon_link || item.digital_product_link ? <span className="text-white bg-blue-500 p-[4px] black rounded">Yes</span> : <span className="text-white bg-red-700 p-[4px] black rounded">No</span>}
                       {/*  {item.category === undefined || item.category === null
                          ? "Category"
                          : item.category} */}
                      </h1>
                      {checkChecked === 'digital' ?  <h1 className="w-[10%]  flex justify-center items-center">
                        <Rate
                          // defaultValue={item.review}
                          defaultValue={item.review}
                          // disabled
                          // defaultValue={ item.review
                          // Math.floor(
                          //   Math.random() * (Math.floor(5) - Math.ceil(1) + 1)
                          // ) + Math.ceil(1)
                          // }
                        />
                      </h1> : <></>}
                      <div className="w-[10%]  flex justify-center gap-x-5 items-center">
                        <span onClick={() => handleUpdate(item._id, item.category)}>
                          <Icons string="pen" width="30px" height="30px" />
                        </span>
                        {deleteLoading === item._id ? (
                          <Icons string="loading" width="30px" height="30px" />
                        ) : (
                          <span onClick={() => handleDelete(item._id)}>
                            <Icons string="delete" width="30px" height="30px" />
                          </span>
                        )}
                      </div>
                    </div>
                  )) : <div className="flex w-full justify-center py-[20px]"><div className="text-2xl font-bold">No Products Found</div></div>
                  }
                </>
              : <div className="w-full flex justify-center"><Icons string="loading" /></div>
              }
            </div>
          </div>
        </div>
        {pagination.length 
          ? <div className="w-full flex items-center justify-center gap-[2px]">
              {pagination.map((v,i)=>
                <div key={i} onClick={()=>currentPage >= v ? {} : nextPage(v)} className={`w-[50px] h-[50px] cursor-pointer border ${currentPage === v ? 'bg-blue-500 text-white border-blue-500' : currentPage > v ? 'bg-gray-200 text-gray-400 border-gray-400' : 'text-blue-500 border-blue-500'} flex justify-center items-center rounded`}>{v}</div>
              )}
              <div onClick={()=>currentPage === pagination[pagination.length - 1] ? {} : nextPage(currentPage + 1)} className={`w-[40px] h-[40px] ml-[5px] flex justify-center items-center rounded-[8px] ${currentPage === pagination[pagination.length - 1] ? 'bg-gray-200 text-gray-400 border-gray-400' : 'bg-blue-500 text-white border-blue-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-chevron-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                </svg>
              </div>
            </div>
          : <></>
        }
        
      </div>
    </>
  );
};

export default Store;
