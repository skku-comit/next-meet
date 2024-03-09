

import { addRemoveUserEventID, postUser } from "@/lib/functions/CRUD";
import getID from "@/lib/functions/getID";
import isFormValid from "@/lib/functions/isFormValid";
import setterBtnTab from "@/styles/setterbtntab.module.css";
import { Participate } from "@/template/Participate";
import { User, NextMeetUser } from "@/template/User";
import { getServerSession } from "next-auth";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { ReactNode, useState, useEffect, useRef } from "react";
import { IoMdLogIn } from "react-icons/io";
import { language } from '../lib/recoil/Language';
import { useRecoilState } from "recoil";

const className_button = 'w-2/4 p-6 py-3 text-white';
const Setter = (props:any): ReactNode => {
  const { data: session } = useSession();
  console.log( "session", session );

  const [lang, setLang] = useRecoilState(language);

  const [isMember,setIsMember] = useState<boolean>(session && session.user ? true : false);
  const [loginMode,setLoginMode] = useState<'nonMember'|'Email'|'social'>('nonMember');
  useEffect(()=>{if(props.isLogin){setIsMember(session && session.user ? true : false)}},[props.isLogin])
  // const [isLogin, setIsLogin] = useState<boolean>(false);
  // const [idName, setIdName] = useState<String>("");
  const [pw, setPw] = useState<String>("");
  const nameIdInputRef = useRef<HTMLInputElement>(null);
  const pwInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const eventID = router.query['id'];
  console.log("eventID",eventID);

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
    console.log("memLogin errorNo")
    if (errorNo !== 0) {
      setError(ERROR_MESSAGE[errorNo as 4 | 5]);
      return;
    }
    try {
      console.log("memLogin login");
      const res = await signIn("credentials", {
        loginID,
        password,
        redirect: false,
      });

      if (res && +res.error! != 0) {
        setError(ERROR_MESSAGE[6]);
      }
      
      let session: any = await getSession();

      console.log("res", res);
      console.log( "Ssession", session );
      console.log("Ssession user", session?.user);

      if(res?.error){
        setIsMember(false);
        nameIdInputRef.current.value = "";
        pwInputRef.current.value = "";
        throw new Error("there isn't any matching user.")
      }
      props.setName(session?.user.userName);
      setIsMember(true);

      // console.log("signin", isMember, props.name, session);

      const res2 = await addRemoveUserEventID(parseInt(eventID as string), session.user, "addEvent");

      const data = await res2.json();

      console.log("put data", data.data);

      if (data.data[0] == props.eventHost.userID){
        props.setIsHost(true);
      }

      // const existedUser = props.eventUsers ? props.eventUsers.filter((eventUser: User|NextMeetUser) => eventUser as NextMeetUser ? data.userID == eventUser.userID : false) : false;
      // if(!(existedUser.length > 0)){
      //   console.log("increased total mem")
      //   props.setTotalMem((prev:number)=>(prev+1));
      // }
      // const user = existedUser.length > 0 ? existedUser[0] : null;
      // console.log("props.eventParti", props.eventParti)
      // const eventParticipate = props.eventParti.length > 0 ? props.eventParti.filter((participate:Participate) =>{ 
      //       for(let i = 0; i<participate.user.length; i++){
      //           console.log("eventParticiTime put v", participate.user, user?.userID)
      //           if(participate.user[i].userID == user?.userID){
      //               return true;
      //           }
      //       }
      //       return false}) : null;
      // const eventParticiTime = {schedule : eventParticipate ? eventParticipate.map((participate:Participate)=>(participate.time)) : [] }
      // console.log("eventParticiTime put",eventParticiTime,eventParticipate)
      // props.setSchedule(eventParticiTime);
      // props.setPreMySelected(eventParticiTime.schedule);
    } catch (error) {
      console.error("error:", error);
    }
  };

  const onNonMemLoginHandler = async ()=>{
    if (!(nameIdInputRef.current)) return;
    const loginName = nameIdInputRef.current.value;
    const password = pwInputRef.current ? pwInputRef.current.value : "";
    let user:User;
    console.log("input",loginName, password);

    let errorNo = isFormValid("non-mem-login", loginName, "", "", password, "");
    console.log("nonMem", errorNo)
    if (errorNo !== 0) {
      setError(ERROR_MESSAGE[errorNo as 4]);
      return;
    }
    try {
      if (props.eventHost.userID == 0 && loginName == props.eventHost.userName && password == props.eventHost.password){
        props.setIsHost(true);
      }
      const existedUser = props.eventUsers && props.eventUsers.length > 0 ? props.eventUsers.filter((eventUser: User|NextMeetUser) => eventUser as User ? loginName == eventUser.userName && password == eventUser.password : false):[];
      console.log("existedUser", existedUser.length, props.eventUsers)
      if(existedUser.length > 0){
        props.setLoginNonMem(existedUser[0]);
        user = existedUser[0];
      }
      else{
        const newUserId = getID(2);
        const newNonMem:User = {userID: newUserId,
          userName: loginName,
          password: password};
        user = newNonMem;
        props.setLoginNonMem(newNonMem);
        console.log("newNonMem",newNonMem, user);
        // props.setTotalMem((prev:number)=>(prev+1));
        
        // await postUser(eventID, newNonMem);
        // const res = await fetch("../api/form", {
        //   method: "POST_USER",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({      
        //     eventID, newNonMem
        //   }),
        // });
        // console.log("post_user",res);
        // const data = await res.json();
        // console.log(data);
      }
      props.setIsLogin(true);
      props.setNonMemLogin(true);
      console.log("props.eventParti", props.eventParti)
      const eventParticipate = props.eventParti.length > 0 ? props.eventParti.filter((participate:Participate) =>{ 
            for(let i = 0; i<participate.user.length; i++){
                console.log("eventParticiTime v", participate.user, user?.userID)
                if(participate.user[i].userID == user?.userID){
                    return true;
                }
            }
            return false}) : null;
      const eventParticiTime = {schedule : eventParticipate ? eventParticipate.map((participate:Participate)=>(participate.time)) : [] }
      console.log("eventParticiTime",eventParticiTime,eventParticipate)
      props.setSchedule(eventParticiTime);
      props.setPreMySelected(eventParticiTime.schedule);
      console.log("done")

    } catch (error) {
      // console.error("error:", error);
      return null;
    }
  }
  console.log("isMember",isMember)

  return (
    <div className={`w-screen mt-6 ${props.width < 768 ? "px-10":"px-20"}`}>
      <div className="w-full flex flex-row items-center text-center">
        <button className={`${className_button} py-1 ${setterBtnTab.tab_btn} ${loginMode === 'nonMember' ? 'bg-[#ffadad]' : 'bg-[#fddada]'}`}
          onClick={(e)=>{
            e.preventDefault();
            setIsMember(false); 
            setLoginMode('nonMember');
            props.setScheduleTable(true); 
            props.setConfirm(props.preFixedSchedule.schedule.length > 0 ? 2 : 0); 
            if(props.isLogin){
              props.setScheduleTable(true);
              setTimeout(()=>{props.setIsLogin(false)
                props.setName("")
                props.setIsHost(false);
                props.setLoginNonMem(undefined);
                props.setNonMemLogin(false)
              }, 5000);
              signOut({ redirect: false });
              props.setIsLogin(false); 
            }}}>
        {lang == 'ko' ? "비회원 로그인":"NON-MEMBER LOGIN"}
        </button>
        <button className={`${className_button} py-1 ${setterBtnTab.tab_btn} ${loginMode === 'Email' ? 'bg-[#ffadad]' : 'bg-[#fddada]'}`}
          onClick={(e)=>{
            e.preventDefault();
            setIsMember(true); 
            setLoginMode('Email');
            props.setScheduleTable(true); 
            props.setConfirm(props.preFixedSchedule.schedule.length > 0 ? 2 : 0);
            if(props.isLogin){
              props.setScheduleTable(true);
              setTimeout(()=>{props.setIsLogin(false)
                props.setName("")
                props.setIsHost(false);
                props.setLoginNonMem(undefined);
                props.setNonMemLogin(false);
              }, 5000);
              signOut({ redirect: false });
              props.setIsLogin(false); 
            }}}>
        {lang == 'ko' ? "이메일 로그인":"EMAIL LOGIN"}
        </button>
        <button className={`${className_button} py-1 ${setterBtnTab.tab_btn} ${loginMode === 'social' ? 'bg-[#ffadad]' : 'bg-[#fddada]'}`}
          onClick={(e)=>{
            e.preventDefault();
            setIsMember(true); 
            setLoginMode('social');
            props.setScheduleTable(true); 
            props.setConfirm(props.preFixedSchedule.schedule.length > 0 ? 2 : 0);
            if(props.isLogin){
              props.setScheduleTable(true);
              setTimeout(()=>{props.setIsLogin(false)
                props.setName("")
                props.setIsHost(false);
                props.setLoginNonMem(undefined);
                props.setNonMemLogin(false);
              }, 5000);
              signOut({ redirect: false });
              props.setIsLogin(false); 
            }}}>
        {lang == 'ko' ? "소셜 로그인": "SOCIAL LOGIN"}
        </button>
      </div>
      <div className={`flex ${props.width <= 500 ? "flex-col" : "flex-row"} flex-nonwrap items-center text-center bg-[#ffadad] rounded-b-lg justify-center p-4 overflow-hidden gap-0`}>

        {props.isLogin ? 
          //로그인했을 경우
          props.name ? 
            //로그인한 회원의 이름 정보가 있을 경우
            <div className="w-full">
              <div className="items-center pt-1.5">{props.name}</div>
            </div> 
            //로그인한 회원의 이름 정보가 없을 경우
            : ""
          //로그인 하지 않았을 경우
        : loginMode =="social" ? 
          // 소셜로그인인 경우
          <button
            className={`bg-[#eee] rounded p-2 pt-3 hover:bg-[lightgray] hover:font-bold`}
            onClick={(e) => {
              e.preventDefault();
              signIn("google", { callbackUrl: "/" }, { prompt: "select_account" });
            }}>
            구글로 로그인
          </button>
          // 비회원 로그인 또는 이메일 로그인인 경우
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

        {loginMode =="social" ? "" :<button className={`items-center ${setterBtnTab.login_btn} grow-0 bg-white rounded text-center p-1 pt-1.5 m-2 mb-0 text-sm grow-0 ${props.width <= 500 ? "w-full mt-1":"mt-0 min-w-fit"} `}
          onClick={()=>{
            if(props.isLogin){
              props.setScheduleTable(true);
              setTimeout(()=>{props.setIsLogin(false)
                props.setName("")
                props.setIsHost(false);
                props.setLoginNonMem(undefined);
                props.setNonMemLogin(false)
              }, 5000);
              signOut();
            }
            else{
              props.setScheduleTable(false);
              isMember ? onMemLoginHandler():onNonMemLoginHandler();
            }
            props.confirm == 1 ? props.setConfirm(props.preFixedSchedule.schedule.length > 0 ? 2 : 0) : "";
            // props.isLogin ? props.setScheduleTable(true) : props.setScheduleTable(false);
            // props.isLogin ? props.setIsLogin(false) : props.setIsLogin(true);  
            // props.isLogin ? props.setName(""):"";
            // !props.isLogin ? isMember ? onMemLoginHandler():onNonMemLoginHandler():props.setIsHost(false);
            // props.isLogin ? props.setNonMemLogin(false) : "";
          }}
        >{props.isLogin ? (lang=="ko" ? "로그아웃":"LOGOUT") : props.width <= 500 || props.width > 786 ? (lang == 'ko' ? "로그인":"LOGIN") : <IoMdLogIn className={`h-full w-8 h-25`} />}
        </button>}
      </div>

    </div>
  );
};

export default Setter;

