"use client"

import { Button, Form, Input } from "antd";
import React from "react";
import Icons from "../Icons/Icons";

const NewPassword = ({loader, passwordReset}) => {
  const [form] = Form.useForm();
  const onFinish = (e) => {
    console.log(e);
    passwordReset(e);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinishFailed = () => {};
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
          <Form.Item
            name="password"
            label="Password"
            dependencies={["confirmPassword"]}
            rules={[
              {
                min: 8,
                max: 16,
              },
              { required: true },
              { warningOnly: true },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              {
                min: 8,
                message: "Please enter atleast 8 inputs",
              },
              { required: true },
              { warningOnly: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("This password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm your Password" />
          </Form.Item>
          <div className="flex w-full gap-x-[15px] justify-start mt-[15px]">
            <Button htmlType="button" onClick={onReset}>
                Reset
            </Button>
            <Button
                type="primary"
                className="bg-green-700 flex gap-x-[10px] justify-center items-center"
                htmlType="submit"
            >
                Verify {loader ? <Icons string="loading" width="24px" height="24px" /> : <Icons string="verify" width="18px" height="18px" />}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default NewPassword;
