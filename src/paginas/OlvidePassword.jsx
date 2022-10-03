import { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";

const OlvidePassword = () => {
	const [email, setEmail] = useState("");
	const [alerta, setAlerta] = useState({});
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (email === "" || email.length < 6) {
			setAlerta({ msg: "El email es obligatorio", error: true });
			return;
		}
		try {
			const { data } = await clienteAxios.post(
				`/usuario/olvide-password`,
				{ email },
			);
			setAlerta({ msg: data.msg, error: false });
		} catch (error) {
			console.log(error.response);
			setAlerta({ msg: error.response.data.msg, error: true });
		}
	};
	const { msg } = alerta;
	return (
		<>
			<h1 className="text-sky-600 font-black text-6xl capitalize">
				Recuperá tu acceso y no pierdas tus{" "}
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

				<input
					type="submit"
					value="Enviar Instrucciones"
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
					to="/registrar"
				>
					¿No tienes una Cuenta? Registrate
				</Link>
			</nav>
		</>
	);
};

export default OlvidePassword;
