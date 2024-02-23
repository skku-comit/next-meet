import scheduleTableCSS from "@/styles/scheduleTable.module.css";
import React, {useState, useEffect } from "react";
// import Selecto from "react-selecto";
import ScheduleSelector from 'react-schedule-selector';
import { DaysOfWeek } from "@/template/DaysOfWeek";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
// import WeeklyFixedDate from '@/template/WeeklyFixedDate';
import {ko} from 'date-fns/locale';
import { format } from 'date-fns';
// import { type } from './../template/User';
const className_div_theadtd = 'rounded-2xl p-3 pt-4 text-black';

interface MyComponentProps {
    // fixedDate:Date[]|WeeklyFixedDate[] | null;
    fixedDate:Date[] | null;
    fixedDay:DaysOfWeek[] | null;
    fixedTime:{startTime:String, lastTime:String} | null;
    isLogin:boolean;
    week:boolean|0;
    fixedSchedule:{schedule :[]};
    setFixedSchedule:Function;
    scheduleTable:boolean;
    setScheduleTable:Function;
    width:number;
}

const ScheduleTableConfirm = React.memo(function ScheduleTableConfirm({fixedDate, fixedDay, fixedTime, isLogin, width, week, fixedSchedule, setFixedSchedule, scheduleTable, setScheduleTable}:MyComponentProps) {
  // console.log(isLogin)

  const selectedWeekDay = fixedDay ? fixedDay: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]; 
  const weekDaySorter:{ [index: string]: number } = { 'Mon':1 , 'Tue':2 , 'Wed':3 , 'Thu':4 , 'Fri':5 , 'Sat':6 ,'Sun':7 , }
  const sortedSelectedWeekDay = selectedWeekDay.sort((a:string,b:string)=>weekDaySorter[a]-weekDaySorter[b])

 
  const DayList = [] as String[];

  // const dummyDateList = [] as String[];
  const dummyDateList = [] as Date[];
  const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

  if(week){ // weekday 0-date, 1-week
    for(let i=0; i<sortedSelectedWeekDay.length; i++){
        switch(sortedSelectedWeekDay[i]){
            case "MON":
                DayList.push("월");
                break;
            case "TUE":
                DayList.push("화");
                break;
            case "WED":
                DayList.push("수");
                break;
            case "THU":
                DayList.push("목");
                break;
            case "FRI":
                DayList.push("금");
                break;
            case "SAT":
                DayList.push("토");
                break;
            case "SUN":
                DayList.push("일");
                break;
        }
    }
  }
  else{
    var today = new Date();
    var newDay = new Date(today);
    newDay.setDate(today.getDate()+3);
    while (today <= newDay) {
        // let week = WEEKDAY[today.getDay()];
        // dummyDateList.push(today.toISOString().split('T')[0]+'-'+week);
        // today.setDate(today.getDate() + 1);
        var newDate = new Date(today);
        dummyDateList.push(newDate);
        today.setDate(today.getDate()+1);
    }
   }

  const dummyTimePeriod = {startTime : "00:00", lastTime : "24:00"};

  const [dateList, setDateList] = useState(!fixedDate ? dummyDateList : fixedDate);
  // console.log(dateList);
  const [timePeriod, setTimePeriod] = useState(!fixedTime ? dummyTimePeriod : fixedTime);
  const startTimeHour:number = parseInt(timePeriod.startTime.split(':')[0])+parseFloat(timePeriod.startTime.split(':')[1]=='30'?'0.5':'0');
  const lastTimeHour:number = parseInt(timePeriod.lastTime.split(':')[0])+parseFloat(timePeriod.lastTime.split(':')[1]=='30'?'0.5':'0');
//   const periodLen = lastTimeHour-startTimeHour;
   
//    const [schedule, setSchedule] = useState({schedule :[]})
   
  const handleChange = (newSchedule:Date[]) => {
    setFixedSchedule({schedule:newSchedule})
    // console.log(fixedSchedule.schedule);
   }

//    console.log(fixedSchedule);

    let week_startDate:Date = new Date();
    for(let i=0; i<7; i++){
        if(WEEKDAY[week_startDate.getDay()] == DayList[0]){
            break;
        }
        week_startDate.setDate(week_startDate.getDate() + 1)
      }

   let index_dayList = 0;
   const [open, setOpen] = useState(true);

  return (
        <div className="w-full overflow-hidden overflow-x-auto p-5 bg-[#f8f9fa] rounded">
          <div className={`flex flex-row gap-2 justify-between font-bold items-center cursor-pointer w-full ${!scheduleTable ? "pb-2":""}`} onClick={()=>{setOpen((prevST:boolean)=>!prevST)}}>
                <p>Check the Schedule to Confirm</p>
                {width > 768 ? "" : !open ? <FaAngleUp/> : <FaAngleDown/>}
          </div>
          {width > 768 || open ? <div className={`w-full animate-[smoothAppear_1s]  ${scheduleTableCSS.table_spacing} border-separate table-scrolling pt-3 border-t-2`}>
            <ScheduleSelector
                selection={fixedSchedule.schedule}
                onChange={(newschedule)=>{handleChange(newschedule)}}
                startDate={!week? dummyDateList[0]: week_startDate}
                numDays={week? DayList.length : dateList.length}
                minTime={startTimeHour}
                maxTime={lastTimeHour}
                hourlyChunks={2}
                renderDateLabel={(date) => {
                    if(!week){
                        let index = Math.abs(date.getTime() - dummyDateList[0].getTime());
                        index = Math.ceil(index / (1000 * 60 * 60 * 24));
                        if(index == 1 && date.getDate() == dummyDateList[0].getDate()){
                            index = 0;
                        }
                        return  <div className="w-full h-full" style={{height:'25px', minWidth:"50px"}}>
                        {/* <div className={`text-center ${scheduleTableCSS.th_width} ${className_div_theadtd} ${'bg-[#d9d9d9] h-fit'}`}> */}
                        {(dummyDateList[index].getMonth()+1)+'/'+dummyDateList[index].getDate()}
                        {/* <br/> */}
                        {'('+WEEKDAY[dummyDateList[index].getDay()]+")"}
                    </div>
                    }
                    // const day = DayList[index_dayList++];
                    return <div className="w-full h-full" style={{height:'25px', minWidth:"50px"}}>
                    {DayList[date.getDay()-week_startDate.getDay()]}
                    </div>}}
                renderTimeLabel={(time) => {
                    return <div className={`sticky top-0 left-0 bg-[#f8f9fa] pr-1`}>
                            {time.getHours()<10?"0"+time.getHours():time.getHours()}:{time.getMinutes()==0?'00':'30'}
                        </div>}}
                timeFormat="h:mma"
                unselectedColor="#eee"
                hoveredColor="#a2cffe"
                selectedColor="#63c5da"
                rowGap="5px"
                columnGap="7px"
                // renderTimeLabel={(time)=>{handleTimeLabel(time)}}
            />
            
            </div>:""}


        </div>
  );
});

export default React.memo(ScheduleTableConfirm);
