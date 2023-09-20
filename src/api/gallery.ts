import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3000/",
});


export async function getLevelOneData(url) {
  let responseData = null;
  const response = await apiClient.get(url);
  responseData = response.data;

  return responseData;
}

export async function getLevelTwoData(url, id) {
  let responseData = null;
  const response = await apiClient.get(url + id);
  responseData = response.data;

  return responseData;
}

