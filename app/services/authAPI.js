"use client"

import axios from "axios";

const baseURL = "https://api.embarkyourcreativity.com";

const instance = axios.create({
  baseURL,
  // withCredentials: true
});
const header = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const signup = async (payload) => {
  try {
    const response = await instance.post("/api/user_sign", payload);
    return response;
  } catch (error) {
    return error;
  }
};

export const postOtp = async (payload) => {
  try {
    const response = await instance.post("/api/user_verify", payload);
    return response;
  } catch (err) {
    return err;
  }
};

export const login = async (payload) => {
  try {
    const response = await instance.post("/api/user_login", payload);
    return response;
  } catch (err) {
    return err;
  }
};

export const forgotPassword = async (payload) => {
  try {
    const response = await instance.post('/api/user_forgotpassword', payload);
    return response;
  } catch (err) {
    return err;
  }
}

export const otpVerifyForgotPassword = async(payload) => {
  try {
    const response = await instance.post("/api/user_forgotpassword_otpverify", payload);
    return response
  } catch (err) {
    return err;
  }
}

export const changePassword = async(payload) => {
  try {
    const response = await instance.post("/api/user_forgotpassword_newpassowrd", payload);
    return response
  } catch (err) {
    return err;
  }
}