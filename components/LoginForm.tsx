import { ReactNode, RefObject } from "react";

type LoginFormProps = {
    isRegistering:boolean;
    nameRef:RefObject<HTMLInputElement>
    idRef:RefObject<HTMLInputElement>
    pwRef:RefObject<HTMLInputElement>
    pwcRef:RefObject<HTMLInputElement>
}

const LoginForm = ({isRegistering,nameRef,idRef,pwRef,pwcRef}:LoginFormProps): ReactNode => {
  return (
    <div className="w-fit">
      <form className="flex flex-col items-end gap-4">
        {isRegistering && <div className="flex items-center gap-2">
            <label className="w-32 text-center">이름<br/>Name</label>
            <input className="border-[1px] py-1 indent-2 outline-none rounded-md" 
              type='text'
              ref={nameRef}></input>
          </div>}
        <div className="flex items-center gap-2">
          <label className="w-32 text-center">아이디<br/>ID</label>
          <input className="border-[1px] py-1 indent-2 indent outline-none rounded-md" 
          type='text'
          ref={idRef}></input>
        </div>
        <div className="flex items-center gap-2">
          <label className="w-32 text-center">비밀번호<br/>PW</label>
          <input className="border-[1px] py-1 indent-2 outline-none rounded-md" 
          type='password'
          ref={pwRef}></input>
        </div>
        {isRegistering && <div className="flex items-center gap-2">
          <label className="w-32 text-center">비밀번호 확인<br/>PW Check</label>
          <input className="border-[1px] py-1 indent-2 outline-none rounded-md" 
          type='password'
          ref={pwcRef}></input>
        </div>}
      </form>
    </div>
  );
};

export default LoginForm;
