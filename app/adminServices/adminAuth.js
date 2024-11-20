"use client"
import axios from "axios";

const baseURL = "https://api.embarkyourcreativity.com/api";

const instance = axios.create({
  baseURL,
  // withCredentials: true
});

export const adminLogin = async (payload) => {
  try {
    const response = await instance.post("/adminlogin", payload);
    return response;
  } catch (err) {
    return err;
  }
};

export const verifyAdminEmail = async (payload) => {
    try {
        const response = await instance.post('/adminfrogotpassowrd',payload);
        return response
    }
    catch (err) {
        return err
    }
}

export const verifyAdminOtp = async(payload) => {
    try {
        const response = await instance.post("/adminotpverify", payload)
        return response
    } catch (err) {
        return err
    }
}

export const newPasswordAdmin = async(payload) => {
    try {
        const response = await instance.post("/adminconfrompassword", payload)
        return response
    } catch (err) {
        return err
    }
}