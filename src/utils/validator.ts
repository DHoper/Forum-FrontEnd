import { ref } from "vue";
import { checkRepeatEmail } from "../api/user";

////UserData驗證
export type FieldName = "email" | "username" | "password" | "passwordConfirm";
export const userDataInputValidator = () => {
  interface FormInputType {
    email: string;
    username: string;
    password: string;
    passwordConfirm: string;
    selectedAvatarIndex: number;
    intro?: string;
  }

  interface FormInputInvalidType {
    email: {
      valid: boolean;
      registered: boolean;
    };
    username: boolean;
    password: boolean;
    passwordConfirm: boolean;
    intro?: string;
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
    fieldName: FieldName | "all",
    formInput: FormInputType
  ) {
    if (fieldName != "all") {
      let isValid = true;
      let emailRepeatCheck = false;

      let value = formInput[fieldName];

      if (value.trim() === "") {
        isValid = false;
      }

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
          let totalWeight = 0;
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
        default:
          break;
      }

      if (fieldName === "email") {
        formInputInvalid.value.email.valid = isValid;
        formInputInvalid.value.email.registered = emailRepeatCheck;
      } else {
        formInputInvalid.value[fieldName] = isValid;
      }
    } else {
      const allValidate: FieldName[] = [
        "username",
        "password",
        "passwordConfirm",
      ];

      for (const field of allValidate) {
        validate(field, formInput);
      }
    }
  }

  return { formInputInvalid, validate };
};
