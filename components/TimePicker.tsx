import { ReactNode, useState } from "react";

type TimePickerOption = {
  clickHandler: (hour: string|null, min: string|null) => void,
  value: {hour:string, min:string},
  enabled:boolean,
};
const TimePicker = ({clickHandler, value, enabled}: TimePickerOption): ReactNode => {
  const hourOptions = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];
  const minOptions = ["00", "30"];

  return (
    <div className="flex p-1 rounded-lg border-2 border-solid border-black ">
      <select className="appearance-none px-1" value={enabled ? "00" : value.hour} onChange={(e) => clickHandler(e.target.value, null)} disabled={enabled}>
        {hourOptions.map((hour) => (
          <option key={hour} >
            {hour}
          </option>
        ))}
      </select>
      <p className="mx-1">:</p>
      <select className="appearance-none px-1" value={enabled ? "00" : value.min} onChange={(e) => clickHandler(null, e.target.value)} disabled={enabled}>
        {minOptions.map((min) => (
          <option key={min} >
            {min}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimePicker;
