import { apiClient } from "./axiosInstance";
import { CommunityPostType } from "../types.ts";
import { ref } from "vue";

export const ApiConfig = {
  index: "/communityPost",
  getSinglePost: (id: string) => `communityPost/${id}`,
  setStats: (id: string, action: string) =>
    `/communityPost/${id}/statistics/${action}`,
};

export async function getPostDataset() {
  try {
    const responseData = ref<CommunityPostType[]>();
    let response;

    response = await apiClient.get(ApiConfig.index);
    responseData.value= response.data;

    return responseData;
  } catch (error) {
    console.error("獲取所有社區貼文數據時發生錯誤：", error);
    throw error;
  }
}

export async function getPostData(id: string) {
  try {
    const responseData = ref<CommunityPostType>();
    let response;
    response = await apiClient.get(ApiConfig.getSinglePost(id));
    responseData.value = response.data;
    return responseData;
  } catch (error) {
    console.error("獲取單筆社區貼文數據時發生錯誤：", error);
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

export async function createPost(postData: CommunityPostType) {
  try {
    const response = await apiClient.post(ApiConfig.index, postData);
    return response;
  } catch (error) {
    console.error("建立新貼文時發生錯誤：", error);
    throw error;
  }
}
