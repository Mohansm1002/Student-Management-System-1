import axios from "axios";

const DEFAULT_BACKEND_URL = "https://student-management-system-1-pn1u.onrender.com";
const STUDENTS_API_PATH = "/api/students";

const resolveApiUrl = () => {
    const configuredUrl = import.meta.env.VITE_API_URL?.trim();

    if (!configuredUrl) {
        return import.meta.env.PROD
            ? `${DEFAULT_BACKEND_URL}${STUDENTS_API_PATH}`
            : STUDENTS_API_PATH;
    }

    const normalizedUrl = configuredUrl.replace(/\/+$/, "");

    if (normalizedUrl.endsWith(STUDENTS_API_PATH)) {
        return normalizedUrl;
    }

    if (normalizedUrl.endsWith("/api")) {
        return `${normalizedUrl}/students`;
    }

    return `${normalizedUrl}${STUDENTS_API_PATH}`;
};

const API_URL = resolveApiUrl();

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
