"use client"

import axios from "axios";

const baseURL = "https://api.embarkyourcreativity.com/api";

const instance = axios.create({
  baseURL,
  // withCredentials: true
});

export const addBlog = async (data, header) => {
  try {
    const response = await instance.post("/blog_create", data, header);
    return response
  }
  catch (error) {
    return error
  }
}

export const updateBlog = async (id, data, header) => {
  try {
    const response = await instance.put(`/blog_update/${id}`, data, header)
    return response
  }
  catch (error) {
    return error
  }
}