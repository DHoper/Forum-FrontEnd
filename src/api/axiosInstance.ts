import axios from "axios";
console.log(777);
export const apiClient = axios.create({
    baseURL: import.meta.env.FORUM_BACK_END_HOST,
});