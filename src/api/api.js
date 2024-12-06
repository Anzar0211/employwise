import axios from "axios";

const API = axios.create({ baseURL: "https://reqres.in/api" });

export const login = (data) => API.post("/login", data);
export const register=(data)=>API.post("/register",data);
export const fetchUsers = (page) => API.get(`/users?page=${page}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);
