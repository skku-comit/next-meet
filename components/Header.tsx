import Link from "next/link";
import { ReactNode, useEffect, useState } from "react"
import LangButton from "./LangButton";
// import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { language } from '../lib/recoil/Language';

const Header = ():ReactNode =>{
    const [lang, setLang] = useRecoilState(language);

    return <div className="w-screen h-20 px-4 fixed flex flex-col bg-white z-50">
        <div className="flex flex-row justify-between pr-2">
            <Link href={'/'}>
                <h1 className="m-4 text-2xl pt-2">NextMeet</h1>
            </Link>
            <div className="pt-1">
                <LangButton lang={lang} setLang={setLang}/>
            </div>
        </div>
        <div className="w-full h-2 rounded-full bg-[#FFAFAF]"></div>
    </div>
}

export default Header;