import React, { useEffect, useState } from 'react';
import { fetchVentas, anularVenta, fetchHistoricoVentas, fetchTop5, fetchStock10 } from '../../services/Ventas';
import { FaEye, FaTrash } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import Modal from 'react-modal';
import "../../css/Layout.css"
import Chart from 'react-apexcharts';
import { fetchVenta } from '../../services/Ventas';

const ListVentas = () => {
    const [ventas, setVentas] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [PER_PAGE, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [ventaDetails, setVentaDetails] = useState(null);
    const [confirmAnular, setConfirmAnular] = useState(false);
    const [dataArea, setDataArea] = useState([]);
    const [dataColumn, setDataColumn] = useState([]);
    const [dataPolar, setDataPolar] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnulando, setIsAnulando] = useState(false);
    const [isVentaLoading, setIsVentaLoading] = useState(false);


const seriesPolar = dataPolar.map(item => parseInt(item.stock));

const optionsPolar = {
    labels: dataPolar.map(item => `${item.name} - ${(item.stock !== undefined ? parseFloat(item.stock).toFixed(2) : 0)} kg`),
    title: {
        text: 'Stock de los 10 productos mas vendidos',
        align: 'left'
    },
    subtitle: {
        text: 'Peso Kg - Producto',
        align: 'left'
    },
};

const seriesArea = [{
    name: "Total ventas",
    data: dataArea.map(item => item.totalVentas)
}];

const optionsArea = {
    chart: {
        type: 'area',
        height: 350,
        zoom: {
            enabled: false
        }
    },
    dataLabels: {
        enabled: false
    },
    title: {
        text: 'Historico de venta',
        align: 'left'
    },
    subtitle: {
        text: 'Total venta x Dia',
        align: 'left'
    },
    labels: dataArea.map(item => {
        const date = new Date(`${item._id.year}-${item._id.month}-${item._id.day}`);
        return date.toLocaleDateString('en-GB');
    }),
    yaxis: {
        labels: {
            formatter: function (value) {
                return 's/. ' + (value !== undefined ? value.toFixed(2) : 0);
            }
        }
    }
};

const seriesColumn = dataColumn.reduce((acc, item) => {
    const existingSeries = acc.find(series => series.name === item._id.name);

    if (existingSeries) {
        existingSeries.data.push(item.totalVendido);
    } else {
        acc.push({
            name: item._id.name,
            data: [item.totalVendido]
        });
    }

    return acc;
}, []);

const optionsColumn = {
    title: {
        text: 'Analisis de los 5 productos mas vendidos',
        align: 'left'
    },
    subtitle: {
        text: 'Venta en Kg. de productos x Dia',
        align: 'left'
    },
    yaxis: {
        labels: {
            formatter: function (value) {
                return 'Kg. ' + (value !== undefined ? value.toFixed(2) : 0);
            }
        }
    },
    xaxis: {
        categories: [...new Set(dataColumn.map(item => {
            const date = new Date(`${item._id.year}-${item._id.month}-${item._id.day}`);
            return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        }))],
    },
    plotOptions: {
        bar: {
            dataLabels: {
                position: 'top', 
            },
        }
    },
    dataLabels: {
        enabled: true,
        style: {
            colors: ['#000000'] 
        },
    }
};


    useEffect(() => {
        const fetchData = async () => {
            const result = await fetchVentas();
            setVentas(result.data);
            setIsLoading(false);
        };

        const fetchDataArea = async () => {
        const resultArea = await fetchHistoricoVentas();
        setDataArea(resultArea.data);
    };

    const fetchDataColumn = async () => {
        const resultColumn = await fetchTop5();
        setDataColumn(resultColumn.data.ventasPorDia);
    };

    const fetchDataPolar = async () => {
        const resultStock10 = await fetchStock10();
        setDataPolar(resultStock10.data);
    };

        fetchData();
        fetchDataPolar();
        fetchDataColumn();
        fetchDataArea();
    }, []);

     const handleSearch = event => {
        setSearchTerm(event.target.value);
    };

    const handleEyeClick = async (id) => {
        setIsVentaLoading(true);
        setModalIsOpen(true);
        const result = await fetchVenta(id);
        setVentaDetails(result.data);
        setIsVentaLoading(false);
    }; 

    const handleAnularVenta = async () => {
  try {
    setIsAnulando(true);
    await anularVenta(ventaDetails._id);
    closeModal();
    const result = await fetchVentas();
    setVentas(result.data);
  } catch (error) {
    console.error(error);
  }
};

const closeModal = () => {
    setModalIsOpen(false);
};

const filteredVentas = ventas.filter((venta) => {
    const words = searchTerm.toLowerCase().split(' ');
    return words.some(word => 
        venta.comprobante.name.toLowerCase().includes(word) ||
        (venta.comprobante.serie + '-' + venta.correlativo).toLowerCase().includes(word) ||
        venta.cliente.names.toLowerCase().includes(word) ||
        venta.subTotal.toString().includes(word) ||
        venta.total.toString().includes(word) ||
        (venta.status === 1 ? 'activo' : 'inactivo').includes(word)
    );
});

    return (
<div>
    {isLoading ? (
      <div>Cargando...</div>
    ) : (
<div>

<div className="border border-gray-700 p-2 mt-2" style={{ width: '100%', display: 'flex' }}>
        <div style={{ width: '30%' }}>
            <Chart options={optionsArea} series={seriesArea} type="area" />
        </div>
        <div style={{ width: '30%' }} className='ml-10'>
            <Chart options={optionsColumn} series={seriesColumn} type="bar"  />
        </div>
        <div style={{ width: '33%' }} className='ml-10'>
            <Chart options={optionsPolar} series={seriesPolar} type="polarArea" />
        </div>
    </div>

            <div className="mt-2">
                <input id="buscar" type="text" placeholder='Buscar' className="w-1/4" onChange={handleSearch} />
            </div>
            <div className="border border-gray-700 p-2 mt-2">
                <table className="w-full border-separate ">
                    <thead>
                        <tr>
                            <th className="text-left border-b pb-5 pt-5"><div>#</div></th>
                            <th className="text-left border-b pb-5 pt-5"><div>COMPROBANTE</div></th>
                            <th className="text-left border-b pb-5 pt-5"><div>SERIE-CORRELATRIVO</div></th>
                            <th className="text-left border-b pb-5 pt-5"><div>CLIENTE</div></th>
                            <th className="text-left border-b pb-5 pt-5"><div>SUBTOTAL</div></th>
                            <th className="text-left border-b pb-5 pt-5"><div>DESCUENTO</div></th>
                            <th className="text-left border-b pb-5 pt-5"><div>TOTAL</div></th>
                            <th className="text-left border-b pb-5 pt-5"><div>ESTADO</div></th>
                            <th className="text-left border-b pb-5 pt-5"><div>DETALLE</div></th>
                        </tr>
                    </thead>
                <tbody>
                    {filteredVentas
                        .slice(currentPage * PER_PAGE, (currentPage + 1) * PER_PAGE)
                        .map((venta, index) => {
                            let descuento = venta.subTotal - venta.total;
                            let descuentoDisplay = descuento <= 0 ? '-' : `<strong>s/</strong> ${descuento}`; 
                            return (
                                <tr key={venta._id} className="border hover:bg-gray-400 hover:text-white">
                                    <td>{index + 1 + currentPage * PER_PAGE}</td>
                                    <td>{venta.comprobante.name}</td>
                                    <td>{venta.comprobante.serie}-{venta.correlativo}</td>
                                    <td>{venta.cliente.names}</td>
                                    <td><strong>s/</strong> {venta.subTotal}</td>
                                    <td dangerouslySetInnerHTML={{ __html: descuentoDisplay }}></td>
                                    <td><strong>s/</strong> {venta.total}</td>
                                    <td>
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${venta.status === 1 ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-red-50 text-red-700 ring-red-600/10'}`}>
                                        {venta.status === 1 ? 'Activo' : 'Inactivo'}
                                        </span> 
                                    </td>
                                <td>
    <FaEye className="text-blue-500 cursor-pointer" onClick={() => handleEyeClick(venta._id)} />
 
</td>
                                </tr>
                            );
                        })}
                </tbody> 
                </table>
        <div className="pagination">

            <ReactPaginate
                previousLabel={"← Anterior"}
                nextLabel={"Siguiente →"}
                pageCount={Math.ceil(ventas.length / PER_PAGE)}
                onPageChange={({ selected }) => setCurrentPage(selected)}
                containerClassName={"pagination"}
                pageLinkClassName={"page-link"}
                previousLinkClassName={"pagination__link"}
                nextLinkClassName={"pagination__link"}
                disabledClassName={"pagination__link--disabled"}
                activeClassName={"pagination__link--active"}
            />

 <select 
                onChange={(e) => setPerPage(Number(e.target.value))}
                className="pagination__select m-3"
            >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
            </select>
        </div> 

<Modal 
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    contentLabel="Venta Detalle"
    shouldCloseOnOverlayClick={true}
    shouldCloseOnEsc={true}
    style={{
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            transition: 'opacity 3s',
            zIndex: 1000
        },
        content: {
            width: '50%',
            maxHeight: '90vh', 
            overflow: 'auto', 
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '5%', 
            marginBottom: '5%', 
            transition: 'all 1s'
        }
    }}
>
   <div className="flex justify-between items-center">
        <h2>Detalle de la Venta</h2>
        {ventaDetails && ventaDetails.status !== 0 && (
    <button 
    className={`text-white flex items-center p-2 ${confirmAnular ? 'bg-red-900' : 'bg-red-600'}`} 
    onClick={confirmAnular ? handleAnularVenta : () => setConfirmAnular(true)}
>
    <FaTrash /> {confirmAnular ? (isAnulando ? 'Cargando' : 'Confirmo anular venta') : 'Anular venta'}
</button> 
    )} 
    </div> 
    <hr className="border border-gray-800 my-2" />

{isVentaLoading ? (
        <div>Cargando...</div>
    ) : (
        ventaDetails && (
    <div>
        <div className="border border-gray-700 p-5 m-5">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="grid grid-cols-2">
                        <p className="font-semibold">Comprobante:</p>
                        <p className="font-normal">{ventaDetails.comprobante.name}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <p className="font-semibold">Numero:</p>
                        <p className="font-normal">{ventaDetails.comprobante.serie}-{ventaDetails.comprobante.correlativo}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <p className="font-semibold">Cliente:</p>
                        <p className="font-normal">{ventaDetails.cliente.doc} {ventaDetails.cliente.names}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <p className="font-semibold">Creado por:</p>
                        <p className="font-normal">{ventaDetails.author.email}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <p className="font-semibold">Estado:</p>
                        <p className="font-normal">{ventaDetails.status === 0 ? 'Inactivo' : 'Activo'}</p>
                    </div>
                </div>
                <div>
                    <div className="grid grid-cols-2">
                        <p className="font-semibold">Total:</p>
                        <p className="font-normal">{ventaDetails.total}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <p className="font-semibold">Descuento:</p>
                        <p className="font-normal">
            {ventaDetails.subtotal - ventaDetails.total > 0 ? ventaDetails.subtotal - ventaDetails.total : '-'}
        </p>
                    </div>
                    <div className="grid grid-cols-2">
                        <p className="font-semibold">Subtotal:</p>
                        <p className="font-normal">{ventaDetails.subTotal}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <p className="font-semibold">Cantidad de productos:</p>
                        <p className="font-normal">{ventaDetails.cantidadProductos}</p>
                    </div>
                </div>
            </div>
        </div>
    <div className="border border-gray-700 p-5 m-5">
        <h2 className="text-lg font-semibold mb-2">Detalle de la venta:</h2>
        <hr className="mb-4 border-gray-400"/>
        <table className="w-full text-left">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Unidad de Medida</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Importe</th>
                </tr>
            </thead>
        <tbody>
            {ventaDetails.detallesSalida.map((detalleSalida) => (
                <tr className="hover:bg-gray-500 hover:text-white" key={detalleSalida._id}>
                    <td>{detalleSalida.nombreProduct}</td>
                    <td>{detalleSalida.simbolUnidadMedida}</td>
                    <td>{detalleSalida.cantidad}</td>
                    <td>{detalleSalida.precio}</td>
                    <td>{detalleSalida.importe}</td>
                </tr>
            ))}
        </tbody> 
        </table>
    </div> 
    <div className="border border-gray-700 p-5 m-5">
        <h2 className="text-lg font-semibold mb-2">Detalles del pago:</h2>
        <hr className="mb-4 border-gray-400"/>
        <table className="w-full text-left">
            <thead>
                <tr>
                    <th>Forma de pago</th>
                    <th>Monto</th>
                </tr>
            </thead>
            <tbody>
                {ventaDetails.detallesPago.map((detallePago) => (
                    <tr className="hover:bg-gray-500 hover:text-white" key={detallePago._id}>
                        <td>{detallePago.nameFormaPago}</td>
                        <td>{detallePago.monto}</td>
                    </tr>
                ))}
            </tbody> 
        </table>
    </div> 
    </div>
)
    )}






</Modal>
            </div>
        </div>
    )}
  </div>

        
    );
};

export default ListVentas;