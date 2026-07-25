import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api/students";

export const getStudents = () => {
    return axios.get(API_URL);
};

export const addStudent = (student) => {
    return axios.post(API_URL, student);
};

export const getStudentById = (id) => {
    return axios.get(`${API_URL}/${id}`);
};

export const updateStudent = (id, student) => {
    return axios.put(`${API_URL}/${id}`, student);
};

export const deleteStudent = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};
