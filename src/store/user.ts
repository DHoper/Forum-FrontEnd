import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getUserData } from "../api/user";
import { UserData } from "../types.ts";

export enum LoginStatus {
  Success = "登錄成功",
  EmailError = "信箱錯誤",
  PasswordError = "密碼錯誤",
}

export const useUserStore = defineStore("user", () => {
  const storedUser = localStorage.getItem("user");
  const data = ref<UserData | null>();
  if (storedUser) {
    data.value = JSON.parse(storedUser);
  } else {
    data.value = null;
  }

  const isLogin = computed<boolean>(() => (data.value ? true : false));
  const loggingStatus = ref<LoginStatus | undefined>();

  async function login(email: string, password: string) {
    try {
      const dataResponse = await getUserData(email);

      if (dataResponse) {
        if (dataResponse.password === password) {
          data.value = dataResponse;
          loggingStatus.value = LoginStatus.Success;
          localStorage.setItem("user", JSON.stringify(data.value));
        } else {
          alert("請輸入正確密碼");
          loggingStatus.value = LoginStatus.PasswordError;
        }
      } else {
        alert("請輸入正確信箱");
        loggingStatus.value = LoginStatus.EmailError;
      }
    } catch (err) {
      console.log("getUserData取得資料失敗: ", err);
    }
  }

  function logout() {
    localStorage.removeItem("user");
    data.value = null;
  }

  function getData() {
    if (isLogin.value) {
      return data.value;
    } else {
      return null;
    }
  }

  return {
    data,
    isLogin,
    loggingStatus,
    getData,
    login,
    logout,
  };
});
