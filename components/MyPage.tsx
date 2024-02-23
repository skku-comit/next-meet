import { ReactNode } from "react";
import EventList from "@/components/EventList";
import Login from "@/components/Login";
import { signOut, useSession } from "next-auth/react";

const LogoutButton = (): ReactNode => {
  return (
    <button
      className="mt-auto pt-20 hover:underline underline-offset-[6px]"
      onClick={(e) => {
        e.preventDefault();
        signOut({ redirect: false });
      }}>
      로그아웃
    </button>
  );
};

const MyPage = (): ReactNode => {
  const { data: session } = useSession();

  return (
    <div className="flex-grow lg:p-20 lg:pb-4 pb-10 h-fit flex flex-col items-center justify-center">
      {!(session && session.user) ? (
        <Login />
      ) : (
        <>
          <p className="text-2xl self-center lg:self-start p-10 lg:p-5">{session.user.name} 님의</p>
          <EventList/>
          <LogoutButton />
        </>
      )}
    </div>
  );
};

export default MyPage;
