import axios from 'axios';

export const fetchComprobantes = async () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  return await axios.get(process.env.REACT_APP_API_PESCADERIA + "/comprobante/comprobantes");
};

export const fetchFormasPago = async () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  return await axios.get(process.env.REACT_APP_API_PESCADERIA + "/fp/formaspago");
};

export const fetchVentas = async () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  return await axios.get(process.env.REACT_APP_API_PESCADERIA + "/out/salidas");
};

export const fetchVenta = async (id) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  return await axios.get(process.env.REACT_APP_API_PESCADERIA + "/out/salidas/"+id);
};

export const anularVenta = async (id) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  return await axios.put(process.env.REACT_APP_API_PESCADERIA + "/out/salidas/"+id);
};

export const newVenta = async (data) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  return await axios.post(process.env.REACT_APP_API_PESCADERIA + "/out/salidas", data);
};

export const fetchHistoricoVentas= async () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  return await axios.get(process.env.REACT_APP_API_PESCADERIA + "/out/salidas/historico");
};

export const fetchTop5= async () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  return await axios.get(process.env.REACT_APP_API_PESCADERIA + "/out/salidas/historico5top");
};


export const fetchStock10= async () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  return await axios.get(process.env.REACT_APP_API_PESCADERIA + "/out/salidas/stock10");
};

