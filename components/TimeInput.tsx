import { ReactNode } from "react";

const TimeInput = (): ReactNode => {
  return (
    <div className="w-screen h-max p-10 flex flex-col items-center ">
      <p className="text-2xl">Enter approximate time</p>
      <div className="p-8 pb-4 flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <label>from</label>
          <input type="time" className="w-32 border-[1px]"></input>
        </div>
        <div className="flex items-center gap-2">
          <label>to</label>
          <input type="time" className="w-32 border-[1px]"></input>
        </div>
      </div>
        <div className="flex items-center gap-2">
          <input type="checkbox"></input>
          <label>All Day</label>
        </div>
    </div>
  );
};

export default TimeInput;
