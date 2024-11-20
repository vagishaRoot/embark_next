"use client"

"use client"

import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Tabs } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AddDigitalProduct from "@/app/components/AddDigitalProduct";
import AddHardCopy from "@/app/components/AddHardCopy";
import AddAmazonProducts from "@/app/components/AddAmazonProducts";
import AdminNavbar from "@/app/components/AdminNavbar";

const AddStore = ({params}) => {
    console.log("params:- ", params)
  const category = params.productCategory
  const [tabDefaultKey, setTabDefaultKey] = useState(null)
  const router = useRouter()

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

  const reactQuillDescription = (e) => {
    console.log(e);
  };

  // const location = useLocation();
  // const id = location.state ? location.state.id : null;
  // console.log("Locations : ", location);

  const [items,setItems] = useState([
    {
      key: "1",
      label: "Digital Product",
      children: <AddDigitalProduct params={params}/>,
    },
    {
      key: "2",
      label: "Hard Copy Product",
      children: <AddHardCopy params={params} />,
    },
    {
      key: "3",
      label: "Amazon Products",
      children: <AddAmazonProducts params={params} />
    }
  ])

  useEffect(() => {
    let selectedNavbar = document.querySelector(".store-page");
    selectedNavbar.style.background = "#46aed1";
    selectedNavbar.style.color = "white";

    return () => {
      selectedNavbar.style.background = "transparent";
      selectedNavbar.style.color = "black";
    };
  }, []);

   console.log("Category : ",category);


  useEffect(() => {
    if (!!category) {
      // debugger
     
      const data = [...items]
      let defaultKey
      data.forEach((v,i) => {
        if (v.label.toLocaleLowerCase() === category.replaceAll('_', ' ')) {
          defaultKey = v.key
        } else {
          data[i]['disabled'] = true
        }
      })
      setItems(data)
      setTabDefaultKey(defaultKey)
    } else {
      setTabDefaultKey("1")
    }
  }, [category])

  const onChange = (key) => {
    console.log("Key ",key);
  };

  // console.log("tabDefaultKey:- ",tabDefaultKey);

  return (
    <>
     <AdminNavbar/>
      <div className="flex flex-col justify-center items-center py-8 gap-y-4 w-full">
        <div className="w-[90%] flex justify-start items-start">
          <Link href="/store/products" className="flex px-4 py-2 font-small cursor-pointer text-white bg-[#46AED1] items-center gap-x-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 44 44"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M42.8637 38.7613C43.3906 39.2889 43.6864 40.0041 43.6861 40.7497C43.6858 41.4953 43.3895 42.2102 42.8623 42.7375C42.3351 43.2647 41.6201 43.561 40.8746 43.5612C40.129 43.5615 39.4138 43.2657 38.8862 42.7388L20.1362 23.9888C19.6088 23.4614 19.3125 22.746 19.3125 22.0001C19.3125 21.2542 19.6088 20.5388 20.1362 20.0113L38.8862 1.26134C39.4138 0.734501 40.129 0.438704 40.8746 0.438965C41.6201 0.439226 42.3351 0.735525 42.8623 1.26273C43.3895 1.78994 43.6858 2.50492 43.6861 3.2505C43.6864 3.99609 43.3906 4.71127 42.8637 5.23885L26.1025 22.0001L42.8637 38.7613ZM7.35248 22.0001L24.1137 5.23885C24.6406 4.71127 24.9364 3.99609 24.9361 3.2505C24.9358 2.50492 24.6395 1.78994 24.1123 1.26273C23.5851 0.735525 22.8701 0.439226 22.1246 0.438965C21.379 0.438704 20.6638 0.734501 20.1362 1.26134L1.38622 20.0113C0.858798 20.5388 0.5625 21.2542 0.5625 22.0001C0.5625 22.746 0.858798 23.4614 1.38622 23.9888L20.1362 42.7388C20.6638 43.2657 21.379 43.5615 22.1246 43.5612C22.8701 43.561 23.5851 43.2647 24.1123 42.7375C24.6395 42.2102 24.9358 41.4953 24.9361 40.7497C24.9364 40.0041 24.6406 39.2889 24.1137 38.7613L7.35248 22.0001Z"
                fill="white"
              />
            </svg>
            Back to Store
          </Link>
        </div>
        {!!tabDefaultKey ?
          <Tabs
            defaultActiveKey={tabDefaultKey}
            items={items}
            onChange={onChange}
            className="w-[90%]"
          /> : <></>
        }
      </div>

    </>
  );
};

export default AddStore;
