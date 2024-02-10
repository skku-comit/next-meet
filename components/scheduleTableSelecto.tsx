import scheduleTable from "@/styles/scheduleTable.module.css";
import React, {useEffect, useState } from "react";
// import Selecto from "react-selecto";
import ScheduleSelector from 'react-schedule-selector';
// import WeeklyFixedDate from '@/template/WeeklyFixedDate';
import {ko} from 'date-fns/locale';
import { format } from 'date-fns';
const className_div_theadtd = 'rounded-2xl p-3 pt-4 text-black';

interface MyComponentProps {
    // fixedDate:Date[]|WeeklyFixedDate[] | null;
    fixedDate:Date[] | null;
    fixedTime:{startTime:string, lastTime:string} | null;
    isLogin:boolean;
    week:boolean|0;
    schedule:{schedule :[]};
    name:string;
    setShowResult : Function;
    setShowMember : Function;
    // scheduleList : {checked_num:{[key:string]:number}, member:{[key:string]:string[]}};
    // setScheduleList : Function;
    setTotalScheduleList:Function;
    totalMem:number;
}

const ScheduleTableSelecto = ({fixedDate, fixedTime, isLogin, week, schedule, name, setShowResult, setShowMember, setTotalScheduleList, totalMem}:MyComponentProps) => {
  // console.log(isLogin)

  const weekDay = fixedDate ? fixedDate: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]; 
 
  const DayList = [] as String[];
//   const dummyDateList = [] as String[];
const dummyDateList = [] as Date[];
  const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];

  if(week){ // weekday 0-date, 1-week
    for(let i=0; i<weekDay.length; i++){
        switch(weekDay[i]){
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
//    const handleChange = (newSchedule:[]) => {
//     setSchedule({schedule:newSchedule})
//     console.log(schedule);
//    }


  const [totalMemNum, setTotalMemNum] = useState(totalMem);
  
  const dummyScheduleList:{checked_num:{[key:string]:number}, member:{[key:string]:string[]}} = {
    checked_num : {"Mon Feb 12 2024 00:00:00 GMT+0900 (한국 표준시)":4/totalMemNum,
                    "Mon Feb 12 2024 00:30:00 GMT+0900 (한국 표준시)":3/totalMemNum,
                    "Mon Feb 12 2024 01:00:00 GMT+0900 (한국 표준시)":2/totalMemNum},
    member : {"Mon Feb 12 2024 00:00:00 GMT+0900 (한국 표준시)":["김명륜", "이율전", "강성대", "송성균"],
    "Mon Feb 12 2024 00:30:00 GMT+0900 (한국 표준시)":["김명륜", "이율전", "송성균"],
    "Mon Feb 12 2024 01:00:00 GMT+0900 (한국 표준시)":["김명륜", "이율전"]}
  }

//   useEffect(()=>{setScheduleList(dummyScheduleList); console.log(scheduleList)},[]);
  const [scheduleList, setScheduleList] = useState(dummyScheduleList);
  useEffect(()=>setTotalScheduleList(scheduleList), []);
  useEffect(()=>{
    let revisedScheduleList = scheduleList;
    // console.log("totalMem", totalMem);
    for(const key in scheduleList.checked_num){
        revisedScheduleList.checked_num[key] = scheduleList.checked_num[key] * totalMemNum / totalMem;
    }
    // console.log("revisedScheduleList",revisedScheduleList);
    setScheduleList(revisedScheduleList);
    setTotalMemNum(totalMem);
  }, [totalMem]);
  const [preMySelected, setPreMySelected] = useState(schedule.schedule);
  useEffect(()=>{
        if(isLogin){
            preMySelected.map((sche:string)=>{
                // if(schedule.schedule.includes(sche)==false){
                    const new_member = scheduleList.member[sche].filter((element) => element !== name);
                    setScheduleList((prevSche:{checked_num:{[key:string]:number}, member:{[key:string]:string[]}})=>({
                        checked_num:{
                            ...prevSche.checked_num,
                            [sche]: (prevSche.checked_num[sche]*totalMemNum-1)/totalMemNum
                        },
                        member:{
                            ...prevSche.member,
                            [sche]: new_member
                        }
                    }))
                // }
        });

        setPreMySelected(schedule.schedule);

        schedule.schedule.map((sche)=>{
            for(let i=0; i<Object.keys(scheduleList.checked_num).length; i++){
                // console.log(sche, sche);
                if(sche in scheduleList.checked_num){
                    setScheduleList((prevSche:{checked_num:{[key:string]:number}, member:{[key:string]:string[]}})=>({
                        checked_num:{
                            ...prevSche.checked_num,
                            [sche]: (prevSche.checked_num[sche]*totalMemNum+1)/totalMemNum
                        },
                        member:{
                            ...prevSche.member,
                            [sche]: [...prevSche.member[sche], name]
                        }
                    }))
                    
                }
                else{
                    setScheduleList((prevSche:{checked_num:{[key:string]:number}, member:{[key:string]:string[]}})=>({
                        checked_num:{
                            ...prevSche.checked_num,
                            [sche]:1/totalMemNum
                        },
                        member:{
                            ...prevSche.member,
                            [sche]: [name]
                        }
                    }))
                }
                break;
            }
        })}
        else{
            setPreMySelected([]);
        }
    }, [schedule.schedule, isLogin])

//   console.log(scheduleList);

  useEffect(
    ()=>{setTotalScheduleList(scheduleList)},[scheduleList]
  )

  return (
        <div className="overflow-hidden overflow-x-auto p-5 bg-[#f8f9fa] rounded">
          <div className={`${scheduleTable.table_spacing} border-separate table-scrolling`}>
            <ScheduleSelector
                selection={schedule.schedule}
                startDate={dummyDateList[0]}
                numDays={dateList.length}
                minTime={startTimeHour}
                maxTime={lastTimeHour}
                hourlyChunks={2}
                renderDateLabel={(date) => {
                    let index = Math.abs(date.getTime() - dummyDateList[0].getTime());
                    index = Math.ceil(index / (1000 * 60 * 60 * 24));
                    if(index == 1 && date.getDate() == dummyDateList[0].getDate()){
                        index = 0;
                    }
                    return <div>
                        {/* <div className={`text-center ${scheduleTable.th_width} ${className_div_theadtd} ${'bg-[#d9d9d9] h-fit'}`}> */}
                        {(dummyDateList[index].getMonth()+1)+'/'+dummyDateList[index].getDate()}
                        {/* <br/> */}
                        {'('+WEEKDAY[dummyDateList[index].getDay()]+")"}
                </div>}}
                // renderDateLabel={(date) => {return week ? "ddd" : format(date, 'MM/dd', { locale: ko })}}
                timeFormat="h:mma"
                unselectedColor="#eee"
                hoveredColor="none"
                selectedColor="none"
                rowGap="5px"
                columnGap="7px"
                renderDateCell={(datetime, selected, refSetter) => {
                    let selectedPct = 0;
                    let datetimeStr = datetime.toString().replace("대한민국", "한국");
                    let cellColor = "#eee";
                    // console.log(datetimeStr, datetimeStr in scheduleList.checked_num);
                    if(datetimeStr in scheduleList.checked_num){
                        selectedPct = scheduleList.checked_num[datetimeStr];
                    }
                    // console.log(selectedPct);
                    if(selectedPct == 0){
                        cellColor="#eee";
                    }
                    else if(selectedPct*totalMemNum == 1){
                         cellColor = "#f9e3e3";
                    }
                    else if(selectedPct <= 0.2){
                        cellColor = "#f9e3e3";
                    }
                    else if(selectedPct <= 0.4){
                        cellColor = "#f5d6d6";
                    }
                    else if(selectedPct <= 0.6){
                        cellColor = "#fccaca";
                    }
                    else if(selectedPct <= 0.8){
                        cellColor = "#feb2b2";
                    }
                    else if(selectedPct < 1){
                        cellColor = "#f1a9a9";
                    }
                    else if(selectedPct == 1){
                        cellColor = "#ffadad";
                    }
                    else{
                        cellColor = "#eee";
                    }
                
                    return <div ref={()=>refSetter} className="w-full h-full" style={{backgroundColor : cellColor, height:'25px'}}
                        onMouseOver={()=>{setShowMember(scheduleList.member[datetimeStr])}}
                        onMouseOut={()=>{setShowMember(false)}}></div>
                }}
                // renderTimeLabel={(time)=>{handleTimeLabel(time)}}
                //https://codesandbox.io/p/sandbox/react-schedule-selector-bug-on-11-7-forked-d12j5?file=%2Fsrc%2Findex.js
                //https://codesandbox.io/p/sandbox/react-schedule-selector-initialization-example-74l03t?file=%2Findex.tsx
                //https://github.com/bibekg/react-schedule-selector
            />
            
            </div>


        </div>
  );
};

export default ScheduleTableSelecto;
