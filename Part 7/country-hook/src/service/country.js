import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/name/";

export const fetchByName = async (name) => {
  const response = await axios.get(`${baseUrl}${name}`);
  return response.data;
};
