import axios from 'axios';

export const fetchUnidades = async () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  return await axios.get(process.env.REACT_APP_API_PESCADERIA + "/um/unidades");
};

export const fetchProduct = async (id) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  return await axios.get(process.env.REACT_APP_API_PESCADERIA + `/products/products/${id}`);
};

export const updateProduct = async (id, product) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  return await axios.patch(process.env.REACT_APP_API_PESCADERIA + `/products/products/${id}`, product);
};

export const fetchProducts = async () => {
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  return await axios.get(process.env.REACT_APP_API_PESCADERIA + "/products/products");
};

export const deleteProduct = async (id) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    return await axios.delete(process.env.REACT_APP_API_PESCADERIA + `/products/products/${id}`);
};

export const createProduct = async (product) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  return await axios.post(process.env.REACT_APP_API_PESCADERIA + "/products/products", product);
};