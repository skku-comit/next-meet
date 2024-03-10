import CreateEvent from "@/components/CreateEvent";
import Header from "@/components/Header";
import MyPage from "@/components/MyPage";
import { ReactNode } from "react";

const MainPage = (): ReactNode => {

  return (
    <div className="w-screen h-fit min-h-screen flex flex-col pt-20">
      {/* <div className="(header space) w-screen h-20"><Header/></div> */}
      <CreateEvent />
      <hr />
      <MyPage/>
    </div>
  );
};

export default MainPage;
