import { ReactNode, useEffect, useState } from "react";
import EventList from "@/components/EventList";
import Login from "@/components/Login";
import { signOut, useSession } from "next-auth/react";
import { useRecoilValue } from "recoil";
import { language } from '../lib/recoil/language';

const className_button = "w-60 p-6 py-3 bg-[#ffadad] rounded-xl text-white";

const LogoutButton = (): ReactNode => {
  const lang = useRecoilValue(language);
  return (
    <button
      // className={"mt-auto pt-20 hover:underline underline-offset-[6px]"}
      className={`${className_button} py-2 mt-5`}
      onClick={(e) => {
        e.preventDefault();
        signOut({ redirect: false });
      }}>
      {lang === 'ko' ? '로그아웃' : 'Logout'}
    </button>
  );
};

const MyPage = (): ReactNode => {
  const { data: session } = useSession();
  console.log("MyPage")
  console.log( 'session:',session );

  return (
    <div className="flex-grow lg:p-20 pb-10 h-fit flex flex-col items-center justify-center">
      {!(session && session.user) ? (
        <Login />
      ) : (
        <>
          <p className="text-2xl self-center lg:self-start p-10 lg:p-5">{session.user.userName ?? session.user.name ?? session.user.email} 님의</p>
          <EventList/>
          <LogoutButton />
        </>
      )}
    </div>
  );
};

export default MyPage;
