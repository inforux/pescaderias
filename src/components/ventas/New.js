import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { FaPlus, FaTrash, FaDollarSign, FaTimes } from 'react-icons/fa';
import { fetchClientes } from '../../services/ClientApi';
import { fetchProducts } from '../../services/ProductApi';
import { fetchComprobantes, fetchFormasPago, newVenta } from '../../services/Ventas';


const NewVenta = () => {

    const cantidadRef = useRef(null);
    const agregarRef = useRef(null);
    const productoRef = useRef(null);
    const pagoConRef = useRef(null);
    const descuentoRef = useRef(null);
    const venderRef = useRef(null);
    const [clientes, setClientes] = useState([]);
    const [ventaDetalles, setVentaDetalles] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [productos, setProductos] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [precio, setPrecio] = useState('');
    const [cantidad, setCantidad] = useState('0');
    const [importe, setImporte] = useState('0');
    const [total, setTotal] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [descuento, setDescuento] = useState(0);
    const [pagoCon, setPagoCon] = useState(0);
    const [vuelto, setVuelto] = useState(0);
    const [comprobantes, setComprobantes] = useState([]);
    const [selectedComprobante, setSelectedComprobante] = useState('');
    const [formasPago, setFormasPago] = useState([]);
    const [selectedFormaPago, setSelectedFormaPago] = useState('');
    const [errors, setErrors] = useState([]);
    const [alerta, setAlerta] = useState(null);
    const [alertColor, setAlertColor] = useState(null);
    const [counter, setCounter] = useState(10); 


    useEffect(() => {
        const getClientes = async () => {
            const res = await fetchClientes();
            const clientesData = res.data.map(cliente => ({ value: cliente._id, label: cliente.names }));
            setClientes(clientesData);
        };

    const getProductos = async () => {
        const res = await fetchProducts();
        const productosData = res.data.map(producto => ({ 
        value: producto._id, 
        label: producto.name, 
        precioVenta: producto.precioVenta,
        unidadMedida: producto.unidadMedida.simbol
        }));
        setProductos(productosData);
    };

    const loadComprobantes = async () => {
        const response = await fetchComprobantes();
        setComprobantes(response.data.filter(comprobante => comprobante.name === 'NOTA DE VENTA'));
    };

    const loadFormasPago = async () => {
        const response = await fetchFormasPago();
        setFormasPago(response.data.filter(formaPago => formaPago.name === 'EFECTIVO'));
    };

        loadFormasPago();
        loadComprobantes();
        getClientes();
        getProductos();

    const handleKeyDown = (event) => {
        switch (event.key.toLowerCase()) {
            case 'p':
                if (pagoConRef.current) {
                    pagoConRef.current.focus();
                }
                break;
            case 'd':
                if (descuentoRef.current) {
                    descuentoRef.current.focus();
                }
                break;
            case 'v':
                if (venderRef.current) {
                    venderRef.current.focus();
                }
                break;
            default:
                break;
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };

    }, []);

    useEffect(() => {
    const newSubtotal = ventaDetalles.reduce((sum, detalle) => sum + parseFloat(detalle.importe), 0);
    setSubtotal(newSubtotal);
}, [ventaDetalles]);

useEffect(() => {
    const newTotal = Math.max(0, subtotal - descuento);
    setTotal(newTotal);
}, [subtotal, descuento]);

useEffect(() => {
    if (formasPago.length > 0) {
        setSelectedFormaPago(formasPago[0]._id);
    }
}, [formasPago]);

useEffect(() => {
    if (comprobantes.length > 0) {
        setSelectedComprobante(comprobantes[0]._id);
    }
}, [comprobantes]);

  useEffect(() => {
        if (!isNaN(parseFloat(precio)) && !isNaN(parseFloat(cantidad))) {
            const newImporte= (parseFloat(precio) * parseFloat(cantidad)).toFixed(2);
            setImporte(newImporte);
        }
    }, [precio, cantidad]);

    useEffect(() => {
    if (total === 0) {
        setDescuento(0);
        setPagoCon(0);
    }
}, [total]);

    const handleCantidadKeyDown = (event) => {
        if (event.key === 'Enter' && agregarRef.current) {
            agregarRef.current.focus();
        }
    };

useEffect(() => {
    if (alerta) {
        setCounter(10); // Reinicia el contador cuando se muestra una nueva alerta
        const timer = setInterval(() => {
            setCounter(counter => counter - 1);
        }, 1000);

        const timeout = setTimeout(() => {
            setAlerta(null);
        }, 10000);

        return () => {
            clearInterval(timer);
            clearTimeout(timeout);
        };
    }
}, [alerta]);

    const handleAgregarClick = () => {
        if (selectedProducto && cantidad && precio && importe) {
            const newDetalle = {
                producto: selectedProducto.value,
                nombreProduct: selectedProducto.label,
                simbolUnidadMedida: selectedProducto.unidadMedida, 
                cantidad: cantidad,
                precio: precio,
                importe:importe 
            };
            setVentaDetalles([...ventaDetalles, newDetalle]);
            setSelectedProducto(null);
            setTotal(total + parseFloat(importe));
            setPrecio('');
            setCantidad('0');
            setImporte('0');
            setDescuento('0')
            setPagoCon(0);
            setVuelto(0);
            if (productoRef.current) {
                productoRef.current.focus();
            }
        }
    };

   const handleEliminarClick = (index) => {
    const importeEliminado = parseFloat(ventaDetalles[index].importe);
    if (isNaN(importeEliminado)) {
        console.error(`El importe del detalle de venta ${index} no es un número: ${ventaDetalles[index].importe}`);
    } else {
        const nuevoTotal = Math.max(0, total - importeEliminado);
        setTotal(nuevoTotal);
        setDescuento('0')
        setPagoCon(0);
        setVuelto(0);
        setVentaDetalles(ventaDetalles.filter((_, i) => i !== index));
        if (productoRef.current) {
            productoRef.current.focus();
        }
    }
}; 

const handleDescuentoChange = (event) => {
    const value = event.target.value;
    if (total > 0 && (value === '' || value === '.' || value.match(/^\d+\.?\d*$/))) {
        setDescuento(value);
    } else if (total === 0) {
        setDescuento(0);
    }
};

  const handlePagoConChange = (event) => {
    const value = event.target.value;
    if (total > 0 && (value === '' || value === '.' || value.match(/^\d+\.?\d*$/))) {
        setPagoCon(value);
        setVuelto(value === '' ? 0 : parseFloat(value) - total);
    }
}; 

     const handleClienteChange = (selectedOption) => {
        setSelectedCliente(selectedOption);
    };

   const handleProductoChange = (selectedOption) => {
    setSelectedProducto(selectedOption);
    setPrecio(selectedOption.precioVenta || '');
    setCantidad('');
    setImporte('');
    if (cantidadRef.current) {
        cantidadRef.current.focus();
    }
}; 

    const handleCantidadChange = (event) => {
        const value = event.target.value;
        if (!isNaN(value) && value.includes('.') <= 1) {
            setCantidad(value);
        }
    };



const handleComprobanteChange = (event) => {
    setSelectedComprobante(event.target.value);
};

const handleFormaPagoChange = (event) => {
    setSelectedFormaPago(event.target.value);
};

const handleVenderClick = async () => {
        const newErrors = [];

        if (!selectedCliente) newErrors.push("Debe seleccionar un cliente.");
        if (!selectedFormaPago) newErrors.push("Debe seleccionar una forma de pago.");
        if (!selectedComprobante) newErrors.push("Debe seleccionar un comprobante.");
        if (total <= 0) newErrors.push("El total debe ser mayor a 0.");
        if (pagoCon < total) newErrors.push("El 'Pago con' debe ser mayor o igual al total.");

        setErrors(newErrors);

        if (newErrors.length === 0) {
            const data = {
                comprobante: selectedComprobante,
                cliente: selectedCliente.value, 
                detallesSalida: ventaDetalles.map(detalle => ({
                        product: detalle.producto,
                        nombreProduct: detalle.nombreProduct,
                        simbolUnidadMedida: detalle.simbolUnidadMedida,
                        cantidad: detalle.cantidad.toString(),
                        precio: detalle.precio.toString(),
                        importe: detalle.importe.toString()
                })),
                detallesPago: [{
                        monto: total.toString(),
                        formaPago: selectedFormaPago,
                        nameFormaPago: formasPago.find(fp => fp._id === selectedFormaPago).name
                }],
                subTotal: subtotal.toString(),
                total: total.toString(),
                impuesto: (total - subtotal).toString(),
                tienda: "65b406ae960f67f386b2e151" 
            };

            try {
                const response = await newVenta(data);

                if (response.status === 200 || response.status === 201) {
                setAlerta(`Comprobante: ${response.data.comprobanteName} ${response.data.serie}-${response.data.correlativo}`);
                setAlertColor('green'); // Nuevo estado para el color del alerta
                setSelectedProducto(null);
                setCantidad('');
                setPrecio('');
                setImporte('');
                setVentaDetalles([]);
                setSubtotal(0);
                setDescuento(0);
                setTotal(0);
                setPagoCon(0);
                setVuelto(0);
                setSelectedCliente(null);
                //setSelectedFormaPago('');
                //setSelectedComprobante('');
                setErrors([]);
                console.log(response.data);
            } else {
                throw new Error('La venta no se pudo realizar');
            }

            } catch (error) {
                setAlerta(`Error: ${error.message}`);
                setAlertColor('red'); 
                console.error(error);
            }
        }
    };


    return (
        <div className="flex flex-col space-y-4">
    {alerta && (
        <div className={`${alertColor === 'green' ? 'bg-green-100' : 'bg-red-100'} border-l-4 ${alertColor === 'green' ? 'border-green-500' : 'border-red-500'} ${alertColor === 'green' ? 'text-green-700' : 'text-red-700'} p-4 relative mt-5`} role="alert">
            <p className="font-bold">{alertColor === 'green' ? 'Venta Exitosa' : 'Error'}</p>
            <p>{alerta}</p>
            <div className="absolute top-0 right-0 p-4">
                <FaTimes className="cursor-pointer" onClick={() => setAlerta(null)} />
            </div>
            <p className="text-sm">Esta alerta se cerrará en {counter} segundos</p>
        </div>
    )} 
            <div className="border border-gray-400 rounded-md p-4 mt-10 flex">
                <div className="flex flex-col w-1/4 mr-2 ">
                    <label>Producto</label>
                    <Select
                        className='mt-2'
                        value={selectedProducto}
                        onChange={handleProductoChange}
                        options={productos}
                        ref={productoRef}
                    />
                </div>
                <div className="flex flex-col w-1/8 mr-2">
                    <label>Cantidad</label>
                    <input ref={cantidadRef} className="border border-gray-400 rounded-md p-2 my-2 w-full" type="text" value={cantidad} onChange={handleCantidadChange} onKeyDown={handleCantidadKeyDown} />
                </div>
                <div className="flex flex-col w-1/8 mr-2">
                    <label>Precio</label>
                    <input className="border border-gray-400 rounded-md p-2 my-2 w-full" type="text" value={precio} readOnly />
                </div>
                <div className="flex flex-col w-1/4 mr-2">
                    <label>Importe</label>
                    <input className="border border-gray-400 rounded-md p-2 my-2 w-full" type="text" value={importe} readOnly />
                </div>
                <button  onClick={handleAgregarClick}  ref={agregarRef} className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded w-1/8 h-full mt-8">
                    <FaPlus />
                    <span className="ml-2">Agregar</span>
                </button>
                    <span className="text-6xl font-semibold text-purple-700 ml-16 mt-4 ">{total.toFixed(2)}</span>
            </div> 
            <div className="border border-gray-400 rounded-md p-4">
                <table className="table-auto w-full mt-5">
                <thead>
                    <tr>
                        <th className="text-left border px-4 py-2">Producto</th>
                        <th className="text-left border px-4 py-2">Peso</th>
                        <th className="text-left border px-4 py-2">Precio</th>
                        <th className="text-left border px-4 py-2">Importe</th>
                        <th className="text-left border px-4 py-2">Acción</th>
                    </tr>
                </thead>
            <tbody>
                {ventaDetalles.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="border px-4 py-2 text-gray-700 text-center text-l font-semibold">No hay detalle de venta</td>
                    </tr>
                ) : (
                    ventaDetalles.map((item, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{item.nombreProducto}</td>
                            <td className="border px-4 py-2">{item.cantidad} {item.simbolUnidadMedida}</td>
                            <td className="border px-4 py-2">{item.precio}</td>
                            <td className="border px-4 py-2">{item.importe}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => handleEliminarClick(index)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                                    <FaTrash />
                                </button>
                            </td>  
                        </tr>
                    ))
                )}
            </tbody> 
                </table>
            </div>
            <div className="border border-gray-400 rounded-md p-4 flex space-x-4">
                <div className="bg-sky-100 w-1/2 p-5">
                    <div className="flex flex-col space-y-4 items-start">
                        <div className="flex items-center space-x-4 w-full">
                            <label className="w-1/2">Subtotal</label>
                            <label className="border border-gray-400 rounded-md p-2 w-1/2">{subtotal.toFixed(2)}</label>
                        </div>
                        <div className="flex items-center space-x-4 w-full">
                            <label className="w-1/2">Descuento</label>
                            <input className="border border-gray-400 rounded-md p-2 w-1/2" type="text" ref={descuentoRef} value={descuento} onChange={handleDescuentoChange} onClick={(e) => {
        if (e.target.value === '0') {
            e.target.value = '';
        }
    }} />
                        </div>
                        <div className="flex items-center space-x-4 w-full">
                            <label className="w-1/2">Total</label>
                            <label className="border border-gray-400 rounded-md p-2 w-1/2">{total.toFixed(2)}</label>
                        </div>
                        <div className="flex items-center space-x-4 w-full">
                            <label className="w-1/2">Pago con</label>
                            <input className="border border-gray-400 rounded-md p-2 w-1/2" type="text"  ref={pagoConRef} value={pagoCon} onChange={handlePagoConChange} onClick={(e) => {
        if (e.target.value === '0') {
            e.target.value = '';
        }
    }} />
                        </div>
                        <div className="flex items-center space-x-4 w-full">
                            <label className="w-1/2">Vuelto</label>
                            <label className="border border-gray-400 rounded-md p-2 w-1/2">{vuelto}</label>
                        </div> 
                    </div>
                </div>
                <div className="bg-gray-200 w-1/2 p-5">
                    <div className="flex flex-col space-y-4 items-start">
                         <div className="flex items-center space-x-4 w-full">
            <label className="w-1/2">Cliente</label>
            <Select
                className="w-1/2"
                value={selectedCliente}
                onChange={handleClienteChange}
                options={clientes}
            />
        </div>
                        <div className="flex items-center space-x-4 w-full">
                            <label className="w-1/2">Forma de pago</label>
                            <select className="border border-gray-400 rounded-md p-2 w-1/2" value={selectedFormaPago} onChange={handleFormaPagoChange}>
                                {formasPago.map((formaPago) => (
        <option key={formaPago._id} value={formaPago._id}>
            {formaPago.name}
        </option>
    ))}
                            </select>
                        </div>
                        <div className="flex items-center space-x-4 w-full">
                            <label className="w-1/2">Comprobante</label>
                            <select className="border border-gray-400 rounded-md p-2 w-1/2" value={selectedComprobante} onChange={handleComprobanteChange}>
                                {comprobantes.map((comprobante) => (
                                    <option key={comprobante._id} value={comprobante._id}>
                                    {comprobante.name}
                                    </option>
                                ))}
                            </select>
                        </div>

<div className="flex flex-col items-end justify-end w-full">
    <button ref={venderRef} onClick={handleVenderClick} className="bg-green-500 text-white rounded-md p-2 w-1/2 flex items-center justify-center space-x-2">
        <FaDollarSign /> {/* Icono de venta */}
        <span>Vender</span>
    </button>
    {errors.length > 0 && (
        <div className="text-red-500 mt-2 w-1/2">
            {errors.map((error, index) => (
                <div key={index}>{error}</div>
            ))}
        </div>
    )}
</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewVenta;