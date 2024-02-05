import { Routes, Route } from 'react-router-dom';
import List from '../components/Productos/List'; 
import EditProduct from '../components/Productos/Edit';
import ShowProduct from '../components/Productos/Show';
import DeleteProduct from '../components/Productos/Delete';
import NewProduct from '../components/Productos/New';

function ProductRoutes() {
    return (
        <Routes>
            <Route path="/edit/:id" element={<EditProduct />} /> 
            <Route path="/show/:id" element={<ShowProduct/>} /> 
            <Route path="/delete/:id" element={<DeleteProduct/>} /> 
            <Route path="/new" element={<NewProduct />} /> 
            <Route path="/" element={<List />} />
        </Routes>
    );
}

export default ProductRoutes;