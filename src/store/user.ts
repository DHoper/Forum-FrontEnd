import { defineStore } from "pinia";
import { ref } from "vue";
import { getUserData } from "../api/user";

export enum LoginStatus {
  Success = "登錄成功",
  EmailError = "信箱錯誤",
  PasswordError = "密碼錯誤",
}

export const useUserStore = defineStore("user", () => {
  const isLogin = ref<boolean>(false);

  const storedUser = localStorage.getItem("user");
  const userData = ref(storedUser ? JSON.parse(storedUser) : null);
  
  const loggingStatus = ref<LoginStatus | undefined>();

  async function login(email: string, password: string) {
    try {
      const userDataResponse = await getUserData(email);
      userData.value = userDataResponse;
    } catch (err) {
      console.log("getUserData取得資料失敗: ", err);
    }

    if (userData.value) {
      if (userData.value.password === password) {
        isLogin.value = true;
        loggingStatus.value = LoginStatus.Success;
        localStorage.setItem("user", JSON.stringify(userData.value));
      } else {
        alert("請輸入正確密碼");
        loggingStatus.value = LoginStatus.PasswordError;
      }
    } else {
      alert("請輸入正確信箱");
      loggingStatus.value = LoginStatus.EmailError;
    }
  }

  return {
    isLogin,
    loggingStatus,
    userData,
    login,
  };
});
