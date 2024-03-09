enum FORM_INPUT_ERR {
  "NO_ERROR" = 0,
  "SHORT_NAME" = 3,
  "SHORT_ID",
  "SHORT_PW",
  "BAD_EMAIL_FORM",
  "INCORRECT_PW",
  "EMPTY_ID",
  "EMPTY_PW",
}
const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

const isFormValid = (
  mode: 'login' | 'register' | 'non-mem-login',
  loginID: string,
  userName: string,
  email: string,
  password: string,
  passwordCheck: string
): 0|3|4|5|6|7|8|9 => {
  //for login
  if (loginID.trim().length == 0) return FORM_INPUT_ERR.EMPTY_ID;
  if(mode == 'non-mem-login') return FORM_INPUT_ERR.NO_ERROR;
  if (password.trim().length == 0) return FORM_INPUT_ERR.EMPTY_PW;
  if(mode == 'login') return FORM_INPUT_ERR.NO_ERROR;
  
  //for register
  if (loginID.trim().length < 4) return FORM_INPUT_ERR.SHORT_ID;
  if (userName.trim().length < 1) return FORM_INPUT_ERR.SHORT_NAME;
  if (!email_regex.test(email)) return FORM_INPUT_ERR.BAD_EMAIL_FORM;
  if (password.trim().length < 4) return FORM_INPUT_ERR.SHORT_PW;
  if (password !== passwordCheck) return FORM_INPUT_ERR.INCORRECT_PW;
  return FORM_INPUT_ERR.NO_ERROR;
};

export default isFormValid;
