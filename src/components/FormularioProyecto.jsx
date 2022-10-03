import { useState, useEffect } from "react";
import useProyectos from "../hooks/useProyectos";
import Alerta from "./Alerta";
import { useParams } from "react-router-dom";
function FormularioProyecto() {
	const params = useParams();
	const [nombre, setNombre] = useState("");
	const [id, setId] = useState(null);

	const [descripcion, setDescripcion] = useState("");
	const [fechaEntrega, setFechaEntrega] = useState("");
	const [cliente, setCliente] = useState("");
	const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyectos();
	useEffect(() => {
		if (params.id) {
			setId(proyecto._id);
			setNombre(proyecto.nombre);
			setDescripcion(proyecto.descripcion);
			setFechaEntrega(proyecto.fechaEntrega.split("T")[0]);
			setCliente(proyecto.cliente);
		}
	}, [params]);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if ([nombre, descripcion, fechaEntrega, cliente].includes("")) {
			mostrarAlerta({
				msg: "Todos los Campos son obligatorios",
				error: true,
			});
			return;
		}
		await submitProyecto({
			id,
			nombre,
			descripcion,
			fechaEntrega,
			cliente,
		});
		setId(null);
		setCliente("");
		setDescripcion("");
		setFechaEntrega("");
		setNombre("");
	};
	const { msg } = alerta;
	return (
		<form
			className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
			onSubmit={handleSubmit}
		>
			{msg && <Alerta alerta={alerta} />}
			<div className="mb-5">
				<label
					className="text-gray-700 uppercase font-bold text-sm"
					htmlFor="nombre"
				>
					Nombre Proyecto
				</label>
				<input
					type="text"
					className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
					id="nombre"
					value={nombre}
					placeholder="Nombre del Proyecto"
					onChange={(e) => setNombre(e.target.value)}
				/>
			</div>
			<div className="mb-5">
				<label
					className="text-gray-700 uppercase font-bold text-sm"
					htmlFor="descripcion"
				>
					Descripcion
				</label>
				<textarea
					className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
					id="descripcion"
					value={descripcion}
					placeholder="Nombre del Proyecto"
					onChange={(e) => setDescripcion(e.target.value)}
				/>
			</div>
			<div className="mb-5">
				<label
					className="text-gray-700 uppercase font-bold text-sm"
					htmlFor="fecha-entrega"
				>
					Fecha Entrega
				</label>
				<input
					type="date"
					className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
					id="fecha-entrega"
					value={fechaEntrega}
					placeholder="Nombre del Proyecto"
					onChange={(e) => setFechaEntrega(e.target.value)}
				/>
			</div>
			<div className="mb-5">
				<label
					className="text-gray-700 uppercase font-bold text-sm"
					htmlFor="cliente"
				>
					Nombre Cliente
				</label>
				<input
					type="text"
					className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
					id="cliente"
					value={cliente}
					placeholder="Nombre del Proyecto"
					onChange={(e) => setCliente(e.target.value)}
				/>
			</div>
			<input
				type="submit"
				value={id ? "Actualizar Proyecto" : "Crear Proyecto"}
				className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors"
			/>
		</form>
	);
}

export default FormularioProyecto;
