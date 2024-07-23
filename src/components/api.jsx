// src/api.js
import axios from 'axios';

const apiUrl = 'http://localhost:3000';

export const fetchStudents = () => axios.get(`${apiUrl}/students`);
export const createStudent = (student) => axios.post(`${apiUrl}/students`, student);
export const updateStudent = (id, student) => axios.put(`${apiUrl}/students/${id}`, student);
export const deleteStudent = (id) => axios.delete(`${apiUrl}/students/${id}`);

export const fetchTeachers = () => axios.get(`${apiUrl}/teachers`);
export const createTeacher = (teacher) => axios.post(`${apiUrl}/teachers`, teacher);
export const updateTeacher = (id, teacher) => axios.put(`${apiUrl}/teachers/${id}`, teacher);
export const deleteTeacher = (id) => axios.delete(`${apiUrl}/teachers/${id}`);
