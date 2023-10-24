import { apiClient } from "./axiosInstance";
import { NewPhotoPostType } from "../types.ts";

export const ApiConfig = {
  index: "/photoPost",
  getSinglePost: (id: string) => `photoPost/${id}`,
  setStats: (id: string, action: string) =>
    `/photoPost/${id}/statistics/${action}`,
};

export async function getGalleryData() {
  try {
    let response;

    response = await apiClient.get(ApiConfig.index);

    return response.data;
  } catch (error) {
    console.error("獲取所有照片牆貼文數據時發生錯誤：", error);
    throw error;
  }
}

export async function getPostData(id: string) {
  try {
    let response;
    response = await apiClient.get(ApiConfig.getSinglePost(id));
    return response.data;
  } catch (error) {
    console.error("獲取單筆照片牆貼文數據時發生錯誤：", error);
    throw error;
  }
}

export async function setStats(id: string, action: string) {
  try {
    let response;
    response = await apiClient.post(ApiConfig.setStats(id, action));
    return response;
  } catch (error) {
    console.error("更新貼文統計數數據時發生錯誤：", error);
    throw error;
  }
}

export async function createPost(postData: NewPhotoPostType) {
  try {
    const response = await apiClient.post(ApiConfig.index, postData);
    return response;
  } catch (error) {
    console.error("建立新貼文時發生錯誤：", error);
    throw error;
  }
}
