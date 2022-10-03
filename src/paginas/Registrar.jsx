import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";

const Registrar = () => {
	const [nombre, setNombre] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repetirPassword, setRepetirPassword] = useState("");
	const [alerta, setAlerta] = useState({});
	const handleSubmit = async (e) => {
		e.preventDefault();
		if ([nombre, email, repetirPassword, password].includes("")) {
			setAlerta({ msg: "Todos los campos son obligatorio", error: true });
			return;
		}
		if (password !== repetirPassword) {
			setAlerta({
				msg: "Los passwords no son iguales",
				error: true,
			});
			return;
		}
		if (password.length < 6) {
			setAlerta({
				msg: "El password es muy corto, agrega al menos 6 caracteres",
				error: true,
			});
			return;
		}
		setAlerta({});
		//Crear el usuario en la API
		try {
			const respuesta = await clienteAxios.post(`/usuario`, {
				nombre,
				email,
				password,
			});
			const { data } = respuesta;
			setAlerta({
				msg: data.msg,
				error: false,
			});
			setEmail("");
			setNombre("");
			setPassword("");
			setRepetirPassword("");
		} catch (error) {
			setAlerta({ msg: error.response.data.msg, error: true });
		}
	};
	const { msg } = alerta;
	return (
		<>
			<h1 className="text-sky-600 font-black text-6xl capitalize">
				Crea tu Cuenta y Administra tus{" "}
				<span className="text-slate-700">Proyectos</span>
			</h1>
			{msg && <Alerta alerta={alerta} />}
			<form
				className="my-10 bg-white shadow rounded-lg p-10"
				onSubmit={handleSubmit}
			>
				<div className="my-5">
					<label
						className="uppercase text-gray-600 block text-xl font-bold"
						htmlFor="nombre"
					>
						Nombre
					</label>
					<input
						id="nombre"
						type="text"
						placeholder="Tu Nombre"
						className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
						value={nombre}
						onChange={(e) => setNombre(e.target.value)}
					/>
				</div>
				<div className="my-5">
					<label
						className="uppercase text-gray-600 block text-xl font-bold"
						htmlFor="email"
					>
						Email
					</label>
					<input
						id="email"
						type="email"
						placeholder="Email de Registro"
						className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className="my-5">
					<label
						className="uppercase text-gray-600 block text-xl font-bold"
						htmlFor="password"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						placeholder="Password de Registro"
						className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div className="my-5">
					<label
						className="uppercase text-gray-600 block text-xl font-bold"
						htmlFor="password2"
					>
						Repetir Password
					</label>
					<input
						id="password2"
						type="password"
						placeholder="Repetir Password"
						className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
						value={repetirPassword}
						onChange={(e) => setRepetirPassword(e.target.value)}
					/>
				</div>
				<input
					type="submit"
					value="Crear Cuenta"
					className=" mb-5 bg-sky-700 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
				/>
			</form>
			<nav className="flex justify-between">
				<Link
					className="block text-center my-5 text-slate-500 uppercase text-sm"
					to="/"
				>
					¿Ya tienes una Cuenta? Inicia Sesión
				</Link>
				<Link
					className="block text-center my-5 text-slate-500 uppercase text-sm"
					to="/olvide-password"
				>
					Olvide mi password
				</Link>
			</nav>
		</>
	);
};

export default Registrar;
