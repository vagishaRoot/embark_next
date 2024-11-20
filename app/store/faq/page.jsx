"use client"

import { Card, Col, Row, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import Icons from "../../Icons/Icons";
import AdminNavbar from '@/app/components/AdminNavbar';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAllFaq } from '@/app/services/faqAPI';
import { deleteFaq } from '@/app/adminServices/FaqApi';

const AdminFaq = () => {

  const router = useRouter()
  const [allFaq, setAllFaq] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [deleteLoader, setDeleteLoader] = useState()

  useEffect(()=>{
    fetchAllFaq()
  },[])

  const fetchAllFaq = () => {
    getAllFaq()
    .then((res)=>{
      console.log(res.data);
      setAllFaq(res.data)
    })
    .catch((err)=>{
      console.error(err);
    })
  }

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

  useEffect(()=>{
      let selectedNavbar = document.querySelector(".faq-page");
      selectedNavbar.style.background = "#46aed1";
      selectedNavbar.style.color = "white";

      return () => {
      selectedNavbar.style.background = "transparent";
      selectedNavbar.style.color = "black";
      };
  },[])

  const deleteFaqById = (id, i) => {
    let token = localStorage.getItem('logginId')
    const header = {
      headers: {
        "Authorization": `Bearer ${token.split('--')[1]}`,
        "Content-Type": "multipart/form-data",
      },
    };
    setDeleteLoader(i)
    deleteFaq(id, header)
    .then((res)=>{
      console.log(res);
      setDeleteLoader(null)
      openNotification(res.data.message, true, 'success');
      fetchAllFaq()
    })
    .catch((err)=>{
      setDeleteLoader(null)
      console.error(err);
    })
  };

  const openNotification = (message, pauseOnHover, type) => {
    api[type]({
      message: message,
      duration: 4,
      showProgress: true,
      pauseOnHover,
    });
  };

  return (
    <>
    <AdminNavbar />
      {contextHolder}
      <div className='w-full flex justify-center my-[10px] mt-[10px]'>
          <div className="flex flex-col items-start w-[90%] gap-y-[10px]">
              <Link href="/store/faq/addfaq" className="py-[10px] px-[7px] border-solid border-2 border-[#46AED1] bg-[#46AED1] text-white">Add Question</Link>
              {allFaq.length 
                ? <Row gutter={16}>
                    {allFaq.map((v,i)=>
                      <Col span={8} key={i} className='my-[10px] w-[300px]'>
                          <Card title={v.questions} bordered={true} extra={
                              <div className='flex gap-x-[5px] pl-[10px]'>
                                  <Link href={`/store/faq/updatefaq/${v._id}`}>
                                      <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
                                  </Link>
                                  {deleteLoader === i 
                                    ? <Icons string="" width="30px" height="30px" />
                                    : <span onClick={()=>deleteFaqById(v._id,i)}>
                                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg"><path d="M7 4V2H17V4H22V6H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V6H2V4H7ZM6 6V20H18V6H6ZM9 9H11V17H9V9ZM13 9H15V17H13V9Z"></path></svg>
                                      </span>
                                  }
                              </div>
                          }>
                              {v.ans}
                          </Card>
                      </Col>
                    )}
                  </Row>
                : <div className="flex w-full justify-center">
                    <Icons string="loading" />
                  </div>
              }
              
          </div>
      </div>    
    </>
  )
}

export default AdminFaq