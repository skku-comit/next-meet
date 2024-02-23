import setterBtnTab from "@/styles/setterbtntab.module.css";
import { ReactNode, useState, useEffect } from "react";
import { IoMdLogIn } from "react-icons/io";

const className_button = 'w-2/4 p-6 py-3 text-white';
const Setter = (props:any): ReactNode => {
  const [isMember,setIsMember] = useState<boolean>(false);
  // const [isLogin, setIsLogin] = useState<boolean>(false);
  // const [idName, setIdName] = useState<String>("");
  const [pw, setPw] = useState<String>("");

  // props.setName(idName);
  const addTotalNum:Function = ()=>{
    // console.log("islogin", props.isLogin);
    !props.isLogin ? props.setTotalMem(props.totalMem+1):"";
  }

  return (
    <div className={`w-screen ${props.select ? "" : "pt-6"} ${props.width < 768 ? "px-10":"px-20"}`}>
      <div className="w-full flex flex-row items-center text-center">
        <button className={`${className_button} py-1 ${setterBtnTab.tab_btn} ${!isMember? 'bg-[#ffadad]' : 'bg-[#fddada]'}`}
          onClick={(e)=>{e.preventDefault();setIsMember(false); props.setIsLogin(false); props.setScheduleTable(true); props.setConfirm(false);}}>
        비회원
        </button>
        <button className={`${className_button} py-1 ${setterBtnTab.tab_btn} ${isMember? 'bg-[#ffadad]' : 'bg-[#fddada]'}`}
          onClick={(e)=>{e.preventDefault();setIsMember(true); props.setIsLogin(false); props.setScheduleTable(true); props.setConfirm(false);}}>
        회원
        </button>
      </div>
      <div className={`flex ${props.width <= 500 ? "flex-col" : "flex-row"} flex-nonwrap items-center text-center bg-[#ffadad] rounded-b-lg justify-center p-4 pt-2.5 overflow-hidden gap-0`}>
        {props.isLogin ? <div className="w-full"><div className="items-center">{props.name}</div></div> 
        : <div className={`flex ${props.width <= 500 ? "flex-col pb-0 justify-between" : "flex-row"} items-center justify-around gap-3 m-2 w-full overflow-hidden`}>
            <div className={`w-full ${props.width <= 500 ? "text-sm" : ""} flex flex-row items-center gap-3 justify-end overflow-hidden`}>
                <label className="text-center pt-1 min-w-[26px] whitespace-nowrap text-right">{isMember ? "ID":"이름"}</label>
                <input className={`${props.width <= 500 ? "" : ""} grow border-[1px] h-8 p-2 outline-none rounded min-w-0`} type='text' onChange={(e)=>{props.setName(e.target.value)}}/>
            </div>
            <div className={`w-full ${props.width <= 500 ? "text-sm" : ""} flex items-center gap-3 justify-end overflow-hidden`}>
                <label className="text-center pt-1 min-w-fit whitespace-nowrap text-right">{props.width < 786 ? "PW":"비밀번호"}</label>
                <input className={`${props.width <= 500 ? "" : ""} grow border-[1px] h-8 p-2 outline-none rounded min-w-0`} type='password' onChange={(e)=>{setPw(e.target.value)}}/>
            </div>
        </div>}
        <button className={`items-center ${setterBtnTab.login_btn} grow-0 bg-white rounded text-center p-1 m-2 mb-0 text-sm grow-0 ${props.width <= 500 ? "w-full mt-1":"mt-0 min-w-fit"} `}
          onClick={()=>{props.isLogin ? props.setScheduleTable(true) : props.setScheduleTable(false);
            props.isLogin ? props.setIsLogin(false) : props.setIsLogin(true); addTotalNum(); 
            props.isLogin ? props.setName(""):"";
            props.confirm == 1 ? props.setConfirm(2) : ""; 
          }}
        >{props.isLogin ? "로그아웃" : props.width <= 500 || props.width > 786 ? "로그인" : <IoMdLogIn className={`h-full w-8 h-25`} />}</button>
      </div>

    </div>
  );
};

export default Setter;
