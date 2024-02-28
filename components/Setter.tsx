import getID from "@/lib/functions/getID";
import isFormValid from "@/lib/functions/isFormValid";
import setterBtnTab from "@/styles/setterbtntab.module.css";
import { User, NextMeetUser } from "@/template/User";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ReactNode, useState, useEffect, useRef } from "react";
import { IoMdLogIn } from "react-icons/io";

const className_button = 'w-2/4 p-6 py-3 text-white';
const Setter = (props:any): ReactNode => {
  const [isMember,setIsMember] = useState<boolean>(false);
  // const [isLogin, setIsLogin] = useState<boolean>(false);
  // const [idName, setIdName] = useState<String>("");
  const [pw, setPw] = useState<String>("");
  const nameIdInputRef = useRef<HTMLInputElement>(null);
  const pwInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const params = useSearchParams();
  const eventID = params.get('id');

  // props.setName(idName);
  // const addTotalNum:Function = ()=>{
  //   // console.log("islogin", props.isLogin);
  //   !props.isLogin ? props.setTotalMem(props.totalMem+1):"";
  // }

  const ERROR_MESSAGE = {
    0: "",
    1: "동일한 아이디가 존재합니다.",
    2: "동일한 이메일이 존재합니다.",
    3: "비밀번호가 일치하지 않습니다.",
    4: "아이디를 입력하세요.",
    5: "비밀번호를 입력하세요.",
    6: "아이디 혹은 비밀번호가 틀렸습니다.",
  };

  const onMemLoginHandler = async () => {
    if (!(nameIdInputRef.current && pwInputRef.current)) return;
    const loginID = nameIdInputRef.current.value;
    const password = pwInputRef.current.value;

    let errorNo = isFormValid("login", loginID, "", "", password, "");
    if (errorNo !== 0) {
      setError(ERROR_MESSAGE[errorNo as 4 | 5]);
      return;
    }
    try {
      if (loginID == props.eventHost.userName && password == props.eventHost.password){
        props.setIsHost(true);
      }

      const res = await signIn("credentials", {
        loginID,
        password,
        redirect: false,
      });
      if (res && +res.error! != 0) {
        setError(ERROR_MESSAGE[6]);
      }

      const res2 = await fetch('api/form',{
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body : JSON.stringify({      
          eventID, loginID
        })
      });

      console.log(res2)
    } catch (error) {
      console.error("error:", error);
    }
  };

  const onNonMemLoginHandler = ()=>{
    if (!(nameIdInputRef.current && pwInputRef.current)) return;
    const loginName = nameIdInputRef.current.value;
    const password = pwInputRef.current.value;

    let errorNo = isFormValid("non-mem-login", loginName, "", "", password, "");
    if (errorNo !== 0) {
      setError(ERROR_MESSAGE[errorNo as 4 | 5]);
      return;
    }
    try {
      if (loginName == props.eventHost.userName && password == props.eventHost.password){
        props.setIsHost(true);
      }
      const existedUser = props.eventUsers.filter((eventUser: User|NextMeetUser) => loginName == eventUser.userName && password == eventUser.password)
      if(existedUser){
        props.setLoginNonMem(existedUser);
      }
      else{
        const newUserId = getID(2);
        const newNonMem:User = {userID: newUserId,
          userName: loginName,
          password: password};
        props.setLoginNonMem(newNonMem);
      }
      props.setNonMemLogin(true);
    } catch (error) {
      console.error("error:", error);
    }
  }

  return (
    <div className={`w-screen mt-6 ${props.width < 768 ? "px-10":"px-20"}`}>
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
      <div className={`flex ${props.width <= 500 ? "flex-col" : "flex-row"} flex-nonwrap items-center text-center bg-[#ffadad] rounded-b-lg justify-center p-4 overflow-hidden gap-0`}>
        {props.isLogin ? props.name ? <div className="w-full"><div className="items-center pt-1.5">{props.name}</div></div> : ""
        : <div className={`flex ${props.width <= 500 ? "flex-col pb-0 justify-between" : "flex-row"} items-center justify-around gap-3 m-2 w-full overflow-hidden`}>
            <div className={`w-full ${props.width <= 500 ? "text-sm" : ""} flex flex-row items-center gap-3 justify-end overflow-hidden`}>
                <label className="text-center pt-1 min-w-[26px] whitespace-nowrap text-right">{isMember ? "ID":"이름"}</label>
                <input className={`${props.width <= 500 ? "" : ""} grow border-[1px] h-8 p-2 outline-none rounded min-w-0`} type='text' 
                  ref={nameIdInputRef}
                  onChange={(e)=>{props.setName(e.target.value)}}/>
            </div>
            <div className={`w-full ${props.width <= 500 ? "text-sm" : ""} flex items-center gap-3 justify-end overflow-hidden`}>
                <label className="text-center pt-1 min-w-fit whitespace-nowrap text-right">{props.width < 786 ? "PW":"비밀번호"}</label>
                <input className={`${props.width <= 500 ? "" : ""} grow border-[1px] h-8 p-2 outline-none rounded min-w-0`} type='password' 
                  ref={pwInputRef}
                  onChange={(e)=>{setPw(e.target.value)}}/>
            </div>
        </div>}
        <button className={`items-center ${setterBtnTab.login_btn} grow-0 bg-white rounded text-center p-1 pt-1.5 m-2 mb-0 text-sm grow-0 ${props.width <= 500 ? "w-full mt-1":"mt-0 min-w-fit"} `}
          onClick={()=>{
            if(props.isLogin){
              props.setScheduleTable(true);
              props.setIsLogin(false);
              props.setName("")
              props.setIsHost(false);
              props.setLoginNonMem(undefined);
              props.setNonMemLogin(false)
            }
            else{
              props.setScheduleTable(false);
              props.setIsLogin(true);
              isMember ? onMemLoginHandler():onNonMemLoginHandler()
            }
            props.confirm == 1 ? props.setConfirm(2) : "";
            // props.isLogin ? props.setScheduleTable(true) : props.setScheduleTable(false);
            // props.isLogin ? props.setIsLogin(false) : props.setIsLogin(true);  
            // props.isLogin ? props.setName(""):"";
            // !props.isLogin ? isMember ? onMemLoginHandler():onNonMemLoginHandler():props.setIsHost(false);
            // props.isLogin ? props.setNonMemLogin(false) : "";
          }}
        >{props.isLogin ? "로그아웃" : props.width <= 500 || props.width > 786 ? "로그인" : <IoMdLogIn className={`h-full w-8 h-25`} />}</button>
      </div>

    </div>
  );
};

export default Setter;

