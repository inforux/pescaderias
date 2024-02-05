import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProduct, deleteProduct } from "../../services/ProductApi";
import { FaTrash } from 'react-icons/fa';

function DeleteProduct() {
  const [product, setProduct] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetchProduct(id);
        console.log("delete:  " + response.data);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getProduct();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteProduct(id);
      window.location.href = "/products";
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="md:border-2 md:border-gray-400 md:rounded p-5 mt-5 w-1/3 mx-auto">
      {product && (
        <div className="grid grid-cols-2 gap-4">
          <p className="font-bold">Nombre:</p>
          <p>{product.name}</p>
          <p className="font-bold">Código Balanza:</p>
          <p>{product.codigoBalanza}</p>
          <p className="font-bold">Stock:</p>
          <p>{product.stock}</p>
          <button 
            onClick={handleDelete} 
            className="bg-red-500 text-white rounded-md px-2 py-1 flex items-center justify-center col-span-2"
          >
            <FaTrash className="h-5 w-5 mr-2" />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

export default DeleteProduct;