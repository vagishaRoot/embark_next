"use client"

import axios from "axios";

const baseURL = "https://api.embarkyourcreativity.com/api";

const instance = axios.create({
  baseURL,
  // withCredentials: true
});

export const getAllUsers = async() => {
    try {
        const response = await instance.get("/user_alluser")
        return response
    } catch(error){
        return error
    }
}

export const updateUsers = async(id, obj,header = {}) => {
    try {
        const response = await instance.put(`/user_update/${id}`, obj, header)
        return response
    } catch(error){
        return error
    }
}

export const searchByEmail = async(email, header) => {
    try {
        const response = await instance.get(`/user_search?email=${email}`, header)
        return response
    } catch(error){
        return error
    }
}