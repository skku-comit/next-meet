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
    <div className="flex-grow p-20 h-fit flex flex-col items-center justify-center">
      {!(session && session.user) ? (
        <Login />
      ) : (
        <>
          <EventList />
          <LogoutButton />
        </>
      )}
    </div>
  );
};

export default MyPage;
