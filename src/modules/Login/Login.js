import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(process.env.REACT_APP_API_PESCADERIA+'/auth/login', { email: username, password });
            sessionStorage.setItem('token', response.data.token);
            const decodedToken = jwtDecode(response.data.token);
            sessionStorage.setItem('username', decodedToken.email);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
            navigate('/products');
        } catch (error) {
            console.error(error);
        }
    };

return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500">
        <div className="p-6 m-4 bg-blue-200 bg-opacity-50 rounded-md">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">PESCADERIA SAN JOSE</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">Nombre de usuario</label>
                        <div className="mt-2">
                            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Contraseña</label>
                        <div className="mt-2">
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Ingresar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
); 
}

export default Login;