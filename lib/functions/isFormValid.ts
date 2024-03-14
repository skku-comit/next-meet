import { NM_CODE } from "../msg/errorMessage";

const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

const isFormValid = (
  mode: 'login' | 'register' | 'non-mem-login',
  loginID: string,
  userName: string,
  email: string,
  password: string,
  passwordCheck: string
): NM_CODE => {
  //for login
  if (loginID.trim().length == 0) return NM_CODE.LOGIN_MISSING_ID;
  if(mode == 'non-mem-login') return NM_CODE.NO_ERROR;
  if (password.trim().length == 0) return NM_CODE.LOGIN_MISSING_PW;
  if(mode == 'login') return NM_CODE.NO_ERROR;
  
  //for register
  if (loginID.trim().length < 4) return NM_CODE.REGISTER_SHORT_ID;
  if (userName.trim().length < 1) return NM_CODE.REGISTER_SHORT_NAME;
  if (!email_regex.test(email)) return NM_CODE.REGISTER_BAD_EMAIL;
  if (password.trim().length < 4) return NM_CODE.REGISTER_SHORT_PW;
  if (password !== passwordCheck) return NM_CODE.REGISTER_INCONSISTENT_PW;
  return NM_CODE.NO_ERROR;
};

export default isFormValid;
