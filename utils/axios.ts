import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-staging.paj.cash',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
