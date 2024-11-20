"use client"

import React, { useEffect, useState } from "react";
import Icons from "../../Icons/Icons";

import { PieChart } from "react-minimal-pie-chart";
import { Avatar, Carousel, Rate } from "antd";
import { useRecoilState } from "recoil";
import { cookiesState } from "../../state/appAtom";
import Cookies from "js-cookie";
import { getDigitalProduct, getPhysicalProduct } from "../../adminServices/ShopApi";
import { getFreeImages } from "../../adminServices/FreeImageApi";
import { getBlogs } from "../../services/blogAPI";
import { getAllReviews } from "../../services/storeAPI";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/app/components/AdminNavbar";

const Dashboard = () => {
    const router = useRouter();
  const [freePages, setFreePages] = useState([]);
  const [digitalProduct, setDigitalProduct] = useState([]);
  const [digitalProductCount, setDigitalProductCount] = useState(0);
  const [hardCopyProductCount, setHardCopyProductCount] = useState(0);
  const [hardCopyProduct, setHardCopyProduct] = useState([]);
  const [imageCount, setImageCount] = useState(0);
  const [image, setImage] = useState([]);
  const [physicalLoader, setPhysicalLoader] = useState(false);
  const [digitalLoader, setDigitalLoader] = useState(false);
  const [fetchImageLoader, setFetchImageLoader] = useState(false)
  const [percentage, setPercentage] = useState({});
  const [greeting, setGreeting] = useState("");
  const [blogData, setBlogData] = useState([]);
  const [reviews, setReviews] = useState([]);

  const getHardCopyProduct = () => {
    setPhysicalLoader(true);
    getPhysicalProduct()
      .then((res) => {
        setPhysicalLoader(false);
        console.log(res);
        setHardCopyProduct(res.data.stores);
        setHardCopyProductCount(res.data.totalCount);
      })
      .catch((err) => {
        setPhysicalLoader(false);
        console.log(err);
      });
  };

  const getDigitalProducts = () => {
    setDigitalLoader(true);
    getDigitalProduct()
      .then((res) => {
        console.log(res);
        res.data.stores.sort(function (a, b) {
          if (a.review < b.review) return 1;
          if (a.review > b.review) return -1;
          return 0;
        });
        setDigitalProduct(res.data.stores);
        setDigitalProductCount(res.data.totalCount);
        setDigitalLoader(false);
      })
      .catch((err) => {
        setDigitalLoader(false);
        console.log(err);
      });
  };

  const fetchImage = () => {
    setFetchImageLoader(true)
    getFreeImages()
      .then((res) => {
        setFetchImageLoader(false)
        console.log("All iamages ", res);
        res.data.images.sort(function (a, b) {
          if (a.count < b.count) return 1;
          if (a.count > b.count) return -1;
          return 0;
        });
        setImageCount(res.data.totalCount);
        setImage(res.data.images);
      })
      .catch((err) => {
        setFetchImageLoader(false)
        console.error(err);
      });
  };

  const fetchData = (page = undefined) => {
    getBlogs(page)
      .then((response) => {
        // debugger
        response.data.blogs.sort(function (a, b) {
          if (a.views < b.views) return 1;
          if (a.views > b.views) return -1;
          return 0;
        });
        setBlogData(response.data.blogs);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getReviews = () => {
    getAllReviews()
    .then((res)=>{
      console.log("reviews:- ", res);
      setReviews(res.data)
    })
    .catch((err)=>{
      console.error(err);
    })
  }

  useEffect(() => {
    fetchImage();
    getDigitalProducts();
    getHardCopyProduct();
    fetchData();
    getReviews()
  }, []);

  useEffect(() => {
    console.log("digital product:- ", digitalProductCount);
    console.log("hard copy product:- ", hardCopyProductCount);
    console.log("image:- ", imageCount);
    let obj = {};
    let sum = digitalProductCount + hardCopyProductCount + imageCount;
    obj["digitalPercent"] = (digitalProductCount / sum) * 100;
    obj["hardCopyPercent"] = (hardCopyProductCount / sum) * 100;
    obj["imagePercent"] = (imageCount / sum) * 100;

    console.log("digitalPercent :-", obj);
    setPercentage(obj);
  }, [digitalProductCount, hardCopyProductCount, imageCount]);

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
    let selectedNavbar = document.querySelector(".dashboard-page");
    selectedNavbar.style.background = "#46aed1";
    selectedNavbar.style.color = "white";

    return () => {
      selectedNavbar.style.background = "transparent";
      selectedNavbar.style.color = "black";
    };
  }, []);

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hours = now.getHours();

      if (hours >= 0 && hours < 12) {
        setGreeting("Good morning");
      } else if (hours >= 12 && hours < 17) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
    };

    updateGreeting(); // Initial greeting

    // Update greeting every hour
    const intervalId = setInterval(updateGreeting, 60 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const contentStyle = {
    margin: 0,
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  const carouselCount = Math.ceil(image.length / 3);

  return (
    <>
    <AdminNavbar/>
      <div className="flex justify-center w-full mt-10">
        <div className=" flex gap-10    justify-center w-[80%] 1440-1024:w-[99%] max-1024:flex-wrap">
          <div className=" bg-[#FFA585]   w-[40%]  rounded-xl h-[200px] max-1024:w-[80%] 768-650:w-[600px] max-650:w-[300px]">
            <div className="flex flex-col justify-center w-full h-full items-center gap-y-[10px] ">
              <div className=" text-2xl font-bold text-center">
                Welcome Admin
              </div>
              <div className=" text-2xl font-bold text-center">{greeting}</div>
            </div>
          </div>
          <div className="  w-[60%] border-2 rounded-xl h-[200px] max-650:h-[400px] max-1024:w-[80%] 768-650:w-[600px] max-650:w-[300px]">
            <div className=" font-semibold text-4xl text-center mt-4">
              Uploads
            </div>
            <div className=" flex gap-10  w-full max-650:flex-wrap max-650:mt-[20px]">
              <div className="flex justify-center w-[70%] max-650:w-full">
                <div className="flex   gap-10  items-center w-[90%] ">
                  <div className="w-[30%] ">
                    {digitalLoader ? (
                      <Icons string="loading" width="30px" height="30px" />
                    ) : (
                      <h1 className=" text-3xl font-semibold">
                        {!!percentage.digitalPercent
                          ? `${parseFloat(percentage.digitalPercent).toFixed(
                              0
                            )}%`
                          : ""}
                      </h1>
                    )}
                    <p>Digital Products</p>
                  </div>
                  <div className="w-[30%] ">
                  {physicalLoader 
                    ? <Icons string="loading" width="30px" height="30px" />
                    : <h1 className=" text-3xl font-semibold">
                        {!!percentage.hardCopyPercent
                          ? `${parseFloat(percentage.hardCopyPercent).toFixed(
                              0
                            )}%`
                          : ""}
                      </h1>
                  }
                    <p>Physical Product</p>
                  </div>
                  <div className="w-[30%] ">
                  {fetchImageLoader 
                    ? <Icons string="loading" width="30px" height="30px" />
                    :  <h1 className=" text-3xl font-semibold">
                        {!!percentage.imagePercent
                          ? `${parseFloat(percentage.imagePercent).toFixed(0)}%`
                          : ""}
                      </h1>
                  }
                    <p>Free Pages</p>
                  </div>
                </div>
              </div>
              <div className=" w-[20%] text-center max-650:w-full">
                <PieChart
                  className="h-[130px] max-650:h-[150px]"
                  radius={PieChart.radius}
                  segmentsStyle={{
                    transition: "stroke .3s",
                    cursor: "pointer",
                  }}
                  segmentsShift={(index) => (1)}
                  data={[
                    {
                      title: "Digital Product",
                      value: digitalProduct.length,
                      color: "#E38627",
                    },
                    {
                      title: "Hard copy Product",
                      value: hardCopyProduct.length,
                      color: "#C13C37",
                    },
                    {
                      title: "Free Image",
                      value: image.length,
                      color: "#6A2135",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" flex justify-center w-full mt-10 my-10 ">
        <div className=" flex gap-5 justify-center w-[80%] 1440-1024:w-[99%]  max-1024:flex-wrap">
          <div className=" border-2 rounded-xl w-[50%] h-[410px] overflow-y-auto max-1024:w-[80%] 768-650:w-[600px] max-650:w-[300px]">
            <div className=" flex justify-center w-full">
              <div className="w-[90%] 1440-1024:w-[99%]">
                <div className=" flex justify-between w-full py-[20px]">
                  <div className=" font-bold text-xl ">Top Products(as per ratings)</div>
                  <Link href="/store/products" className="text-sky-500 underline underline-offset-2">More{">>"}</Link>
                </div>
                <table className="w-full">
                  <tr className="max-650:mb-[10px]">
                    <th className="text-left max-650:hidden"></th>
                    <th className="text-left">Name</th>
                    <th className="text-left">Ratings</th>
                    <th className="text-left">Price</th>
                  </tr>
                  {digitalProduct.map((item, idx) => (
                    <tr key={item._id} className="max-650:border max-650:border-black">
                      <td className="max-650:hidden">
                        <img
                          src={item.images[0].imageurl}
                          alt="prodct"
                          className=" w-[100px] h-[100px] object-cover"
                        />
                      </td>
                      <td>{item.title}</td>
                      <td className="max-650:border-r max-650:border-black">{item.review}</td>
                      <td className="">
                        $
                        {!!item.discount
                          ? parseFloat(
                              parseFloat(item.price) -
                                (parseFloat(item.price) * item.discount) / 100
                            ).toFixed(2)
                          : item.price}
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          </div>
          <div className=" border-2 rounded-xl w-[50%] h-[410px] overflow-y-auto max-1024:w-[80%] 768-650:w-[600px] max-650:w-[300px]">
            <div className=" flex justify-center w-full ">
              <div className=" w-[90%] 1440-1024:w-[99%]">
                <div className=" flex justify-center w-full">
                  <div className=" flex justify-between items-center w-full my-4 ">
                    <div className=" font-bold text-xl ">Top Blogs(as per views)</div>
                    <Link href="/store/blogs" className="text-sky-500 underline underline-offset-2">More{">>"}</Link>
                  </div>
                </div>
                <table className="w-full">
                  <tr className="mb-[10px]">
                    <th className="text-left max-650:hidden"></th>
                    <th className="text-left">Title</th>
                    <th className="text-left">Views</th>
                  </tr>
                  {blogData.map((item, idx) => (
                    <tr key={item.id} className="py-[10px] max-650:border max-650:border-black">
                      <td className="max-650:hidden">
                        <img
                          src={item.imageurl}
                          alt="prodct"
                          className="object-cover w-[100px] h-[100px] "
                        />
                      </td>

                      <td className="text-left max-650:border-r max-650:border-black max-650:p-2">{item.title}</td>
                      <td className=" text-left max-650:p-2">{item.views}</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full mt-10 my-10">
        <div className=" flex gap-5 justify-center w-[80%] 1440-1024:w-[99%] max-1024:flex-wrap">
          <div className=" border-2 rounded-xl w-[50%] max-1024:w-[80%] 768-650:w-[600px] max-650:w-[300px]">
            <div>
              <div className="px-[20px]">
                <div className="flex w-full justify-center">
                  <div className="flex justify-between w-[90%] py-[20px]">
                    <div className=" font-bold text-xl">Top Free pages(as per downloads)</div>
                  </div>
                  <Link href="/store/freepage" className="py-[20px] text-sky-500 underline underline-offset-2">More {'>>'}</Link>
                </div>
                {image.length ? (
                  <Carousel arrows infinite={false}>
                    {Array.from({ length: carouselCount }).map((item, idx) => (
                      <div key={idx}>
                        <div className=" felx justify-center w-full ">
                          <div className=" flex gap-4  ">
                            {image.slice(3 * idx, 3 * idx + 3).map((v, i) => (
                              <img
                                key={i}
                                src={v.url}
                                alt="free picks"
                                className=" w-[33%] max-h-[317px] "
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className=" border-2 rounded-xl w-[50%] h-[385px] flex flex-col p-[20px] gap-y-[20px] max-1024:w-[80%] 768-650:w-[600px] max-650:w-[300px] overflow-auto">
            <div className="text-2xl">All Reviews</div>
            <div className="flex gap-x-[15px] overflow-x-auto">
              {reviews.map((v,i)=>
                <div key={i} className={`py-[20px] h-full rounded-lg flex flex-col min-w-[200px] items-center gap-y-[15px] ${i % 2 === 0 ? 'bg-[#FFA585]' : 'bg-[#46AED1]'}`}>
                  <Avatar>{v.name.slice(0,1).toUpperCase()}</Avatar>
                  <div className="text-lg font-bold">{v.name}</div>
                  <div className="text-gray-600">{new Date(v.createdAt).toDateString()}</div>
                  <div className=""><Rate disabled defaultValue={v.rating} /></div>
                  <div className="capitalize">{v.comment}</div>
                </div> 
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function Carousels(props) {
  const { photos, index } = props;
  const start = index * 3;
  const end = start + 3;

  return (
    <div className="carousel">
      {photos.slice(start, end).map((photo, i) => (
        <img key={i} src={photo.url} alt={`Photo ${i + 1}`} />
      ))}
    </div>
  );
}

export default Dashboard;
