import axios from "axios";

const baseURL = import.meta.env.VITE_AXIOS_BASE_URL;
const instance = axios.create({
  baseURL,
  withCredentials: true
});

console.log(baseURL);

export default instance;
