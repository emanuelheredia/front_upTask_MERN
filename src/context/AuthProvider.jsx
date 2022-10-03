import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({});
	const [cargando, setCargando] = useState(true);
	const navigate = useNavigate();
	useEffect(() => {
		const auntenticarUsuario = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				setCargando(false);
				return;
			}
			const config = {
				headers: {
					"Content-Type": "aplication/json",
					Authorization: `Bearer ${token}`,
				},
			};
			try {
				const { data } = await clienteAxios("usuario/perfil", config);
				setAuth(data);
			} catch (error) {
				setAuth({});
			} finally {
				setCargando(false);
			}
		};
		auntenticarUsuario();
	}, []);
	const cerrarSesionAuth = () => {
		setAuth({});
	};
	return (
		<AuthContext.Provider
			value={{ setAuth, auth, cargando, cerrarSesionAuth }}
		>
			{children}
		</AuthContext.Provider>
	);
};
export { AuthProvider };
export default AuthContext;
