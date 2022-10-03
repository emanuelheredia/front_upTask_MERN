import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import useAuth from "../hooks/useAuth";
let socket;

const ProyectoContext = createContext();

const ProyectosProvider = ({ children }) => {
	const { auth } = useAuth();
	const navigate = useNavigate();
	const [proyectos, setProyectos] = useState([]);
	const [proyecto, setProyecto] = useState({});
	const [alerta, setAlerta] = useState({});
	const [cargando, setCargando] = useState(false);
	const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
	const [tarea, setTarea] = useState({});
	const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
	const [colaborador, setColaborador] = useState({});
	const [modalEliminarColaborador, setModalEliminarColaborador] =
		useState(false);
	const [buscador, setBuscador] = useState(false);

	const mostrarAlerta = (alerta) => {
		setAlerta(alerta);
		setTimeout(() => {
			setAlerta({});
		}, 2000);
	};
	useEffect(() => {
		socket = io(import.meta.env.VITE_BACKEND_URL);
	}, []);

	useEffect(() => {
		const obtenerProyectos = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) return;
				const config = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				};
				const { data } = await clienteAxios("/proyectos", config);
				setProyectos(data);
			} catch (error) {
				console.log(error);
			}
		};
		obtenerProyectos();
	}, [auth]);

	const obtenerProyecto = async (id) => {
		setCargando(true);
		try {
			const token = localStorage.getItem("token");
			if (!token) return;
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await clienteAxios(`/proyectos/${id}`, config);
			setProyecto(data);
			setAlerta({});
		} catch (error) {
			navigate("/proyectos");
			setAlerta({ msg: error.response.data.msg, error: true });
			setTimeout(() => {
				setAlerta({});
			}, 2000);
		} finally {
			setCargando(false);
		}
	};

	const submitProyecto = async (proyecto) => {
		if (proyecto.id) {
			await editarProyecto(proyecto);
		} else {
			await crearProyecto(proyecto);
		}
	};
	const crearProyecto = async (proyecto) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return;
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await clienteAxios.post(
				"/proyectos",
				proyecto,
				config,
			);
			setProyectos([...proyectos, data]);
			mostrarAlerta({
				msg: "Proyecto Creado Correctamente",
				error: false,
			});
		} catch (error) {
			console.log(error);
		}
	};
	const editarProyecto = async (proyecto) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return;
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await clienteAxios.put(
				`/proyectos/${proyecto.id}`,
				proyecto,
				config,
			);
			const proyectosActualizados = proyectos.map((proyectoState) =>
				data._id === proyectoState._id ? data : proyectoState,
			);
			setProyectos(proyectosActualizados);
			mostrarAlerta({
				msg: "Proyecto Actualizado Correctamente",
				error: false,
			});
		} catch (error) {
			console.log(error);
		}
	};
	const eliminarProyecto = async (id) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return;
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await clienteAxios.delete(
				`/proyectos/${id}`,
				config,
			);
			const proyectosActualizados = proyectos.filter(
				(proyectoState) => id !== proyectoState._id,
			);
			setProyectos(proyectosActualizados);
			mostrarAlerta({
				msg: data.msg,
				error: false,
			});
		} catch (error) {
			console.log(error);
		}
	};
	const handleModalTarea = () => {
		setModalFormularioTarea(!modalFormularioTarea);
		setTarea({});
	};
	const handleModalEditarTarea = (tarea) => {
		setModalFormularioTarea(true);
		setTarea(tarea);
	};
	const submitTarea = async (tarea) => {
		if (tarea.id2) {
			await editarTarea(tarea);
		} else {
			await crearTarea(tarea);
		}
	};
	const crearTarea = async (tarea) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return;
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await clienteAxios.post("/tareas", tarea, config);

			setModalFormularioTarea(false);
			setAlerta({});
			//Socket io
			socket.emit("nueva tarea", data);
		} catch (error) {
			console.log(error);
		}
	};
	const editarTarea = async (tarea) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return;
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await clienteAxios.put(
				`/tareas/${tarea.id2}`,
				tarea,
				config,
			);
			//Socket io
			socket.emit("editar tarea", data);

			setModalFormularioTarea(false);
			setAlerta({});
		} catch (error) {
			console.log(error);
		}
	};
	const handleModalEliminarTarea = (tarea) => {
		setModalEliminarTarea(!modalEliminarTarea);
		setTarea(tarea);
	};
	const eliminarTarea = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return;
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await clienteAxios.delete(
				`/tareas/${tarea._id}`,
				config,
			);
			setAlerta({ msg: data.msg, error: false });
			//Socket io
			socket.emit("eliminar tarea", tarea);

			setModalEliminarTarea(false);
			setTarea({});
			setTimeout(() => setAlerta({}), 2000);
		} catch (error) {
			console.log(error);
		}
	};
	const submitColaborador = async (email) => {
		setCargando(true);
		try {
			const token = localStorage.getItem("token");
			if (!token) return;
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await clienteAxios.post(
				`proyectos/colaboradores`,
				{ email },
				config,
			);
			setColaborador(data);
			setAlerta({});
		} catch (error) {
			setAlerta({ msg: error.response.data.msg, error: true });
		} finally {
			setCargando(false);
		}
	};
	const agregarColaborador = async (email) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return;
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await clienteAxios.post(
				`proyectos/colaboradores/${proyecto._id}`,
				email,
				config,
			);
			setAlerta({ msg: data.msg, error: false });
			setColaborador({});
			setTimeout(() => {
				setAlerta({});
			}, 2000);
		} catch (error) {
			setAlerta({ msg: error.response.data.msg, error: true });
		}
	};
	const handleModalEliminarColaborador = (colaborador) => {
		setModalEliminarColaborador(!modalEliminarColaborador);
		setColaborador(colaborador);
	};
	const eliminarColaborador = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return;
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await clienteAxios.post(
				`proyectos/eliminar-colaborador/${proyecto._id}`,
				{ id: colaborador._id },
				config,
			);
			const proyectoActualizado = { ...proyecto };
			proyectoActualizado.colaboradores =
				proyectoActualizado.colaboradores.filter(
					(colaboradorState) =>
						colaboradorState._id !== colaborador._id,
				);
			setProyecto(proyectoActualizado);
			setAlerta({ msg: data.msg, error: false });
			setColaborador({});
			setModalEliminarColaborador(false);
			setTimeout(() => {
				setAlerta({});
			}, 2000);
		} catch (error) {
			console.log(error.response);
		}
	};
	const completarTarea = async (id) => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return;
			const config = {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			};
			const { data } = await clienteAxios.post(
				`tareas/estado/${id}`,
				{ id: colaborador._id },
				config,
			);
			//SOCKET IO
			socket.emit("completar tarea", data);
			setTarea({});
		} catch (error) {
			console.log(error);
		}
	};
	const handleBuscador = () => {
		setBuscador(!buscador);
	};
	const submitTareasProyecto = (tarea) => {
		if (tarea.proyecto === proyecto._id) {
			const proyectoActualizado = { ...proyecto };
			proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];
			setProyecto(proyectoActualizado);
		}
	};
	const submitEliminarTareas = (tarea) => {
		if (tarea.proyecto === proyecto._id) {
			const proyectoActualizado = { ...proyecto };
			proyectoActualizado.tareas = proyectoActualizado.tareas.filter(
				(tareaState) => tareaState._id !== tarea._id,
			);
			setProyecto(proyectoActualizado);
		}
	};
	const submitEditarTareas = (tarea) => {
		if (tarea.proyecto._id === proyecto._id) {
			const proyectoActualizado = { ...proyecto };
			proyectoActualizado.tareas = proyectoActualizado.tareas.map(
				(tareaState) =>
					tareaState._id === tarea._id ? tarea : tareaState,
			);
			setProyecto(proyectoActualizado);
		}
	};
	const submitCompletarTareas = (tarea) => {
		if (tarea.proyecto._id === proyecto._id) {
			const proyectoActualizado = { ...proyecto };
			proyectoActualizado.tareas = proyectoActualizado.tareas.map(
				(tareaState) =>
					tareaState._id === tarea._id ? tarea : tareaState,
			);
			setProyecto(proyectoActualizado);
		}
	};
	const cerrarSesionProyectos = () => {
		setProyecto({});
		setProyectos([]);
		setAlerta({});
	};
	return (
		<ProyectoContext.Provider
			value={{
				proyectos,
				mostrarAlerta,
				alerta,
				setAlerta,
				submitProyecto,
				obtenerProyecto,
				proyecto,
				cargando,
				eliminarProyecto,
				handleModalTarea,
				modalFormularioTarea,
				submitTarea,
				handleModalEditarTarea,
				tarea,
				handleModalEliminarTarea,
				modalEliminarTarea,
				eliminarTarea,
				submitColaborador,
				colaborador,
				agregarColaborador,
				handleModalEliminarColaborador,
				modalEliminarColaborador,
				eliminarColaborador,
				completarTarea,
				handleBuscador,
				buscador,
				submitTareasProyecto,
				submitEliminarTareas,
				submitEditarTareas,
				submitCompletarTareas,
				cerrarSesionProyectos,
			}}
		>
			{children}
		</ProyectoContext.Provider>
	);
};

export { ProyectosProvider };
export default ProyectoContext;
