import axios from "axios";

const baseURL = "https://api.embarkyourcreativity.com/api";

const instance = axios.create({
  baseURL,
  // withCredentials: true
});

export const addCoupon = async (payload, header = {}) => {
    try {
        const response = await instance.post("/coupon", payload, header)
        return response
    } catch (error) {
        return error
    }
}

export const fetchCoupons = async (header = {}) => {
    try {
        const response = await instance.get("/coupon", header)
        return response
    } catch (error) {
        return error
    }
}

export const updateCoupons = async (id, payload,header = {}) => {
    try {
        const response = await instance.put(`/coupon/${id}`, payload, header)
        return response
    } catch (error) {
        return error
    }
}
export const deleteCoupons = async (id, header = {}) => {
    try {
        const response = await instance.delete(`/coupon/${id}`, header)
        return response
    } catch (error) {
        return error
    }
}

export const verifyCoupon = async(payload, header = {}) => {
    try {
        const response = await instance.post("/verify", payload, header)
        return response
    } catch (error) {
        return error
    }
}

export const getByIdCoupon = async(id) => {
    try {
        const response = await instance.get(`/coupon/${id}`)
        return response
    }  catch (error) {
        return error
    }
}