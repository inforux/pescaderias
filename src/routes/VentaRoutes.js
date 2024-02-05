import { Routes, Route } from 'react-router-dom';
import NewVenta from '../components/ventas/New';
import ListVentas from '../components/ventas/ListVentas';

function VentaRoutes() {
    return (
        <Routes>
            <Route path="/new" element={<NewVenta/>} /> 
            <Route path="/" element={<ListVentas/>} /> 
        </Routes>
    );
}

export default VentaRoutes;