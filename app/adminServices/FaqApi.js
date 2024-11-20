"use client"

import axios from "axios";

const baseURL = "https://api.embarkyourcreativity.com/api";

const instance = axios.create({
  baseURL,
  // withCredentials: true
});


export const getAllFaq = async() => {
    try {
      const response = await instance.get("/faq")
      return response
    }
    catch (err) {
      return err;
    }
}

export const getFaqById = async(id) => {
    try {
      const response = await instance.get(`/faq/${id}`)
      return response
    }
    catch (err) {
      return err;
    }
}

export const postFaq = async(obj, header) => {
    try {
      const response = await instance.post("/faq", obj, header)
      return response
    }
    catch (err) {
      return err;
    }
}

export const deleteFaq = async(id, header) => {
    try {
      const response = await instance.delete(`/faq/${id}`, header)
      return response
    }
    catch (err) {
      return err;
    }
}

export const updateFaq = async(obj,id, header) => {
    try {
      const response = await instance.put(`/faq/${id}`, obj, header)
      return response
    }
    catch (err) {
      return err;
    }
}