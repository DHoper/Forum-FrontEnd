import { UserData } from "../types";
import { apiClient } from "./axiosInstance";

export const ApiConfig = {
  index: "/user",
  getUser: (email: string) => `/user/${email}`,
  getAuthor: (authorId: string) => `/user/author/${authorId}`,
};

export async function checkRepeatEmail(email: string) {
  try {
    const response = await apiClient.get(ApiConfig.getUser(email));
    const checkResult = response.data ? true : false;

    return checkResult;
  } catch (error) {
    console.error("檢查信箱時發生錯誤:", error);
    throw error;
  }
}

export async function getUserData(email: string) {
  try {
    const response = await apiClient.get(ApiConfig.getUser(email));
    return response.data;
  } catch (error) {
    console.error("獲取使用者資料時發生錯誤:", error);
    throw error;
  }
}

export async function getAuthor(authorId: string) {
  try {
    const response = await apiClient.get(ApiConfig.getAuthor(authorId));

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("API請求失敗，錯誤狀態:" + response.status);
    }
  } catch (error) {
    console.error("獲取作者資料時發生錯誤:", error);
    throw error;
  }
}

export async function postUserData(postData: object) {
  try {
    const response = await apiClient.post(ApiConfig.index, postData);
    return response;
  } catch (error) {
    console.error("註冊新用戶資料時發生錯誤:", error);
    throw error;
  }
}

export async function updateUser(updatedData: UserData) {
  try {
    const response = await apiClient.put(`/user`, updatedData);
    return response;
  } catch (error) {
    throw error;
  }
}
