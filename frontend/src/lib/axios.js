// axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1", // ✅ your backend address
  withCredentials: true, // important for cookies/session
});
