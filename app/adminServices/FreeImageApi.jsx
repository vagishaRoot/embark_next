"use client"

import axios from "axios";

const baseURL = "https://api.embarkyourcreativity.com/api";

const instance = axios.create({
  baseURL,
  // withCredentials: true
});

export const getFreeImages = async(page) => {
    try {
        const response = await instance.get(`/images?page=${page || 1}`)
        return response;
    } catch (error) {
        return error
    }
}
export const addFreeImages = async(payload, header) => {
    try {
        const response = await instance.post(`/upload_many_images`, payload, header)
        return response;
    } catch (error) {
        return error
    }
}

export const deleteImages = async(id, header) => {
    try {
        const response = await instance.delete(`/delete_image/${id}`, header);
        return response
    } catch (error) {
        return error
    }
}