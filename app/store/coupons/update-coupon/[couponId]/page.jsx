"use client"

import React, { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, notification } from "antd";
import { addCoupon, getByIdCoupon, updateCoupons } from "@/app/services/coupon";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AddCoupons = ({params}) => {
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState(false);
  const [initialLoader, setInitialLoader] = useState(false);
  const [form] = Form.useForm();

  const id = params.couponId

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
    if (id) {
      setInitialLoader(true);
      getByIdCoupon(id)
        .then((res) => {
          console.log(res);
          setInitialLoader(false);
          if (res.response === undefined) {
            let { coupon, percentage, user_email } = res.data.coupon;
            form.setFieldsValue({
              coupon,
              percentage,
              user_email,
            });
          }
        })
        .catch((err) => {
          setInitialLoader(false);
          console.log(err);
        });
    }
  }, [id]);

  const openNotification = (message, pauseOnHover, type) => {
    api[type]({
      message,
      duration: 4,
      showProgress: true,
      pauseOnHover,
      placement: "topRight",
    });
  };

  const onFinish = (e) => {
    setLoader(true);
    console.log(e);
    let token = localStorage.getItem("logginId");
    const header = {
      headers: {
        Authorization: `Bearer ${token.split("--")[1]}`,
        // "Content-Type": "multipart/form-data",
      },
    };
    if (id) {
      updateCoupons(id, e, header)
        .then((res) => {
          console.log(res);
          setLoader(false);
          openNotification(res.data.message, true, "success");
          form.resetFields();
          setTimeout(() => {
            router.push("/store/coupons");
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          setLoader(false);
        });
    } else {
      addCoupon(e, header)
        .then((res) => {
          console.log(res);
          setLoader(false);
          openNotification(res.data.message, true, "success");
          form.resetFields();
          setTimeout(() => {
            router.push("/store/coupons");
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          setLoader(false);
        });
    }
  };

  return (
    <div className="text-center py-4 flex justify-center">
      {contextHolder}
      <div className="flex flex-col w-[90%] gap-y-5 items-start max-425:w-[95%]">
        <div className="w-full flex justify-start items-start">
          <Link
            href="/store/coupons"
            className="flex px-4 py-2 font-small cursor-pointer text-white bg-[#46AED1] items-center gap-x-2"
          >
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
            Back
          </Link>
        </div>
        {initialLoader ? (
          <div className="flex flex-col w-full items-center">
            <Icons string="loading" />
            <div className="text-3xl">Loading Data</div>
          </div>
        ) : (
          <div className="flex w-full justify-center">
            <Form
              form={form}
              name="basic"
              onFinish={onFinish}
              autoComplete="off"
              className="w-[80%] max-425:w-full"
            >
              <div className="flex gap-x-[30px] max-425:flex-col">
                <div className="flex flex-col items-start gap-y-1">
                  <div className="text-lg font-bold text-left">
                    Enter Coupon Name
                  </div>
                  <Form.Item
                    name="coupon"
                    rules={[
                      {
                        required: true,
                        message: "Please input your title!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Coupon Title"
                      className="h-[50px] w-[300px]"
                    />
                  </Form.Item>
                </div>
                <div className="flex flex-col items-start gap-y-1">
                  <div className="text-lg font-bold text-left">
                    Enter Coupon's Discount
                  </div>
                  <Form.Item
                    name="percentage"
                    rules={[
                      {
                        required: true,
                        message: "Please input your coupon's discount!",
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Only input number"
                      className="h-[50px] w-[300px] flex items-center"
                      suffix="%"
                    />
                  </Form.Item>
                </div>
                <div className="flex flex-col items-start gap-y-1">
                  <div className="text-lg font-bold text-left">
                    Enter User Registered Email
                  </div>
                  <Form.Item
                    name="user_email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your coupon's discount!",
                      },
                      {
                        type: "email",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Only input number"
                      className="h-[50px] w-[300px] flex items-center"
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="flex justify-start">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="rounded-none flex justify-center"
                >
                  Submit
                  {loader ? (
                    <Icons string="loading" width="24px" height="24px" />
                  ) : (
                    <Icons
                      color="white"
                      string="verify"
                      width="18px"
                      height="18px"
                    />
                  )}
                </Button>
              </div>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCoupons;