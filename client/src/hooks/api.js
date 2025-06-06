import axios from "axios";
export const api = axios.create({ baseURL: "http://web:8000/" });
