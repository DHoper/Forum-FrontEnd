import { ref } from "vue";
import { checkRepeatEmail } from "../api/user";

////UserData驗證
export type FieldName =
  | "email"
  | "username"
  | "password"
  | "passwordConfirm"
  | "title"
  | "content";
export const inputValidator = () => {
  interface FormInputType {
    email?: string;
    username?: string;
    password?: string;
    passwordConfirm?: string;
    intro?: string;
    title?: string;
    content?: string;
  }

  interface FormInputInvalidType {
    email: {
      valid: boolean;
      registered: boolean;
    };
    username: boolean;
    password: boolean;
    passwordConfirm: boolean;
    intro?: boolean;
    title?: boolean;
    content?: boolean;
  }
  const formInputInvalid = ref<FormInputInvalidType>({
    email: {
      valid: true,
      registered: false,
    },
    username: true,
    password: true,
    passwordConfirm: true,
  });

  async function validate(
    fieldName: FieldName | "UserData",
    formInput: FormInputType
  ) {
    if (fieldName === "UserData") {
      const UserDataValidate: FieldName[] = [
        "username",
        "password",
        "passwordConfirm",
      ];

      for (const field of UserDataValidate) {
        validate(field, formInput);
      }
    } else {
      let isValid = true;
      let emailRepeatCheck = false;

      let value = formInput[fieldName];

      if (!value || value.trim() === "") {
        isValid = false;
        value = "";
      }

      let totalWeight = 0;
      switch (fieldName) {
        case "email":
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          if (!emailRegex.test(value)) {
            isValid = false;
          } else {
            isValid = true;
          }
          const isEmailDuplicate = await checkRepeatEmail(value);
          if (isEmailDuplicate) {
            emailRepeatCheck = true;
          } else {
            emailRepeatCheck = false;
          }
          break;
        case "username":
          for (const char of value) {
            if (/[\u4e00-\u9fa5]/.test(char)) {
              totalWeight += 2;
            } else if (/^[A-Za-z0-9]+$/.test(char)) {
              totalWeight += 1;
            } else {
              totalWeight += 15;
            }
          }

          if (totalWeight < 4 || totalWeight > 15) {
            isValid = false;
          }
          break;

        case "password":
          if (value.length < 6 || value.length > 15) {
            isValid = false;
          }
          break;

        case "passwordConfirm":
          if (value !== formInput.password) {
            isValid = false;
          }
          break;
        case "title":
          for (const char of value) {
            if (/[\u4e00-\u9fa5]/.test(char)) {
              totalWeight += 2;
            } else if (/^[A-Za-z0-9]+$/.test(char)) {
              totalWeight += 1;
            } else {
              totalWeight += 41;
            }
          }

          if (totalWeight < 10 || totalWeight > 40) {
            isValid = false;
          }
          break;
        case "content":
          for (const char of value) {
            if (/[\u4e00-\u9fa5]/.test(char)) {
              totalWeight += 2;
            } else if (/^[A-Za-z0-9]+$/.test(char)) {
              totalWeight += 1;
            } else {
              totalWeight += 801;
            }
          }

          if (totalWeight < 40 || totalWeight > 800) {
            isValid = false;
          }
          break;
        default:
          break;
      }

      if (fieldName === "email") {
        formInputInvalid.value.email.valid = isValid;
        formInputInvalid.value.email.registered = emailRepeatCheck;
      } else {
        formInputInvalid.value[fieldName] = isValid;
      }
    }
  }

  return { formInputInvalid, validate };
};
