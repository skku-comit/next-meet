import { ReactNode } from "react"


const Header = ():ReactNode =>{


    return <div className="w-screen h-20 px-4 fixed flex flex-col bg-white">
        <h1 className="m-4 text-2xl">NextMeet</h1>
        <div className="w-full h-2 mt-auto rounded-full bg-[#FFAFAF]"></div>
    </div>
}

export default Header;