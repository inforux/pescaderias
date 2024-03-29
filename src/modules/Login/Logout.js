import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('username');
        navigate('/auth/login');
    }, [navigate]);

    return null;
}

export default Logout;