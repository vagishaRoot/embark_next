"use client"

import axios from "axios";

const baseURL = "https://api.embarkyourcreativity.com";

const instance = axios.create({
  baseURL,
  // withCredentials: true
});

export const getDigitalProduct = async (page = undefined) => {
  try {
    const response = await instance.get(`/api/alldigitalproducts?page=${page || 1}`);
    return response;
  } catch (error) {
    return error;
  }
};
export const getHardCopyProduct = async (page = undefined) => {
  try {
    const response = await instance.get(`/api/allhardcopproducts?page=${page || 1}`);
    return response;
  } catch (error) {
    return error;
  }
};
export const getAmazonProduct = async (page = undefined) => {
  try {
    const response = await instance.get(`/api/allamazonproduct?page=${page || 1}`);
    return response;
  } catch (error) {
    return error;
  }
};
export const updateProductRatings = async (id, obj, header = {}) => {
  try{
    const response = await instance.put(`/api/product_update/${id}`,obj, header);
    return response
  }
  catch (error) {
    return error
  }
}

export const getStoreProduct = async() => {
  try {
    const response = await instance.get("/api/allproducts")
    return response
  } catch (error) {
    return error;
  }
}

export const addToCart = async(payload, header) => {
  try {
    const response = await instance.post("/api/addcart", payload, header);
    return response
  } catch (error) {
    return error;
  }
}

export const getCart = async(id, header) => {
  try {
    const response = await instance.get(`/api/allcart/${id}` , header)
    return response
  } catch (error) {
    return error;
  }
}

export const deleteProductCart = async(obj, header = {}) => {
  try {
    const response = await instance.post("/api/cartdelete", obj, header)
    return response
  } catch (error) {
    return error;
  }
}

export const postWishlist = async (obj, header = {}) => {
  try {
    const response = await instance.post("/api/addwhislist", obj, header)
    return response
  }
  catch (error) {
    return error
  }
}

export const removeFromWishlist = async (obj, header = {}) => {
  try {
    const response = await instance.post("/api/deleteproduct", obj, header)
    return response
  }
  catch (error) {
    return error
  }
}

export const getWishlist = async (id, header = {}) => {
  try {
    const response = await instance.get(`/api/allproduct/${id}`, header)
    return response
  }
  catch (error) {
    return error
  }
}

export const buyNowApi = async (obj, header) => {
  try {
    const response = await instance.post("/api/order", obj, header);
    return response
  }
  catch (error) {
    return error
  }
}

export const placedOrder = async (id, header) => {
  try {
    const response = await instance.get(`/api/getbyuserid/${id}`, header)
    return response
  }
  catch (error) {
    return error
  }
}

export const getReviewsById = async (id) => {
  try {
    const response = await instance.get(`/api/reviews/${id}`)
    return response
  }
  catch (error) {
    return error
  }
}

export const addReviews = async (obj, header = {}) => {
  try {
    const response = await instance.post(`/api/reviews`, obj, header)
    return response
  }
  catch (error) {
    return error
  }
}

export const getAllReviews = async() =>{
  try {
    const response = await instance.get("/api/reviews")
    return response
  } 
  catch(error) {
    return error
  }
}
