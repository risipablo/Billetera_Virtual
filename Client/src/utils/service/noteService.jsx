import axios from "axios";
import { config } from "../../component/variables/config";

const serverFront = config.apiUrl;

const getNotes = async () => {
    const token = localStorage.getItem('token');
    return axios.get(`${serverFront}/api/note`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true,
    });
};

const addNote = async (noteData) => {
    const token = localStorage.getItem('token');
    return axios.post(`${serverFront}/api/note`, noteData, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true,
    });
};

const deleteNote = async (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${serverFront}/api/note/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        withCredentials: true,
    });
};

const editNote = async (id, newData) => {
    const token = localStorage.getItem('token');
    return axios.patch(`${serverFront}/api/note/${id}`, newData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export { getNotes, addNote, deleteNote, editNote };