"use client"

"use client"

import React, { useEffect, useState } from 'react'
import { notification } from 'antd';
import AdminNavbar from '@/app/components/AdminNavbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getFaqById, updateFaq } from '@/app/adminServices/FaqApi';

const AddFaq = ({params}) => {
  const router = useRouter()
  const id = params.faqId

  const [input, setInput] = useState({});
  const [api, contextHolder] = notification.useNotification();

  console.log(id);

  useEffect(()=>{
    getFaqById(id)
    .then((res)=>{
      console.log(res.data);
      let {ans, questions, link} = res.data
      let obj = {ans, questions, link}
      setInput(obj)
    })
    .catch((err)=>{
      console.error(err);
    })
  },[id])

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
  },[]);

  const update = () => {
    let token = localStorage.getItem('logginId')
    const header = {
      headers: {
        "Authorization": `Bearer ${token.split('--')[1]}`,
        // "Content-Type": "multipart/form-data",
      },
    };
    if(input.ans && input.questions){
      updateFaq(input, id, header)
      .then((res)=>{
        console.log(res);
        openNotification("Faq Updated Successfully", true, 'success')
        setTimeout(()=>{
          router.push('/store/faq')
        },3000)
      })
      .catch((err)=>{
        console.error(err);
      })
    } else {
      alert('Please enter both question and answer')
    }
  }

  const changeInputValue = ({name, value}) => {
    let obj = {...input}
    obj[name] = value
    setInput(obj)
  }

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
      <div className="flex justify-center">
          <div className="flex flex-col gap-y-[15px] w-[80%] items-start mt-[25px]">
              <Link href="/store/faq" className="py-[10px] px-[15px] bg-[#46AED1] text-white">Back to Faq Page</Link>
              <div className="flex flex-col w-full">
                  <label className='font-semibold text-lg' htmlFor='questions'>Question:</label>
                  <input id='questions' type="text" name="questions" className='w-full border border-gray-400 h-[45px] rounded-[10px] px-[10px] outline-0' onChange={(e)=>changeInputValue(e.target)} value={input.questions || ''}/>
              </div>
              <div className="flex flex-col w-full">
                  <label className='font-semibold text-lg' htmlFor='ans'>Answer:</label>
                  <textarea id="ans" cols="5" rows="10" name="ans" className='w-full border border-gray-400 rounded-[10px] p-[10px] outline-0' value={input.ans || ''} onChange={(e)=>changeInputValue(e.target)}></textarea>
              </div>
              <div className="flex flex-col w-full">
                  <label className='font-semibold text-lg' htmlFor='link'>Link:</label>
                  <div className="flex gap-x-[5px] items-center">
                    <input id='link' type="url" name="link" className='w-full border border-gray-400 h-[45px] rounded-[10px] px-[10px] outline-0' value={input.link || ''} onChange={(e)=>changeInputValue(e.target)}/>
                    <div className="text-gray-400">(Optional)</div>
                  </div>
              </div>
              <div className="w-full flex justify-center gap-x-[20px]">
                  <div className='py-[10px] px-[15px] bg-grey border border-black cursor-pointer flex items-center justify-center'>Reset</div>
                  <div className='py-[10px] px-[15px] bg-green-800 text-white cursor-pointer flex items-center justify-center' onClick={update}>Submit</div>
              </div>
          </div>
      </div>
    </>
  )
}

export default AddFaq