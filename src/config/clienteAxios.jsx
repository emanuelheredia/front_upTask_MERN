import axios from "axios";

const clienteAxios = axios.create({
	baseURL: `https://back-up-task.onrender.com/app`,
});
export default clienteAxios;
