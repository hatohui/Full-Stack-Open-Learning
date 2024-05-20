import axios from "axios";
const baseUrl = 'http://localhost:3002/persons';

const getAll = () => axios.get(baseUrl).then(response => response.data)

const create = newObject => axios.post(baseUrl, newObject).then(response => response.data)

const update = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject);
    return request.then(response => response.data)
}

const remove = (id) => axios.delete(`${baseUrl}/${id}`).then(response => response.data)

export default {getAll, create, update, remove}