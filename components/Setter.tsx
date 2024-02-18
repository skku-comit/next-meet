import setterBtnTab from "@/styles/setterbtntab.module.css";
import { ReactNode, useState, useEffect } from "react";
import { IoMdLogIn } from "react-icons/io";

const className_button = 'w-2/4 p-6 py-3 text-white';
const Setter = (props:any): ReactNode => {
  const [isMember,setIsMember] = useState<boolean>(false);
  // const [isLogin, setIsLogin] = useState<boolean>(false);
  const [idName, setIdName] = useState<String>("");
  const [pw, setPw] = useState<String>("");

  props.setName(idName);
  const addTotalNum:Function = ()=>{
    // console.log("islogin", props.isLogin);
    !props.isLogin ? props.setTotalMem(props.totalMem+1):"";
  }

  return (
    <div className={`w-screen px-20 ${props.select ? "pt-20" : "pt-6"}`}>
      <div className="flex flex-row items-center text-center">
        <button className={`${className_button} py-1 ${setterBtnTab.tab_btn} ${!isMember? 'bg-[#ffadad]' : 'bg-[#fddada]'}`}
          onClick={(e)=>{e.preventDefault();setIsMember(false); props.setIsLogin(false);}}>
        비회원
        </button>
        <button className={`${className_button} py-1 ${setterBtnTab.tab_btn} ${isMember? 'bg-[#ffadad]' : 'bg-[#fddada]'}`}
          onClick={(e)=>{e.preventDefault();setIsMember(true); props.setIsLogin(false);}}>
        회원
        </button>
      </div>
      <div className="flex flex-row items-center text-center bg-[#ffadad] rounded-b-lg justify-center">
        {props.isLogin ? <div className="p-4"><div className="items-center pt-1.5">{idName}</div></div> : <form className={`p-4 flex flex-row items-center grow space-content-around gap-2`}>
            <div className="w-1/2 flex items-center gap-3 justify-center">
                <label className="text-center pt-1">{isMember ? "아이디":"이름"}</label>
                <input className="w-3/5 border-[1px] h-8 p-2 outline-none rounded" type='text' onChange={(e)=>{setIdName(e.target.value)}}></input>
            </div>
            <div className="w-1/2 flex items-center gap-3 justify-center">
                <label className="text-center pt-1">비밀번호</label>
                <input className="w-3/5 border-[1px] h-8 p-2 outline-none rounded" type='password' onChange={(e)=>{setPw(e.target.value)}}></input>
            </div>
        </form>}
        <button className={`items-center ${setterBtnTab.login_btn} grow bg-white rounded text-center p-1 m-2 mr-10 text-sm grow-0`}
          onClick={()=>{props.isLogin ? props.setIsLogin(false) : props.setIsLogin(true); addTotalNum(); 
            props.confirm == 1 ? props.setConfirm(2) : "";
          }}
        >{props.isLogin ? "로그아웃" : <IoMdLogIn className="w-full h-full" />}</button>
      </div>

    </div>
  );
};

export default Setter;
