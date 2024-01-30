// import { className_button } from "@/styles/button";
import { ReactNode, useState } from "react";
import LoginForm from "./LoginForm";
const className_button = 'p-6 py-3 bg-[#ffadad] rounded-xl text-white';
const Login = (): ReactNode => {
  const [isLoggingIn,setIsLoggingIn] = useState<boolean>(false);
  const [isRegistering,setIsRegistering] = useState<boolean>(false);

  return (
    <div className="w-screen p-20">
      <div className="flex flex-col items-center text-center gap-2">
        <p>or</p>
        <button className={`${className_button} py-2`}
          onClick={(e)=>{e.preventDefault();setIsLoggingIn((prev)=>!prev)}}>Login</button>
        <p>to browse your events.</p>
      </div>

      {isLoggingIn && <div className="mt-20 flex flex-col items-center">
        <LoginForm isRegistering={isRegistering}/>
        <button className="mt-6 text-sm underline underline-offset-[6px] cursor-pointer"
          onClick={(e)=>{e.preventDefault();setIsRegistering((prev=>!prev))}}>{
          isRegistering ? 'login' : 'quick register'}</button>
      </div>}
    </div>
  );
};

export default Login;
