import axios from "axios";

// Set up axios instance
const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Add Axios interceptor to attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Users API
export const getUsers = () => API.get("/users");
export const createUser = (userData) => API.post("/users", userData);

// Patients API
export const getPatients = () => API.get("/patients");
export const createPatient = (patient) => API.post("/patients", patient);
export const getAllPatients = () => API.get("/patients");

// To-Dos API
export const getTodos = () => API.get("/todos");
export const createTodo = (todoData) => API.post("/todos", todoData);
export const updateTodo = (id, todoData) => API.put(`/todos/${id}`, todoData);
export const deleteTodo = (id) => API.delete(`/todos/${id}`);
export const fetchFilteredTodos = (filters) =>
  API.get("/todos/filters", { params: filters });

// Authentication API
export const login = (email, password) =>
  API.post("/login", { email, password });

export const register = (name, email, password) =>
  API.post("/users", { name, email, password });

export default API;
