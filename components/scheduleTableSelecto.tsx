import scheduleTableCSS from "@/styles/scheduleTable.module.css";
import scheduleResultCSS from "@/styles/scheduleResult.module.css";
import React, {useEffect, useState } from "react";
// import Selecto from "react-selecto";
import ScheduleSelector from 'react-schedule-selector';
// import WeeklyFixedDate from '@/template/WeeklyFixedDate';
import {ko} from 'date-fns/locale';
import { format } from 'date-fns';
import { DaysOfWeek } from "@/template/DaysOfWeek";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

interface MyComponentProps {
    // fixedDate:Date[]|WeeklyFixedDate[] | null;
    fixedDate:Date[] | null;
    fixedDay:DaysOfWeek[] | null;
    fixedTime:{startTime:string, lastTime:string} | null;
    isLogin:boolean;
    week:boolean|0;
    schedule:{schedule :Date[]};
    commitFixedSchedule:{schedule :Date[]};
    name:string;
    showMember:string[];
    setShowResult : Function;
    setShowMember : Function;
    // scheduleList : {checked_num:{[key:string]:number}, member:{[key:string]:string[]}};
    // setScheduleList : Function;
    setTotalScheduleList:Function;
    totalMem:number;
    select:number;
    fixedSchedule : {schedule :Date[]};
    scheduleTable:boolean;
    setScheduleTable:Function;
    width:number;
}

const ScheduleTableSelecto = React.memo(function ScheduleTableSelecto({fixedDay, fixedDate, fixedTime, isLogin, width, week, schedule, name, showMember, setShowResult, setShowMember, setTotalScheduleList, totalMem, fixedSchedule, commitFixedSchedule, select, scheduleTable, setScheduleTable}:MyComponentProps) {
  // console.log(isLogin)

  const selectedWeekDay = fixedDay ? fixedDay: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]; 
  const weekDaySorter:{ [index: string]: number } = { 'Mon':1 , 'Tue':2 , 'Wed':3 , 'Thu':4 , 'Fri':5 , 'Sat':6 ,'Sun':7 , }
  const sortedSelectedWeekDay = selectedWeekDay.sort((a:string,b:string)=>weekDaySorter[a]-weekDaySorter[b])

  let DayList = [] as String[];
  
  //   const dummyDateList = [] as String[];
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

//   const pushedDayList = DayList;

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
    checked_num : {"Wed Feb 21 2024 00:00:00 GMT+0900 (한국 표준시)":4/totalMemNum,
                    "Wed Feb 21 2024 00:30:00 GMT+0900 (한국 표준시)":3/totalMemNum,
                    "Wed Feb 21 2024 01:00:00 GMT+0900 (한국 표준시)":2/totalMemNum},
    member : {"Wed Feb 21 2024 00:00:00 GMT+0900 (한국 표준시)":["김명륜", "이율전", "강성대", "송성균"],
    "Wed Feb 21 2024 00:30:00 GMT+0900 (한국 표준시)":["김명륜", "이율전", "송성균"],
    "Wed Feb 21 2024 01:00:00 GMT+0900 (한국 표준시)":["김명륜", "이율전"]}
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
            preMySelected.map((sche:Date)=>{
                // if(schedule.schedule.includes(sche)==false){
                    const sche_str = sche.toString().replace("대한민국", "한국");
                    const new_member = scheduleList.member[sche_str].filter((element) => element !== name);
                    setScheduleList((prevSche:{checked_num:{[key:string]:number}, member:{[key:string]:string[]}})=>({
                        checked_num:{
                            ...prevSche.checked_num,
                            [sche_str]: (prevSche.checked_num[sche_str]*totalMemNum-1)/totalMemNum
                        },
                        member:{
                            ...prevSche.member,
                            [sche_str]: new_member
                        }
                    }))
                // }
        });

        setPreMySelected(schedule.schedule);

        schedule.schedule.map((sche:Date)=>{
            const sche_str = sche.toString().replace("대한민국", "한국");
            for(let i=0; i<Object.keys(scheduleList.checked_num).length; i++){
                // console.log(sche, sche);
                if(sche_str in scheduleList.checked_num){
                    setScheduleList((prevSche:{checked_num:{[key:string]:number}, member:{[key:string]:string[]}})=>({
                        checked_num:{
                            ...prevSche.checked_num,
                            [sche_str]: (prevSche.checked_num[sche_str]*totalMemNum+1)/totalMemNum
                        },
                        member:{
                            ...prevSche.member,
                            [sche_str]: [...prevSche.member[sche_str], name]
                        }
                    }))
                    
                }
                else{
                    setScheduleList((prevSche:{checked_num:{[key:string]:number}, member:{[key:string]:string[]}})=>({
                        checked_num:{
                            ...prevSche.checked_num,
                            [sche_str]:1/totalMemNum
                        },
                        member:{
                            ...prevSche.member,
                            [sche_str]: [name]
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

//   let groupedSelect = schedule.schedule.concat(commitFixedSchedule.schedule);
//   let totalSelect = groupedSelect.filter((sche, pos)=>groupedSelect.indexOf(sche)===pos);
//   const [totalSelection, setTotalSelection] = useState(totalSelect);

//   useEffect(()=>{
//     // if(confirm == 1){
//         groupedSelect = schedule.schedule.concat(commitFixedSchedule.schedule)
//         totalSelect = groupedSelect.filter((sche, pos)=>groupedSelect.indexOf(sche)===pos);
//         setTotalSelection(totalSelect);
//     //}
//   },[schedule, commitFixedSchedule])

  let week_startDate:Date = new Date();
  for(let i=0; i<7; i++){
    if(WEEKDAY[week_startDate.getDay()] == DayList[0]){
        break;
    }
    week_startDate.setDate(week_startDate.getDate() + 1)
  }
//   console.log(week_startDate)

  let index_dayList = 0;

  const [mouseOverDate, setMouseOverDate] = useState(new Date(0));

  const contrastDate = (datetime:Date)=>{
    let same:boolean = false;
    // useEffect(()=>{
        console.log(mouseOverDate , datetime);
        if(datetime == mouseOverDate){
            same = true;
        }
    // }, [mouseOverDate])
    return same;
  }

  return (
        <div className="w-full overflow-hidden overflow-x-auto p-5 bg-[#f8f9fa] rounded">
          <div className={`flex flex-row gap-2 justify-between font-bold items-center cursor-pointer w-full ${width > 768 || scheduleTable ? "pb-2":""}`} onClick={()=>{setScheduleTable((prevST:boolean)=>!prevST)}}>
                <p>Total Schedule Table</p>
                {width > 768 ? "" : !scheduleTable ? <FaAngleUp/> : <FaAngleDown/>}
          </div>
          {width > 768 || scheduleTable ? <div className={`w-full animate-[smoothAppear_1s]  ${scheduleTableCSS.table_spacing} border-separate table-scrolling pt-3 border-t-2`}>
            <ScheduleSelector
                // selection={}
                startDate={!week? dummyDateList[0]: week_startDate}
                numDays={!week? dateList.length : DayList.length}
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
                    // console.log(date.getDay()-week_startDate.getDay());
                    return <div className="w-full h-full" style={{height:'25px', minWidth:"50px"}}>
                    {DayList[date.getDay()-week_startDate.getDay()]}
                    </div>}}
                renderTimeLabel={(time) => {
                    return <div className={`sticky top-0 left-0 bg-[#f8f9fa] pr-1 z-20`}>
                            {time.getHours()<10?"0"+time.getHours():time.getHours()}:{time.getMinutes()==0?'00':'30'}
                        </div>}}
                timeFormat="h:mma"
                unselectedColor="#eee"
                hoveredColor="none"
                selectedColor="none"
                rowGap="5px"
                columnGap="7px"
                renderDateCell={(datetime, selected, refSetter) => {
                    let selectedPct = 0;
                    let datetimeStr:string = datetime.toString().replace("대한민국", "한국");
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
                
                    // const fixedScheduleList:string[] = commitFixedSchedule.schedule;
                    const fixedScheduleList:Date[] = fixedSchedule.schedule;
        
                    if(select == 1){
                        fixedScheduleList.map((sche:Date)=>{
                            // console.log(sche == datetimeStr)
                            const sche_str = sche.toString().replace("대한민국", "한국");
                            if (sche_str == datetimeStr){
                                    cellColor = "#63c5da";
                                }
                        })
                        // for(let i = 0; i < fixedScheduleList.length; i++){
                        //     const sche = new Date(fixedScheduleList[i]);
                            
                        //     // console.log("date",datetime)
                        //     // console.log("sche", sche);
                        //     console.log(datetime.toUTCString() == sche.toUTCString());
                        //     if(datetime.toUTCString() == sche.toUTCString()){
                        //         cellColor = "#63c5da";
                        //         console.log(sche==datetime);
                        //     }
                        // }
                    }

                    // if(select == 1 && fixedScheduleList.includes(datetime.toLocaleString)){
                    //     cellColor = "#63c5da";
                    //     console.log(typeof fixedScheduleList, 1);
                    // }

                    // console.log(select == 1 && fixedScheduleList.includes(datetimeStr));
                    // console.log(fixedScheduleList.includes(datetime))
                    // console.log("select", select);

                    return <div 
                        // ref={()=>refSetter} 
                        className={`${scheduleTableCSS.date_cell}`} style={{backgroundColor : cellColor, height:'25px', minWidth:"50px"}}
                        onMouseOver={()=>{setShowMember(scheduleList.member[datetimeStr]);}}
                        onMouseOut={()=>{setShowMember([]);}}>
                            
                            {width <=768 ? <div className ={`absolute -right-2 -bottom-2 ${scheduleTableCSS.date_cell_popup}
                            border-separate px-2 min-h-8 w-12 z-10 p-2 bg-[lightgray] rounded text-left`}>
                               {scheduleList.member[datetimeStr] ? <ul>
                            {/* ${scheduleResultCSS.result_scrolling} border-separate px-2 min-h-4`}> */}
                                {scheduleList.member[datetimeStr].map((member)=>{
                                    return(
                                        <li>{member}</li>
                                    )
                                })}
                                </ul>:""}
                            </div>:""}
                        </div>
                }}
                // renderTimeLabel={(time)=>{handleTimeLabel(time)}}
                //https://codesandbox.io/p/sandbox/react-schedule-selector-bug-on-11-7-forked-d12j5?file=%2Fsrc%2Findex.js
                //https://codesandbox.io/p/sandbox/react-schedule-selector-initialization-example-74l03t?file=%2Findex.tsx
                //https://github.com/bibekg/react-schedule-selector
            />
          
            </div>:""}


        </div> 
  );
});

export default React.memo(ScheduleTableSelecto);
