import { ReactNode, RefObject } from "react";

type LoginFormProps = {
    isRegistering:boolean;
    nameRef:RefObject<HTMLInputElement>
    idRef:RefObject<HTMLInputElement>
    emailRef:RefObject<HTMLInputElement>
    pwRef:RefObject<HTMLInputElement>
    pwcRef:RefObject<HTMLInputElement>
    resetError:()=>void
}

const LoginForm = ({isRegistering,nameRef,idRef,emailRef,pwRef,pwcRef,resetError}:LoginFormProps): ReactNode => {
  return (
    <div className="w-fit">
      <form className="flex flex-col items-end gap-4">
        {isRegistering && <div className="flex items-center gap-2">
            <label className="w-32 text-center">이름<br/>Name</label>
            <input className="border-[1px] py-1 indent-2 outline-none rounded-md" 
              type='text'
              ref={nameRef}
              onChange={resetError}></input>
          </div>}
        <div className="flex items-center gap-2">
          <label className="w-32 text-center">아이디<br/>ID</label>
          <input className="border-[1px] py-1 indent-2 indent outline-none rounded-md" 
          type='text'
          ref={idRef}
          onChange={resetError}></input>
        </div>
        {isRegistering && <div className="flex items-center gap-2">
          <label className="w-32 text-center">이메일<br/>Email</label>
          <input className="border-[1px] py-1 indent-2 outline-none rounded-md" 
          type='email'
          ref={emailRef}
          onChange={resetError}></input>
        </div>}
        <div className="flex items-center gap-2">
          <label className="w-32 text-center">비밀번호<br/>PW</label>
          <input className="border-[1px] py-1 indent-2 outline-none rounded-md" 
          type='password'
          ref={pwRef}
          onChange={resetError}></input>
        </div>
        {isRegistering && <div className="flex items-center gap-2">
          <label className="w-32 text-center">비밀번호 확인<br/>PW Check</label>
          <input className="border-[1px] py-1 indent-2 outline-none rounded-md" 
          type='password'
          ref={pwcRef}
          onChange={resetError}></input>
        </div>}
      </form>
    </div>
  );
};

export default LoginForm;
