import axios from "axios";
export const apiClient = axios.create({
    baseURL: import.meta.env.FORUM_BACK_END_HOST,
});