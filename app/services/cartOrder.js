import axios from "axios";

const baseURL = "https://api.embarkyourcreativity.com/api";

const instance = axios.create({
  baseURL,
  // withCredentials: true
});

export const getPrevOrder = async(id, header = {}) => {
    try {
        const response = await instance.get(`/get_order/${id}`, header)
        return response
    } catch (err) {
        return err
    }
}

export const sendEmail = async (payload, header = {}) => {
    try {
        const response = await instance.post("/send_user", payload, header)
        return response
    } catch (err) {
        return err
    }
}

export const payment = async (payload, header = {}) => {
    try {
        const response = await instance.post("/payments/payment", payload, header)
        return response
    } catch (err) {
        return err
    }
}