import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchUnidades, fetchProduct } from "../../services/ProductApi";
import { useParams } from "react-router-dom";
import { FaSave } from "react-icons/fa";
import "../../css/Edit.css"

function EditProduct() {
  const [product, setProduct] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const { id } = useParams();
  const [buttonText, setButtonText] = useState("Crear producto");

  useEffect(() => {
    const getUnidades = async () => {
      try {
        const response = await fetchUnidades();
        setUnidades(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getUnidades();
  }, []);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetchProduct(id);
        const productData = response.data;
        productData.unidadMedida = productData.unidadMedida._id;
        setProduct(productData);
      } catch (error) {
        console.error(error);
      }
    };

    getProduct();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setButtonText("Cargando...");

    try {
      await axios.patch(
        process.env.REACT_APP_API_PESCADERIA + `/products/products/${id}`,
        product
      );
      window.location.href = "/products";
    } catch (error) {
      console.error(error);
    }
  };

  if (!product) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="md:border-2 md:border-gray-400 md:rounded md:p-5 md:w-1/3 md:mt-5 mx-auto">
      <form onSubmit={handleSubmit} className="form-container">
        <label className="form-field block mb-2">
          Nombre:
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            className="mt-1 block w-full"
          />
        </label>
      <label className="form-field block mb-2">
        Código Balanza:
        <input
          type="text"
          value={product.codigoBalanza}
          onChange={(e) =>
            setProduct({ ...product, codigoBalanza: e.target.value })
          }
          className="mt-1 block w-full"
        />
      </label>
      <label className="form-field block mb-2">
  Precio de Venta:
  <input
    type="text"
    value={product.precioVenta}
    onChange={(e) =>
      setProduct({ ...product, precioVenta: e.target.value })
    }
    className="mt-1 block w-full"
  />
</label>
      <label className="form-field block mb-2">
        Stock:
        <input
          type="text"
          value={product.stock}
          onChange={(e) => setProduct({ ...product, stock: e.target.value })}
          className="mt-1 block w-full"
        />
      </label>
      <label className="form-field block mb-2">
        Unidad de Medida:
        <select
          value={product.unidadMedida}
          onChange={(e) =>
            setProduct({ ...product, unidadMedida: e.target.value })
          }
          className="mt-1 block w-full"
        >
          {unidades.map((unidad) => (
            <option key={unidad._id} value={unidad._id}>
              {unidad.name}
            </option>
          ))}
        </select>
      </label> 
        <button
          type="submit"
          className="w-full bg-orange-600 text-white flex items-center justify-center py-2 px-4 rounded"
        >
          <FaSave /> <span>{buttonText}</span> 
        </button>
      </form>
    </div>
  );
}

export default EditProduct;