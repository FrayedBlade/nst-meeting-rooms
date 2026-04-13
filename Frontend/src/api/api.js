import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // backend Spring Boot runs here
});

export default api;
