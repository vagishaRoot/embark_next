import axios from "axios";

const baseURL = "https://api.embarkyourcreativity.com";

const instance = axios.create({
  baseURL,
  // withCredentials: true
});

export const getFreePage = async (page = undefined) => {
  try {
    const res = await instance.get(`/api/images?page=${page || 1}`);
    return res;
  } catch (error) {
    console.log(error);
    return error;
    // const error = new Error()
  }
};

export const numberOfDownload = async (id) => {
  try {
    const res = await instance.put(`/api/updatecount/${id}`)
    return res;
  } catch (error) {
    console.log(error);
    return error;
    // const error = new Error()
  }
}