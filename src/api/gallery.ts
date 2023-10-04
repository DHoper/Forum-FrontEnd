import { apiClient } from "./axiosInstance";

export const ApiConfig = {
  index: '/photoPost',
}

export async function getGalleryData(id?:string) {
  let responseData = null;
  if(!id) {
    const response = await apiClient.get(ApiConfig.index);
    responseData = response.data;
  }else {
    const response = await apiClient.get(id);
    responseData = response.data;
  }
  return responseData;
}

