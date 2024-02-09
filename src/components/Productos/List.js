import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts, fetchProduct } from '../../services/ProductApi'; 
import { FaEdit, FaTrash } from 'react-icons/fa'; 
import Modal from 'react-modal';

Modal.setAppElement('#root'); 

function List() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stockFilter, setStockFilter] = useState('Todos');
    const [priceFilter, setPriceFilter] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true); 


    const navigate = useNavigate();

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await fetchProducts(); 
                setProducts(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        getProducts();
    }, []);

    const handleStockFilterChange = (event) => {
        setStockFilter(event.target.value);
    };

    const handlePriceFilterChange = (event) => {
    setPriceFilter(event.target.value);
    };

    const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    };

    const handleProductClick = async (productId) => {
        try {
            const response = await fetchProduct(productId);
            setSelectedProduct(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (productId) => {
        navigate(`/products/edit/${productId}`);
    };

    const handleDelete = (productId) => {
        navigate(`/products/delete/${productId}`);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

return (
    <div>
        {isLoading ? (
            <div>Cargando...</div>
        ) : (
   <div>
        <div className="border border-gray-200 rounded-md p-4 mb-8 mt-4">
            <div className="flex items-center space-x-4">
                <div className="w-1/4">
                    <label htmlFor="filter1" className="block text-sm font-medium text-gray-700">Stock</label>
                    <select id="filter1" name="filter1" onChange={handleStockFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option>Todos</option>
                        <option>Entre 0-10</option>
                        <option>Entre 11-50</option>
                        <option>Mas de 50</option>
                    </select>
                </div>
                <div className="w-1/4">
                    <label htmlFor="filter2" className="block text-sm font-medium text-gray-700">Precio</label>
                    <select id="filter2" name="filter2" onChange={handlePriceFilterChange} className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                        <option>Todos</option>
                        <option>Entre 1-5</option>
                        <option>Entre 6-10</option>
                        <option>Mas de 10</option>
                    </select>
                </div>
                <div className="w-1/4">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700">Buscar</label>
                    <input type="text" name="search" id="search" onChange={handleSearchChange} className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                </div>
            </div>
        </div>

        <table className="table-auto w-full">
            <thead>
                <tr>
                    <th className="px-4 py-2 text-left">Nombre</th>
                    <th className="px-4 py-2 text-left">Código de Balanza</th>
                    <th className="px-4 py-2 text-left">Stock</th>
                    <th className="px-4 py-2 text-left">Precio de Venta</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Editar</th>
                    <th className="px-4 py-2 text-left">Eliminar</th>
                </tr>
            </thead>
            <tbody>
                {products.filter(product => {
                    let matchesStock = stockFilter === 'Todos' || (stockFilter === 'Entre 0-10' && product.stock >= 0 && product.stock <= 10) || (stockFilter === 'Entre 11-50' && product.stock >= 11 && product.stock <= 50) || (stockFilter === 'Mas de 50' && product.stock > 50);
                    let matchesPrice = priceFilter === 'Todos' || (priceFilter === 'Entre 1-5' && product.precioVenta >= 1 && product.precioVenta <= 5) || (priceFilter === 'Entre 6-10' && product.precioVenta >= 6 && product.precioVenta <= 10) || (priceFilter === 'Mas de 10' && product.precioVenta > 10);
                    let matchesSearch = searchTerm === '' || product.name.toLowerCase().includes(searchTerm.toLowerCase());
                    return matchesStock && matchesPrice && matchesSearch;
                }).map((product) => (
                    <tr key={product._id}>
                        <td className="border px-4 py-2">
                            <button onClick={() => handleProductClick(product._id)} className="text-gray-900 underline hover:underline font-semibold">
                                {product.name}
                            </button>
                        </td>
                        <td className="border px-4 py-2">{product.codigoBalanza}</td>
                        <td className="border px-4 py-2">{product.stock}</td>
                        <td className="border px-4 py-2">{product.precioVenta}</td>
                        <td className="border px-4 py-2 text-left">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${product.status === 1 ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/10'}`}>
                                {product.status === 1 ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td className="border px-4 py-2">
                            <button onClick={() => handleEdit(product._id)} className="bg-orange-400 text-white rounded-md px-2 py-1 flex items-center">
                                <FaEdit className="text-white" /> <span>Editar</span>
                            </button>
                        </td>
                        <td className="border px-4 py-2">
                            <button onClick={() => handleDelete(product._id)} className="bg-red-500 text-white rounded-md px-2 py-1 flex items-center">
                                <FaTrash className="text-white" /> <span>Eliminar</span>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Detalle del producto"
            shouldCloseOnOverlayClick={true}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    transition: 'opacity 3s'
                },
                content: {
                    width: '50%',
                    height: '50%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '10%',
                    marginBottom: 'auto',
                    transition: 'all 1s'
                }
            }}
        >
            <h1 className="text-gray-600 text-xl">Detalle del producto</h1>
            <hr className="border-gray-400 border-t-2 mb-4" />

            {selectedProduct && (
                <div className="border-2 rounded-md border-gray-400 p-5 m-10 mx-auto">
                    <div className="flex flex-wrap">
                        <div className="w-1/2">
                            <div className="flex">
                                <p className="w-48"><strong>Nombre:</strong></p>
                                <p className="ml-2">{selectedProduct.name}</p>
                            </div>
                            <div className="flex">
                                <p className="w-48"><strong>Código de Balanza:</strong></p>
                                <p className="ml-2">{selectedProduct.codigoBalanza}</p>
                            </div>
                            <div className="flex">
                                <p className="w-48"><strong>Estado:</strong></p>
                                <p className="ml-2">{selectedProduct.status === 1 ? 'Activo' : 'Inactivo'}</p>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="flex">
                                <p className="w-48"><strong>Stock:</strong></p>
                                <p className="ml-2">{selectedProduct.stock}</p>
                            </div>
                            <div className="flex">
                                <p className="w-48"><strong>Precio de Venta:</strong></p>
                                <p className="ml-2">{selectedProduct.precioVenta}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <button
                className="bg-gray-600 text-white w-1/2 mx-auto mt-4 py-2 rounded flex items-center justify-center"
                onClick={closeModal}
            >
                Cerrar Modal
            </button>
        </Modal>
    </div>
        )}
    </div>
 
); 
}

export default List;