import React, { useState, useEffect } from "react";
import { createProduct } from "../../services/ProductApi";
import axios from "axios";

function NewProduct() {
  const [name, setName] = useState("");
  const [codigoBalanza, setCodigoBalanza] = useState("");
  const [stock, setStok] = useState("");
  const [unidadMedida, setUnidadMedida] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [unidades, setUnidades] = useState([]);

  useEffect(() => {
    const fetchUnidades = async () => {
        try {
            const response = await axios.get(
                process.env.REACT_APP_API_PESCADERIA + "/um/unidades"
            );
            const unidades = response.data;
            setUnidades(unidades);
            if (unidades.length > 0) {
                setUnidadMedida(unidades[0]._id);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const token = sessionStorage.getItem("token");
    if (token) {
        axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        fetchUnidades();
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const product = { 
      name,
      codigoBalanza,
      stock,
      unidadMedida,
      precioVenta,
    };

    try {
      await createProduct(product); 
      window.location.href = "/products";
    } catch (error) {
      console.error(error);
    }
  }; 

    return (
      <div className="md:border-2 md:border-gray-400 md:rounded p-5 mt-5 w-1/3 mx-auto">
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-gray-700">Nombre:</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Código Balanza:</span>
          <input
            type="text"
            value={codigoBalanza}
            onChange={(e) => setCodigoBalanza(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Stock:</span>
          <input
            type="text"
            value={stock}
            onChange={(e) => setStok(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Unidad de Medida:</span>
          <select
            value={unidadMedida}
            onChange={(e) => setUnidadMedida(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            {unidades.map((unidad) => (
              <option key={unidad._id} value={unidad._id}>
                {unidad.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-gray-700">Precio de Venta:</span>
          <input
            type="text"
            value={precioVenta}
            onChange={(e) => setPrecioVenta(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </label>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md col-span-2">
          Crear Producto
        </button>
      </form>
    </div>
  );

}

export default NewProduct;
