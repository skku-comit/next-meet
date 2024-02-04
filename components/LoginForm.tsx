import { ReactNode } from "react";

type LoginFormProps = {
    isRegistering:boolean;
}

const LoginForm = ({isRegistering}:LoginFormProps): ReactNode => {
  return (
    <div className="w-fit">
      <form className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <label className="w-28 text-center">ID</label>
          <input className="border-[1px] h-8 p-2 outline-none" type='text'></input>
        </div>
        <div className="flex items-center gap-2">
          <label className="w-28 text-center">PW</label>
          <input className="border-[1px] h-8 p-2 outline-none" type='password'></input>
        </div>
        {isRegistering && <div className="flex items-center gap-2">
          <label className="w-28 text-center">PW Check</label>
          <input className="border-[1px] h-8 p-2 outline-none" type='password'></input>
        </div>}
      </form>
    </div>
  );
};

export default LoginForm;
