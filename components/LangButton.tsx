import { ReactNode } from "react";

type LangButtonProps = {
  lang: "ko"|"en";
  setLang: any;
};

const LangButton = ({ lang, setLang }: LangButtonProps): ReactNode => {

  return (
    <div className={`w-20 h-10 mt-4 rounded-full relative border-box border-[3px] border-red-300
          ${lang !== "ko"? "bg-white  ":"bg-red-300"} `} 
          onClick={()=>{setLang((prev:"ko"|"en") => prev == "ko" ? "en" : "ko")}}>
      <div className={`rounded-full w-[30px] h-[30px] m-[2px] flex items-center justify-center absolute cursor-pointer transition-all duration-300
          ${lang === "ko"? "pt-0.5 bg-white text-red-300 text-lg":"bg-red-300 text-white ml-10"} `}>
          {lang === "ko" ? '한' : 'en'}
      </div>
      <div className={`rounded-full w-[30px] h-[30px] m-[2px] flex items-center justify-center transition-all duration-300
          ${lang !== "ko"? "pt-1 bg-white text-red-300":"text-lg pt-0.5 bg-red-300 text-white ml-10"} absolute`}>
          {lang === "ko" ? '영' : 'ko'}
      </div>
      </div>
  );
};

export default LangButton;
