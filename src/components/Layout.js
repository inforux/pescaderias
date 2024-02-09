import { useState, useEffect } from "react";
import axios from 'axios';
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import {
  FaBars,
  FaUser,
  FaHome,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
  FaPlus,
} from "react-icons/fa";

import Footer from "./Footer";

const Layout = ({ children }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isOperationsVisible, setOperationsVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
  const [username, setUsername] = useState("Nombre de usuario");

  const toggleUserMenu = () => {
    setIsUserMenuVisible(!isUserMenuVisible);
  };

  useEffect(() => {
    localStorage.setItem("currentPath", location.pathname);
  }, [location]);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!event.target.closest(".user-menu-button")) {
        setIsUserMenuVisible(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
        setUsername(storedUsername);
    }

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const toggleOperations = () => {
    setOperationsVisible(!isOperationsVisible);
  };

  const routeToTitle = {
    "/": "Inicio",
    "/products": "Listado de Productos",
    "/products/new": "Nuevo Producto",
    "/ventas/new": "Nueva Venta",
    "/ventas": "Listado general de las ventas",
  };

  const getTitle = () => {
    const path = location.pathname;
    let title = routeToTitle[path];
    if (!title && path.startsWith("/products/edit/")) {
      title = "Editar Producto";
    }
    if (!title && path.startsWith("/products/delete/")) {
      title = "Eliminar Producto";
    }
    return title || "Inicio";
  };

  const title = getTitle();

const navigateUp = () => {
  if (location.pathname === "/ventas/new") {
    navigate("/products");
  } else {
    const pathSegments = location.pathname.split("/");
    if (location.pathname === "/products/new") {
      navigate("/products");
    } else if (pathSegments.length > 3) {
      pathSegments.pop();
      pathSegments.pop();
      const newPath = pathSegments.join("/");
      navigate(newPath);
    } else {
      navigate("/");
    }
  }
}; 

  const handleLogout = () => {
    // Elimina el token de la sesión
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');

    // Elimina el encabezado de autorización
    delete axios.defaults.headers.common['Authorization'];

    navigate('/login');
};

  return (
    <div className="flex h-screen relative">
      {isSidebarVisible && (
        <aside className="w-64 bg-slate-100 h-full">
          <div className="h-full px-3 py-4 overflow-y-auto text-gray-700">
            <div className="flex justify-center mb-6">
              <FaHome size={50} />
            </div>
            <ul className="space-y-2 font-medium text-slate-500">
              <li>
                <NavLink
                  to="/products"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center p-2 text-gray-900 rounded-lg hover:bg-slate-400 group bg-slate-300"
                      : "flex items-center p-2 text-gray-900 rounded-lg hover:bg-slate-400 group"
                  }
                >
                  <span className="ms-3">Productos</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/ventas"
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center p-2 text-gray-900 rounded-lg hover:bg-slate-400 group bg-slate-300"
                      : "flex items-center p-2 text-gray-900 rounded-lg hover:bg-slate-400 group"
                  }
                >
                  <span className="ms-3">Ventas</span>
                </NavLink>
              </li>
              <li>
                <span
                  className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-slate-400 group cursor-pointer"
                  onClick={toggleOperations}
                >
                  <span className="ms-3">Operaciones</span>
                  {isOperationsVisible ? (
                    <FaChevronUp className="ml-auto" />
                  ) : (
                    <FaChevronDown className="ml-auto" />
                  )}
                </span>
                {isOperationsVisible && (
                  <ul className="space-y-2 font-medium pl-6">
                    <li>
                      <NavLink
                        to="/ventas/new"
                        className={({ isActive }) =>
                          isActive
                            ? "flex items-center p-2 text-gray-900 rounded-lg hover:bg-slate-400 group bg-slate-300"
                            : "flex items-center p-2 text-gray-900 rounded-lg hover:bg-slate-400 group"
                        }
                      >
                        <span className="ms-3">Nueva Venta</span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
        </aside>
      )}
      <div className="flex flex-col flex-grow bg-sky-500">
        <nav className="bg-slate-100 text-white p-6 flex justify-between items-center border-2 border-gray-300">
          <div>
            <button className="mr-6 bg-gray-700" onClick={toggleSidebar}>
              <FaBars />
            </button>
          </div>
          <div className="relative">
            <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-2 text-gray-500 user-menu-button"
            >
              <FaUser />
              <span>{username}</span>
            </button>
            {isUserMenuVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg py-1 z-50">
                <NavLink
                  to="#"
                  className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
                >
                  Perfil
                </NavLink>
                <NavLink
                  to="/auth/logout" onClick={handleLogout}
                  className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
                >
                  Cerrar sesión
                </NavLink>
              </div>
            )}
          </div>
        </nav>
        <div className="flex-grow p-6 bg-white m-5 rounded">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl">{title}</h1>
            {location.pathname === "/products" && (
    <Link to="/products/new" className="inline-flex items-center px-4 py-2 bg-green-700 text-white rounded">
      <FaPlus className="mr-2" /> Nuevo producto
    </Link>
  )} 
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
