// import axios from 'axios';
// const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5001/api',withCredentials:true});
// export default api;


import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sehat-vault-fyp-1.onrender.com/api',
  withCredentials: true,
});

export default api;