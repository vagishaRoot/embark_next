"use client"

import React from 'react'
import Icons from '../Icons/Icons'
import { Button, Form, Input } from 'antd'
import { useRouter } from 'next/navigation';

const ResetPassword = ({verifyEmail, loader}) => {
    const [form] = Form.useForm();
    const router = useRouter()

    const onFinish = (e) => {
      if(e.email === 'embarkyourcreativity@gmail.com'){
        alert('You are redirecting to admin page for forget password. Press OK to continue')
        router.push('/store')
      } else{
        verifyEmail(e.email)
      }
    }

    const onFinishFailed = () => {}

    const onReset = () => {
        form.resetFields();
    };
    return (
        <>
            <div className="flex flex-col w-[300px] items-start gap-y-[15px]">
                <Form
                name="trigger"
                className="w-full"
                layout="vertical"
                autoComplete="off"
                size="large"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                >
                    <div className="font-bold">Verify your email address</div>
                    <Form.Item
                      // hasFeedback
                      
                      name="email"
                      rules={[
                        {
                          min: 3,
                        },
                        {
                          required: true,
                        },
                        {
                          warningOnly: true,
                        },
                      ]}
                    >
                      <Input placeholder="Email" type="email" suffix={false} className='w-full h-full px-[10px] py-[5px] outline-0 border border-solid border-gray-400'/>
                    </Form.Item>
                    {/* <input type="email"  value={emailInput} onChange={(e)=>setEmailInput(e.target.value)} /> */}
                    <div className="flex w-full gap-x-[15px] justify-start mt-[15px]">
                        <Button htmlType="button" onClick={onReset}>
                            Reset
                        </Button>
                        <Button type="primary" className='bg-green-700 flex gap-x-[10px] justify-center items-center' htmlType="submit">
                            Verify {loader ? <Icons string="loading" width="24px" height="24px" /> : <Icons string="verify" width="18px" height="18px" />}
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    )
}

export default ResetPassword