import { apiClient } from "./axiosInstance";

export const ApiConfig = {
  index: "/user",
  getUser: (email:string) => `/user/${email}`,
};

export async function getUserData(email: string) {
  let responseData = null;
  const response = await apiClient.get(ApiConfig.getUser(email));
  responseData = response.data;
  return responseData;
}

export async function postUserData(postData: object) {
  const response = await apiClient.post(ApiConfig.index, postData);
  return response;
}
