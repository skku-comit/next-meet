// import { className_button } from "@/styles/button";
import { ReactNode, useRef, useState } from "react";
import LoginForm from "./LoginForm";
const className_button = "p-6 py-3 bg-[#ffadad] rounded-xl text-white";
const Login = (): ReactNode => {
  
  //useState
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [canRegister,setCanRegister] = useState<boolean>(false);
  //useRefs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const pwInputRef = useRef<HTMLInputElement>(null);
  const pwcInputRef = useRef<HTMLInputElement>(null);
  
  //functions
  const onLogin = () =>{
      
  }
  const onRegister = () =>{
    
  }

  return (
    <div className="w-screen p-20">
      {isLoggingIn && (
        <div className="flex flex-col items-center mb-10">
          <LoginForm 
            isRegistering={isRegistering} 
            nameRef={nameInputRef}
            idRef={idInputRef}
            emailRef={emailInputRef}
            pwRef={pwInputRef}
            pwcRef={pwcInputRef}/>
          <button className="mt-6 text-sm underline underline-offset-[6px] cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setIsRegistering((prev) => !prev);
            }}>
            {isRegistering ? "login" : "quick register"}
          </button>
        </div>
      )}
      <div className="flex flex-col items-center text-center gap-2">
        {isLoggingIn ? (
          <button className={`${className_button}`}
            onClick={isRegistering ? onRegister: onLogin}>
            {isRegistering ? "Register" : "Login"}</button>
        ) : (
          <>
            <p>or</p>
            <button  className={`${className_button} py-2`}
              onClick={(e) => {
                e.preventDefault();
                setIsLoggingIn(true);
              }}>
              Login
            </button>
            <p>to browse your events.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
