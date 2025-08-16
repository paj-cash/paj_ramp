import axios from "axios";

let baseUrl = `https://api-staging.paj.cash`;

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setBaseUrl = (url: string) => {
  baseUrl = url;
  api.defaults.baseURL = url;
}

export default api;
