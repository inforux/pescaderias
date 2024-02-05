import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ShowProduct() {
    const [product, setProduct] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get( process.env.REACT_APP_API_PESCADERIA + `/products/products/${id}`);
                console.log('show:  '+response.data);
                setProduct(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const token = sessionStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            fetchProduct();
        }
    }, [id]);

}

export default ShowProduct;
