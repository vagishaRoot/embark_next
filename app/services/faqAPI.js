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