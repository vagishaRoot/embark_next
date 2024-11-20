"use client"

import axios from "axios";

const baseURL = "https://api.embarkyourcreativity.com";

const instance = axios.create({
  baseURL,
  // withCredentials: true
});

export const getBlogs = async (page) => {
  try {
    const response = await instance.get(`/api/allblogs?page=${page || 1}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const getIp = async () => {
  try {
    const response = await instance.get("https://api.ipify.org/?format=json")
    return response
  } catch (error) {
    return error
  }
}

export const getBlog  = async (id, obj={}) => {
  try {
    const response = await instance.post(`/api/blog_get/${id}`, obj)
    return response
  }
  catch(error){
    return error
  }
}

export const addBlog = async (data, header) => {
  try {
    const response = await instance.post("/api/blog_create", data, header);
    return response
  }
  catch (error) {
    return error
  }
}

export const updateBlog = async (id, data, header) => {
  try {
    const response = await instance.put(`/api/blog_update/${id}`, data, header)
    return response
  }
  catch (error) {
    return error
  }
}

export const getTrash = async(page = undefined) =>{
  try {
    const response = await instance.get(`/api/allblogstrash?page=${page || 1}`);
    return response
  } catch (error) {
    return error
  }
}
