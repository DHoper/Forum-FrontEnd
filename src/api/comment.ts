import { apiClient } from "./axiosInstance";

export const ApiConfig = {
  index: "/comment",
  getComment: (id: string) => `/comment/${id}`,
};

export async function getComment(id: string) {
  try {
    const response = await apiClient.get(ApiConfig.getComment(id));
    return response.data;
  } catch (error) {
    console.error("獲取評論失敗，出現錯誤:", error);
    throw error;
  }
}

export async function postComment(commentData: object) {
  try {
    const response = await apiClient.post(ApiConfig.index, commentData);
    return response;
  } catch (error) {
    console.error("發布評論失敗，出現錯誤:", error);
    throw error;
  }
}

export async function deleteComment(id: string) {
  try {
    const response = await apiClient.delete(ApiConfig.getComment(id));
    return response;
  } catch (error) {
    console.error("刪除評論失敗，出現錯誤:", error);
    throw error;
  }
}
