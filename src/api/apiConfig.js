import axios from "axios";
import { server_uri } from "../config/variables";

const baseURL = `${server_uri}api/v1`;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
