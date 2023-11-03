import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { getUserData, putUser } from "../api/user/user.ts";
import { UserDataType } from "../types.ts";
import router from "../router.ts";

export enum LoginStatus {
  Success = "登錄成功",
  EmailError = "信箱錯誤",
  PasswordError = "密碼錯誤",
}

export const useUserStore = defineStore("user", () => {
  const storedUser = localStorage.getItem("user");
  const data = ref<UserDataType | null>();
  if (storedUser) {
    data.value = JSON.parse(storedUser);
  } else {
    data.value = null;
  }

  const isLogin = computed<boolean>(() => (data.value ? true : false));
  const loggingStatus = ref<LoginStatus | undefined>();

  async function login(email: string, password: string) {
    try {
      const responseData = await getUserData(email);
      
      if (responseData.value) {
        const userData = ref<UserDataType>(responseData.value);
        console.log(responseData.value, password);
        
        if (userData) {
          if (userData.value.password === password) {
            data.value = userData.value;
            loggingStatus.value = LoginStatus.Success;
            localStorage.setItem("user", JSON.stringify(data.value));
            console.log(isLogin);
            
          } else {
            alert("請輸入正確密碼");
            loggingStatus.value = LoginStatus.PasswordError;
          }
        } else {
          alert("請輸入正確信箱");
          loggingStatus.value = LoginStatus.EmailError;
        }
      }
    } catch (err) {
      console.error("getUserData取得資料失敗: ", err);
    }
  }

  function logout() {
    localStorage.removeItem("user");
    data.value = null;
    router.push({ name: "Articles" });
  }

  function getData() {
    if (isLogin.value) {
      return data.value;
    } else {
      return null;
    }
  }

  function getId() {
    if (isLogin.value && data.value) {
      return data.value._id;
    } else {
      return null;
    }
  }

  async function updateUser(updatedData: UserDataType) {
    try {
      await putUser(updatedData);
      if (data.value) {
        const responseData = await getUserData(data.value.email);
        if (responseData.value) {
          const userData = ref<UserDataType>(responseData.value);
          data.value = userData.value;
          localStorage.setItem("user", JSON.stringify(data.value));
        }
      }
    } catch (err) {
      console.error("getUserData取得資料失敗: ", err);
    }
  }

  return {
    data,
    isLogin,
    loggingStatus,
    getData,
    getId,
    login,
    logout,
    updateUser
  };
});
