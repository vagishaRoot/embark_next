"use client"

import axios from "axios";

const baseURL = "https://api.embarkyourcreativity.com";

const instance = axios.create({
  baseURL,
  // withCredentials: true
});

export const getDigitalProduct = async(page = undefined) => {
    try {
        const response = await instance.get(`/api/alldigitalproducts?page=${page || 1}`);
        return response
    } 
    catch (error) {
        return error
    }
}

export const getPhysicalProduct = async(page = undefined) => {
    try {
        const response = await instance.get(`/api/allhardcopproducts?page=${page || 1}`);
        return response
    } 
    catch (error) {
        return error
    }
}

export const getProduct = async() => {
    try {
        const response = await instance.get("/api/allproducts");
        return response
    } 
    catch (error) {
        return error
    }
}

export const deleteProduct = async (id, header = {}) => {
    try {
        const response = await instance.delete(`/api/product_delete/${id}`, header)
        return response
    }
    catch (error) {
        return error
    }
}

export const deleteBulk = async(obj, header = {}) => {
    try {
        const response = await instance.delete("/api/product_deletes", obj, header)
        return response
    } catch (error) {
        return error
    }
}
