import axios from "axios";

const API = "http://localhost:5000";

export const register = (user) => axios.post(`${API}/auth/register`, user);
export const login = (user) => axios.post(`${API}/auth/login`, user);
export const getTodos = (token) => axios.get(`${API}/todos`, { headers: { Authorization: `Bearer ${token}` } });
export const addTodo = (title, token) => axios.post(`${API}/todos`, { title }, { headers: { Authorization: `Bearer ${token}` } });
export const toggleTodo = (id, token) => axios.put(`${API}/todos/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
export const deleteTodo = (id, token) => axios.delete(`${API}/todos/${id}`, { headers: { Authorization: `Bearer ${token}` } });
