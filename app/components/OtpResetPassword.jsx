"use client"

import { Button, Form, Input } from 'antd'
import React, { useEffect } from 'react'
import Icons from '../Icons/Icons';
import Timer from "./Timer.jsx"

const OtpResetPassword = ({email, verifyOtp, loader, verifyEmail}) => {

    const [form] = Form.useForm();

    const onChange = (text) => {
        console.log('onChange:', text);
    };
    const sharedProps = {
        onChange,
    };

    const onFinish = (e) => {
        console.log(e);
        verifyOtp(e.otp)
    }

    const onFinishFailed = () => {
    };

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
                <h4 className="font-bold">Enter OTP to verify you are the owner of <span className='text-blue-500'>{email}</span></h4>
                <Form.Item
                    name="otp"
                    rules={[{required: true},{warningOnly: true}]}
                >
                    <Input.OTP length={6} {...sharedProps}/>
                </Form.Item>
                <div className="flex w-full gap-x-[15px] justify-start mt-[15px]">
                    <Button htmlType="button" onClick={onReset}>
                        Reset
                    </Button>
                    <Button type="primary" className='bg-green-700 flex gap-x-[10px] justify-center items-center' htmlType="submit">
                        Verify {loader ? <Icons string="loading" width="24px" height="24px" /> : <Icons string="verify" width="18px" height="18px" />}
                    </Button>
                    {/* <button className='py-[5px] px-[15px] font-medium bg-transparent border border-gray-400 border-solid' onClick={onReset}>
                        Reset
                    </button> */}
                    {/* <button className="bg-green-700 py-[5px] px-[10px] text-white font-medium flex gap-x-[10px] justify-center items-center">
                        Verify {loader ? <Icons string="loading" width="24px" height="24px" /> : <Icons string="verify" width="18px" height="18px" />}
                    </button> */}
                </div>
                <Timer verifyEmail={verifyEmail}/>
            </Form>
        </div>
    </>
  )
}

export default OtpResetPassword