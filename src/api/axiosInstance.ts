import axios from "axios";
export const apiClient = axios.create({
    baseURL: 'https://wildlensapi.zeabur.app/',
});