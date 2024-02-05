import axios from 'axios';

export const fetchClientes = async () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  return await axios.get(process.env.REACT_APP_API_PESCADERIA + "/clients/clients");
};