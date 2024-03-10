import { ReactNode } from "react";
import { useRecoilValue } from "recoil";
import { language } from '../lib/recoil/language';
import { className_button } from "@/styles/button";

const CopiedAlert = (): ReactNode => {
    const lang = useRecoilValue(language);
    return <div className={`p-6 py-3 w-48 text-center top-2/3 left-1/2 -translate-x-1/2 rounded-xl text-[#a96060] bg-[#ffdada] absolute text-sm`}>{lang === 'ko' ? '링크가 복사되었습니다' : 'Link successfully copied!'}</div>
}

export default CopiedAlert;