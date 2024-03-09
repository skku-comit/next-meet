import { ReactNode } from "react";

type LangButtonProps = {
  lang: "ko"|"en";
  setLang: any;
};

const LangButton = ({ lang, setLang }: LangButtonProps): ReactNode => {

  return (
    <div className={`w-20 h-10 rounded-full relative ${lang !="ko"? "bg-white border-red-300":"bg-red-300"} mt-4`} 
          onClick={()=>{setLang((prev:"ko"|"en")=>prev=="ko" ? "en" : "ko")}}
          style={{borderWidth:lang !="ko"? "3.5px" : "", width:"80px", height:"40px"}}>
      <div
        className={`rounded-full ${lang=="ko"? "bg-white":"bg-red-300"} absolute cursor-pointer transition-all ${
          lang=="ko" ? "w-8 h-8 left-1 top-1" : "left-10"
        }`}
        style={{width:lang=="ko" ? "":"31px", height:lang=="ko" ? "":"31px", top:lang=="ko" ? "":"1px"}}
      >
        {lang == "ko" ? 
          <p className="text-red-300" style={{paddingTop:"2.7px", paddingLeft:"6px", fontSize:"20px"}}>한</p>
          : <p className="text-white" style={{paddingTop:"5px", paddingLeft:"3px", fontSize:"15.5px"}}>EN</p>}
        {/* {lang == "ko" ? 
          <span>
            <p className="font-bold pr-2 border-1 border-[gray] border-solid">한글</p>
            <p className="pl-2">영어</p>
          </span> 
          :
          <span>
            <p className="pr-2 border-1 border-[gray] border-solid">KOREAN</p>
            <p className="font-bold pl-2">ENGLISH</p>
          </span> 
        } */}
      </div>
      {lang == "ko" ? 
          <p className="text-white absolute" style={{right:"10px", paddingTop:"6.7px", fontSize:"22px"}}>영</p>
          : <p className="text-red-300 absolute" style={{paddingTop:"6.7px", paddingLeft:"5.1px", fontSize:"15.5px"}}>KO</p>}
    </div>
  );
};

export default LangButton;
