import scheduleTable from "@/styles/scheduleTable.module.css";
import React, {useState } from "react";
// import Selecto from "react-selecto";
const className_div_theadtd = 'rounded-2xl p-3 pt-4 text-black';

interface MyComponentProps {
    fixedDate:String[] | null;
    fixedTime:{startTime:String, lastTime:String} | null;
    isLogin:boolean;
}

const ScheduleTable = ({fixedDate, fixedTime, isLogin}:MyComponentProps) => {
  // console.log(isLogin)

  var today = new Date();
  var newDay = new Date(today);
  newDay.setDate(today.getDate()+3);
  const dummyDateList = [] as String[];
  const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];
  while (today <= newDay) {
    let week = WEEKDAY[today.getDay()];
    dummyDateList.push(today.toISOString().split('T')[0]+'-'+week);
    today.setDate(today.getDate() + 1);
  }

  const dummyTimePeriod = {startTime : "00:00", lastTime : "24:00"};

  const [dateList, setDateList] = useState(!fixedDate ? dummyDateList : fixedDate);
  // console.log(dateList);
  const [timePeriod, setTimePeriod] = useState(!fixedTime ? dummyTimePeriod : fixedTime);
  const startTimeHour:number = parseInt(timePeriod.startTime.split(':')[0]);
  const lastTimeHour:number = parseInt(timePeriod.lastTime.split(':')[0]);
  const periodLen = lastTimeHour-startTimeHour;

  const qtrblock = (time_block_num: number, row_num:number)=>{
    return <td className={`${scheduleTable.slot} ${scheduleTable.btn} ${row_num == 0 && time_block_num==0 ? '': scheduleTable.btn_border_top0}`}
      key={"row_num*10 + time_block_num"}>
    </td> 
  }


  const hourblock = (time_block_num: number, row_num:number)=>{
    const result = [];
    const [isMouse, setIsMouse] = useState(false);
    for(let i=0; i<dateList.length; i++){
        result.push(qtrblock(time_block_num, row_num));
    }
    return result;
  }

   const timeHourBlock = (hour:number)=> {
    const result = [];
    for(let i=0; i < periodLen; i++){
        for(let j=0; j < 4; j++){
            result.push(<tr className={`${scheduleTable.td} `}>
            {j == 0 ? <td className={`${scheduleTable.td_hour_col} ${scheduleTable.td_hour} items-center`}>
                    <span className="items-center">{((hour+i)<10 ? '0'+(hour+i).toString():(hour+i).toString())+":00"}</span>
            </td>: <td className={`${scheduleTable.td_hour_col} ${scheduleTable.td}`}></td>}
            {hourblock(i,j)}
            </tr>)
      }
    }
    return result;
   }

  return (
        <div className="overflow-hidden overflow-x-auto py-3 bg-[#f8f9fa] rounded">
          <table className={`w-2/4 ${scheduleTable.table_spacing} border-separate table-scrolling`}>
              <thead className={`${scheduleTable.thead_margin}`}>
                  <tr>
                      <th className={`${scheduleTable.th_width_vacant} ${scheduleTable.td_hour_col}`}></th>
                      {dateList.map((date:String) => {
                          return <th className={`text-center ${scheduleTable.th_width} ${className_div_theadtd} ${'bg-[#d9d9d9] h-fit'}`}>
                              {date.split('-')[1]+'/'+date.split('-')[2]}
                              {/* <br/> */}
                              {'('+date.split('-')[3]+")"}
                      </th>
                      })} 
                  </tr>
              </thead>
              <tbody className={`${scheduleTable.selecto_area}`}>
                  <tr>
                    <td className={`${scheduleTable.td_spacing}`}></td>
                  </tr>
                  {timeHourBlock(startTimeHour)}
              </tbody>
          </table>
        </div>
  );
};

export default ScheduleTable;
