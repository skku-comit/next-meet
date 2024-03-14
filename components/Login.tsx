"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import LoginForm from "./LoginForm";
import { existingUserCheck, registerEmail } from "@/lib/functions/CRUD";
import isFormValid from "@/lib/functions/isFormValid";
import { signIn  } from "next-auth/react";
import { useRecoilValue } from "recoil";
import { language } from '../lib/recoil/language';
import { NM_CODE, NM_MSG_ENG, NM_MSG_KOR } from "@/lib/msg/errorMessage";

const className_button = "w-60 p-6 py-3 bg-[#ffadad] rounded-xl text-white";

const Login = (): ReactNode => {

  //language
  const lang = useRecoilValue(language);
  
  //useState
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  //useRefs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const pwInputRef = useRef<HTMLInputElement>(null);
  const pwcInputRef = useRef<HTMLInputElement>(null);
  //useEffects

  //functions
  const resetForm = () => {
    if (
      !(
        nameInputRef.current &&
        idInputRef.current &&
        pwInputRef.current &&
        emailInputRef.current &&
        pwcInputRef.current
      )
    )
      return;

    nameInputRef.current.value = "";
    idInputRef.current.value = "";
    emailInputRef.current.value = "";
    pwInputRef.current.value = "";
    pwcInputRef.current.value = "";
  };

  const onLoginHandler = async () => {
    setError('');
    if (!(idInputRef.current && pwInputRef.current)) return;
    const loginID = idInputRef.current.value;
    const password = pwInputRef.current.value;

    let errorNo = isFormValid("login", loginID, "", "", password, "");
    if (errorNo !== 0) {
      setError( NM_MSG_KOR[NM_CODE.NO_ERROR] );
      return;
    }
    try {
      const res = await signIn("credentials", {
        loginID,
        password,
        redirect: false,
      });
      if (res && +res.error! != 0) {
        setError(lang==='ko' ? NM_MSG_KOR[NM_CODE.LOGIN_FAILED] : NM_MSG_ENG[NM_CODE.LOGIN_FAILED]);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  const onRegisterEmailHandler = async () => {

    if (!(
        nameInputRef.current &&
        idInputRef.current &&
        pwInputRef.current &&
        emailInputRef.current &&
        pwcInputRef.current)) return;

    setError(NM_MSG_KOR[0]);
    const userName = nameInputRef.current.value;
    const loginID = idInputRef.current.value;
    const email = emailInputRef.current.value;
    const password = pwInputRef.current.value;
    const passwordCheck = pwcInputRef.current.value;

    //test input validity
    let errorCode = isFormValid(
      "register",
      loginID,
      userName,
      email,
      password,
      passwordCheck
    );
    if (errorCode !== 0) {
      setError(lang==='ko' ? NM_MSG_KOR[errorCode] : NM_MSG_ENG[errorCode]);
      return;
    }
    // try {
    //   const errorNo = await existingUserCheck(loginID!, email!);
    //   if (errorNo !== 0) {
    //     setError(ERROR_MESSAGE[errorNo as 1 | 2]);
    //     return;
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
    const registerStatus: NM_CODE = await registerEmail(userName, loginID, email, password);
    if(registerStatus !== 0){ //error
      setError(lang==='ko' ? NM_MSG_KOR[registerStatus] : NM_MSG_ENG[registerStatus])
      return;
    }
    await registerEmail(userName, loginID, email, password);
    resetForm();
    setIsRegistering(false);
    setError(lang==='ko' ? NM_MSG_KOR[NM_CODE.REGISTER_SUCCESS] : NM_MSG_ENG[NM_CODE.REGISTER_SUCCESS]);
  };

  return (
    <div className="w-screen">
      {isLoggingIn && (
        <div className="flex flex-col items-center mb-10">
          <p className="h-4 m-4 text-md text-red-400">{error}</p>
          <LoginForm
            isRegistering={isRegistering}
            nameRef={nameInputRef}
            idRef={idInputRef}
            emailRef={emailInputRef}
            pwRef={pwInputRef}
            pwcRef={pwcInputRef}
            resetError={() => setError("")}
          />
          <button
            className="mt-6 text-sm underline underline-offset-[6px] cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setIsRegistering((prev) => !prev);
            }}
          >
            {isRegistering ? "back to login" : "quick register"}
          </button>
        </div>
      )}
      <div className="flex flex-col items-center text-center gap-3">
        {isLoggingIn ? (
          <button
            className={`${className_button}`}
            onClick={isRegistering ? onRegisterEmailHandler : onLoginHandler}
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        ) : (
          <>
            <p>{lang === 'ko' ? '또는' : 'or'}</p>
            <button
              className={`${className_button} py-2`}
              onClick={(e) => {
                e.preventDefault();
                setIsLoggingIn(true);
              }}>
              {lang === 'ko' ? '이메일로 로그인' : 'Login with email'}
            </button>
          </>
        )}
        <button
          className={`${className_button} py-2`}
          onClick={(e) => {
            e.preventDefault();
            // console.log('currentEvent: ',currentEventState);
            signIn("google", { callbackUrl: '/' }, { prompt: "select_account" });
          }}>
          {lang === 'ko' ? '구글로 로그인' : 'Login with google'}
        </button>
        <p>{lang === 'ko' ? '하여 이벤트를 둘러보세요.' : 'to browse your events.'}</p>
        {/* <button
          className={`${className_button} py-2`}
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}>
          로그아웃
        </button> */}
      </div>
    </div>
  );
};

export default Login;
