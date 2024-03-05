import { ReactNode } from "react";

type LangButtonProps = {
  on: boolean;
  setState: any;
};

const LangButton = ({ on }: LangButtonProps): ReactNode => {
  return (
    <div className="w-20 h-10 rounded-full relative bg-red-300">
      <div
        className={`w-8 h-8 rounded-full bg-white absolute cursor-pointer top-1 transition-all ${
          on ? "left-1" : "left-18"
        }`}
      ></div>
    </div>
  );
};

export default LangButton;
