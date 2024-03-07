import Link from "next/link";
import { ReactNode, useEffect } from "react"
// import { useLocation } from "react-router-dom";

const Header = ():ReactNode =>{
    return <div className="w-screen h-20 px-4 fixed flex flex-col bg-white z-50">
        <Link href={'/'}>
            <h1 className="m-4 text-2xl">NextMeet</h1>
        </Link>
        <div className="w-full h-2 mt-auto rounded-full bg-[#FFAFAF]"></div>
    </div>
}

export default Header;