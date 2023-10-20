import { apiClient } from "./axiosInstance";

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

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("API請求失敗，錯誤狀態:" + response.status);
    }
  } catch (error) {
    console.error("獲取所有照片牆貼文數據時發生錯誤：", error);
    throw error;
  }
}

export async function getPostData(id: string) {
  try {
    let response;
    response = await apiClient.get(ApiConfig.getSinglePost(id));
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("API請求失敗，錯誤狀態:" + response.status);
    }
  } catch (error) {
    console.error("獲取單筆照片牆貼文數據時發生錯誤：", error);
    throw error;
  }
}

export async function setStats(id: string, action: string) {
  try {
    let response;
    response = await apiClient.post(ApiConfig.setStats(id, action));
    if (response.status === 200) {
      return response;
    } else {
      throw new Error("API請求失敗，錯誤狀態:" + response.status);
    }
  } catch (error) {
    console.error("更新貼文統計數數據時發生錯誤：", error);
    throw error;
  }
}
