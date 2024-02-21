import CreateEvent from "@/components/CreateEvent";
import MyPage from "@/components/MyPage";

import { ReactNode } from "react";



const MainPage = (): ReactNode => {
  
  return (
    <div className="w-screen h-fit min-h-screen flex flex-col">
      <div className="(header space) w-screen h-20"></div>
      <CreateEvent />
      <hr />
      <MyPage/>
    </div>
  );
};

export default MainPage;
