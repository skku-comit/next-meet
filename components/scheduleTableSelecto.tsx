import scheduleTableCSS from "@/styles/scheduleTable.module.css";
import scheduleResultCSS from "@/styles/scheduleResult.module.css";
import React, {useEffect, useState } from "react";
// import Selecto from "react-selecto";
import ScheduleSelector from 'react-schedule-selector'
// import WeeklyFixedDate from '@/template/WeeklyFixedDate';
import {ko} from 'date-fns/locale';
import { format } from 'date-fns';
import { DaysOfWeek } from "@/template/DaysOfWeek";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { TimeInfo } from "@/template/TimeInfo";
import { Participate } from "@/template/Participate";
import { NextMeetUser, User } from "@/template/User";
import { language } from '../lib/recoil/Language';
import { useRecoilState } from "recoil";


interface MyComponentProps {
    // fixedDate:Date[]|WeeklyFixedDate[] | null;
    // fixedDate:Date[] | null;
    // fixedDay:DaysOfWeek[] | null;
    // fixedTime:{startTime:string, endTime:string} | null;
    isLogin:boolean;
    week:boolean|0;
    schedule:{schedule :Date[]};
    // commitFixedSchedule:{schedule :Date[]};
    name:string;
    // showMember:string[];
    // setShowResult : Function;
    setShowMember : Function;
    setShowMemberList : Function;
    setShowDateTime : Function;
    // scheduleList : {checked_num:{[key:string]:number}, member:{[key:string]:string[]}};
    // setScheduleList : Function;
    setTotalScheduleList:Function;
    totalMem:number;
    select:number;
    fixedSchedule : {schedule :Date[]};
    width:number;
    eventTimeInfo:TimeInfo | undefined;
    eventParti : Participate[] | undefined;
    state : string | undefined;
    handleChange : Function;
    confirm : number;
    nonMemLogin:boolean;
    loginNonMem:User|undefined;
    isHost:boolean;
    week_startDate:Date;
    eventID : number;
    preMySelected: Date[];
    setPreMySelected:Function;
}

const ScheduleTableSelecto = React.memo(function ScheduleTableSelecto(
    {eventParti, eventTimeInfo, isLogin, width, week, state, handleChange, 
    schedule, name, setShowMember, setTotalScheduleList, totalMem, eventID,setShowMemberList,
    fixedSchedule, select,confirm, nonMemLogin, loginNonMem, isHost, week_startDate,
    preMySelected, setPreMySelected, setShowDateTime}:MyComponentProps) {
  // console.log(isLogin)

  const [lang, setLang] = useRecoilState(language);

//   const selectedWeekDay = eventTimeInfo ? eventTimeInfo.dayList: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]; 
  const selectedWeekDay = eventTimeInfo ? eventTimeInfo.dayList: []; 
  const weekDaySorter:{ [index: string]: number } = { 'Mon':1 , 'Tue':2 , 'Wed':3 , 'Thu':4 , 'Fri':5 , 'Sat':6 ,'Sun':7 , }
  const sortedSelectedWeekDay = selectedWeekDay.sort((a:string,b:string)=>weekDaySorter[a]-weekDaySorter[b])

  let DayList = [] as String[];
  
  //   const dummyDateList = [] as String[];
  const dummyDateList = [] as Date[];
  const WEEKDAY = ['일', '월', '화', '수', '목', '금', '토'];
  const WEEKDAY2 = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const WEEKDAY3 = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


  if(week){ // weekday 0-date, 1-week
    for(let i=0; i<sortedSelectedWeekDay.length; i++){
        switch(sortedSelectedWeekDay[i]){
            case "Mon":
                DayList.push("월");
                break;
            case "Tue":
                DayList.push("화");
                break;
            case "Wed":
                DayList.push("수");
                break;
            case "Thu":
                DayList.push("목");
                break;
            case "Fri":
                DayList.push("금");
                break;
            case "Sat":
                DayList.push("토");
                break;
            case "Sun":
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

  const dummyTimePeriod = {startTime : "00:00", endTime : "24:00"};

  const [dateList, setDateList]:[Date[], Function] = useState(eventTimeInfo ? eventTimeInfo.dateList.sort((a:Date,b:Date)=>(new Date(a).getTime()- new Date(b).getTime())) : dummyDateList);
//   console.log("dateList", dateList);
  const [timePeriod, setTimePeriod] = useState(eventTimeInfo ? {startTime: eventTimeInfo.startTime, endTime : eventTimeInfo.endTime} : dummyTimePeriod);
  const startTimeHour:number = parseInt(timePeriod.startTime.split(':')[0])+parseFloat(timePeriod.startTime.split(':')[1]=='30'?'0.5':'0');
  const endTimeHour:number = timePeriod.endTime == "00:00" ? 24 : parseInt(timePeriod.endTime.split(':')[0])+parseFloat(timePeriod.endTime.split(':')[1]=='30'?'0.5':'0');
//   const periodLen = endTimeHour-startTimeHour;
   
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

const getDateDiff = (date1:Date, date2:Date) => {
    
    if(new Date(date1).getMonth() == new Date(date2).getMonth()){
      return new Date(date1).getDate() - new Date(date2).getDate();
    }
    else{
      const dayOfMonth = new Date(new Date(date2).getFullYear(), new Date(date2).getMonth(), 0);
      return dayOfMonth.getDate() - new Date(date2).getDate() + new Date(date1).getDate()
    }
    
  }

const realScheStr = (sche:Date) => {
    const index = getDateDiff(sche, week ? week_startDate : dateList[0]);
    let real_sche:Date;
    if(week){
        real_sche = new Date(week_startDate);
        for(let i=0; i<7; i++){
            if(WEEKDAY3[real_sche.getDay()] == sortedSelectedWeekDay[index]){
                break;
            }
            real_sche.setDate(real_sche.getDate() + 1)
        }
        // console.log("index", WEEKDAY3[real_sche.getDay()], sortedSelectedWeekDay[index]);

        real_sche.setHours(new Date(sche).getHours());
        real_sche.setMinutes(new Date(sche).getMinutes());
    }
    else{
        real_sche = new Date(dateList[index]);
        real_sche.setHours(new Date(sche).getHours());
        real_sche.setMinutes(new Date(sche).getMinutes());
    }
    // console.log("real_sche", real_sche)
    const sche_str = new Date(real_sche).toString().replace("대한민국", "한국");
    // console.log("sche_str",sche_str);
    return sche_str;
}

let givenEventScheList:{checked_num:{[key:string]:number}, member:{[key:string]:string[]}} = {checked_num:{}, member:{}};
if(eventParti) {
    for(let i = 0; i < eventParti.length; i++){
        const time_str = realScheStr(eventParti[i].time);
        // const time_str = new Date(eventParti[i].time).toString().replace("대한민국", "한국");
        // console.log("time_str",time_str);
        givenEventScheList.checked_num[time_str] = eventParti[i].user.length / totalMemNum;
        givenEventScheList.member[time_str] = []
        for(let j = 0; j < eventParti[i].user.length; j++){
            givenEventScheList.member[time_str].push(eventParti[i].user[j]?.userName)}
    }
}
// const sumValues = (obj:{[key:string]:number}) => Object.values(obj).reduce((a, b) => a + b, 0);
// const givenEventScheList_checked_num_sum = givenEventScheList.checked_num ? sumValues(givenEventScheList.checked_num) : 0;
const [scheduleList, setScheduleList] = useState(givenEventScheList);
//   useEffect(()=>setTotalScheduleList(scheduleList), []);
  useEffect(()=>{
    let revisedScheduleList = scheduleList;
    // console.log("totalMem", totalMem);
    for(const key in scheduleList.checked_num){
        revisedScheduleList.checked_num[key] = scheduleList.checked_num[key] * totalMemNum / totalMem;
    }
    // console.log("revisedScheduleList",revisedScheduleList);
    setScheduleList(revisedScheduleList);
    // setTotalMemNum(totalMem);
  }, [totalMem]);
  
//   const [preMySelected, setPreMySelected] = useState(schedule.schedule);

  useEffect(()=>{
    
        if(isLogin){
            console.log("update", preMySelected)
            preMySelected?.map((sche:Date)=>{
                // const index = getDateDiff(sche, week ? week_startDate : dateList[0]);
                // let real_sche:Date;
                // if(week){
                //     real_sche = new Date(week_startDate);
                //     for(let i=0; i<7; i++){
                //         if(WEEKDAY2[real_sche.getDay()] == sortedSelectedWeekDay[index]){
                //             break;
                //         }
                //         real_sche.setDate(real_sche.getDate() + 1)
                //     }
                //     real_sche.setHours(new Date(sche).getHours());
                //     real_sche.setMinutes(new Date(sche).getMinutes());
                // }
                // else{
                //     real_sche = new Date(dateList[index]);
                //     real_sche.setHours(new Date(sche).getHours());
                //     real_sche.setMinutes(new Date(sche).getMinutes());
                // }
                // // if(schedule.schedule.includes(sche)==false){
                //     const sche_str = new Date(real_sche).toString().replace("대한민국", "한국");
                    const sche_str = realScheStr(sche);
                    console.log("updatedSchedule", sche_str)
                    let new_member = scheduleList.member[sche_str];
                    console.log("newMem", new_member)
                    for(let i = 0; i < new_member?.length; i++) {
                        console.log("name contrast",new_member[i], name)
                        if(new_member[i] == name)  {
                            new_member.splice(i, 1);
                            console.log("name contrast 1",new_member)
                            break;
                        }
                      }
                    
                    setScheduleList((prevSche:{checked_num:{[key:string]:number}, member:{[key:string]:string[]}})=>({
                        checked_num:{
                            ...prevSche.checked_num,
                            [sche_str]: (prevSche.checked_num[sche_str]*totalMem-1)/totalMem
                        },
                        member:{
                            ...prevSche.member,
                            [sche_str]: new_member
                        }
                    }))
                // }
            });

            setPreMySelected(schedule.schedule);

            console.log("scheduleList schedule", schedule.schedule)

            schedule.schedule.map((sche:Date)=>{
                // const index = getDateDiff(sche, dateList[0]);
                // let real_sche:Date;
                // if(week){
                //     real_sche = new Date(week_startDate);
                //     for(let i=0; i<7; i++){
                //         if(WEEKDAY2[real_sche.getDay()] == sortedSelectedWeekDay[index]){
                //             break;
                //         }
                //         real_sche.setDate(real_sche.getDate() + 1)
                //     }
                //     real_sche.setHours(new Date(sche).getHours());
                //     real_sche.setMinutes(new Date(sche).getMinutes());
                // }
                // else{
                //     real_sche = new Date(dateList[index]);
                //     real_sche.setHours(new Date(sche).getHours());
                //     real_sche.setMinutes(new Date(sche).getMinutes());
                // }
                // const sche_str = new Date(real_sche).toString().replace("대한민국", "한국");
                const sche_str = realScheStr(sche);
                // console.log("sche_str scheduleList", sche_str)
                // for(let i=0; i<scheduleList.checked_num.length; i++){
                    // console.log("sche_str scheduleList", sche_str);
                    if(Object.keys(scheduleList.checked_num).includes(sche_str)){
                        // console.log("if scheduleList")
                        setScheduleList((prevSche:{checked_num:{[key:string]:number}, member:{[key:string]:string[]}})=>({
                            checked_num:{
                                ...prevSche.checked_num,
                                [sche_str]: (prevSche.checked_num[sche_str]*totalMem+1)/totalMem
                            },
                            member:{
                                ...prevSche.member,
                                [sche_str]: [...prevSche.member[sche_str], name]
                            }
                        }))
                        
                    }
                    else{
                        // console.log("else scheduleList")
                        setScheduleList((prevSche:{checked_num:{[key:string]:number}, member:{[key:string]:string[]}})=>({
                            checked_num:{
                                ...prevSche.checked_num,
                                [sche_str]:1/totalMem
                            },
                            member:{
                                ...prevSche.member,
                                [sche_str]: [name]
                            }
                        }))
                    }
                //     break;
                // }
            console.log("updated scheduleList",scheduleList)
        })}
        else{
            setPreMySelected([]);
        }
        setTotalMemNum(totalMem);
    }, [totalMem != totalMemNum ? (schedule.schedule, totalMem) : schedule.schedule, isLogin])

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

//   let week_startDate:Date = new Date();
//   for(let i=0; i<7; i++){
//     if(WEEKDAY[week_startDate.getDay()] == DayList[0]){
//         break;
//     }
//     week_startDate.setDate(week_startDate.getDate() + 1)
//   }
//   console.log(week_startDate)

//   let index_dayList = 0;

//   const [mouseOverDate, setMouseOverDate] = useState(new Date(0));

//   const contrastDate = (datetime:Date)=>{
//     let same:boolean = false;
//     // useEffect(()=>{
//         console.log(mouseOverDate , datetime);
//         if(datetime == mouseOverDate){
//             same = true;
//         }
//     // }, [mouseOverDate])
//     return same;
//   }

    const [open, setOpen] = useState(true);

    const startDate = week? week_startDate : new Date(dateList[0]);
    const numsDay = week? DayList.length : dateList.length;


    // console.log(startTimeHour, endTimeHour)

    useEffect(()=>{console.log("scheduleList TotalMem state",scheduleList, schedule.schedule, totalMemNum, state)}, [schedule.schedule, state])


  return (
        <div className="w-full overflow-hidden overflow-x-auto p-5 bg-[#f8f9fa] rounded" hidden={state=="EDIT" && confirm==1?true:false}>
          <div className={`flex flex-row gap-2 justify-between font-bold items-center cursor-pointer w-full ${width > 768 || open ? "pb-2":""}`} onClick={()=>{setOpen((prevOP:boolean)=>!prevOP)}}>
                <p>{state=="EDIT" ? lang=="ko" ? "내 일정을 표시 및 수정하십시오.": "Check or Edit Available Schedule": 
                    state=="CONFIRM" ? lang=="ko" ? "확정할 일정을 표시하십시오.":"Check the Schedule to Confirm" : lang=="ko" ? "전체 일정" : "Total Schedule Table"}</p>
                {width > 768 ? "" : !open ? <FaAngleUp/> : <FaAngleDown/>}
          </div>
          {width > 768 || open ? <div className={`w-full animate-[smoothAppear_1s]  ${scheduleTableCSS.table_spacing} border-separate table-scrolling pt-3 border-t-2`}>
            <ScheduleSelector
                selection={state=="EDIT" ? schedule.schedule : state=="CONFIRM" ? fixedSchedule.schedule : undefined}
                onChange={state=="EDIT" || state=="CONFIRM" ? (newschedule)=>{handleChange(newschedule)}:undefined}
                startDate={startDate}
                numDays={numsDay}
                minTime={startTimeHour}
                maxTime={endTimeHour}
                hourlyChunks={2}
                renderDateLabel={(date:Date) => {
                    // console.log(startDate, numsDay, date)
                    if(!week){
                        let index = Math.abs(date.getTime() - new Date(dateList[0]).getTime());
                        index = Math.ceil(index / (1000 * 60 * 60 * 24));
                        // console.log(index)
                        if(index == 1 && date.getDate() == new Date(dateList[0]).getDate()){
                            index = 0;
                        }
                        return  <div className="w-full h-full" style={{height:'25px', minWidth:"70px"}}>
                        {/* <div className={`text-center ${scheduleTableCSS.th_width} ${className_div_theadtd} ${'bg-[#d9d9d9] h-fit'}`}> */}
                        {(new Date(dateList[index]).getMonth()+1)+'/'+new Date(dateList[index]).getDate()}
                        {/* <br/> */}
                        {"("} 
                        {lang=="ko" ? WEEKDAY[new Date(dateList[index]).getDay()] : WEEKDAY2[new Date(dateList[index]).getDay()]}
                        {")"}
                    </div>
                    }
                    // console.log("index",date.getDay()-week_startDate.getDay() < 0 ? -1 : date.getDay()-week_startDate.getDay())
                    // console.log("index",DayList[date.getDay()-week_startDate.getDay() < 0 ? DayList.length-1 : date.getDay()-week_startDate.getDay()] )
                    return <div className={`${width > 600 ? "w-full" : scheduleTableCSS.date_label} h-full`} style={{height:'25px', minWidth:"70px"}}>
                    {lang == "ko" ? DayList[date.getDay()-week_startDate.getDay() < 0 ? DayList.length-1 : date.getDay()-week_startDate.getDay()] : sortedSelectedWeekDay[date.getDay()-week_startDate.getDay() < 0 ? sortedSelectedWeekDay.length-1 : date.getDay()-week_startDate.getDay()]}
                    </div>}}
                renderTimeLabel={(time) => {
                    return <div className={`sticky top-0 left-0 bg-[#f8f9fa] pr-1 z-20`}>
                            {time.getHours()<10?"0"+time.getHours():time.getHours()}:{time.getMinutes()==0?'00':'30'}
                        </div>}}
                timeFormat="h:mma"
                unselectedColor="#eee"
                hoveredColor={state=="EDIT" ? "#fddada" : state=="CONFIRM" ? "#a2cffe" : "none"}
                selectedColor={state=="EDIT" ? "#ffadad" : state=="CONFIRM" ? "#63c5da" : "none"}
                rowGap="5px"
                columnGap="7px"
                renderDateCell={state=="EDIT" || state=="CONFIRM" ? undefined:(datetime, selected, refSetter) => {
                    let selectedPct = 0;
                    let datetimeStr: string = realScheStr(datetime);
                    // let datetimeStr:string = datetime.toString().replace("대한민국", "한국");
                    let cellColor = "#eee";
                    // console.log("selectedPct",datetimeStr, datetimeStr in scheduleList.checked_num);
                    

                    if(datetimeStr in scheduleList.checked_num){
                        selectedPct = scheduleList.checked_num[datetimeStr];
                    }
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

                    const memberList = scheduleList.member[datetimeStr];

                    return <div 
                        // ref={()=>refSetter} 
                        className={`relative w-full h-full ${scheduleTableCSS.date_cell}`} style={{backgroundColor : cellColor, height:'25px', minWidth:"70px"}}
                        onMouseOver={()=>{setShowMember(true); setShowMemberList(memberList); setShowDateTime(datetimeStr)}}
                        onMouseOut={()=>{setShowMember(false); setShowMemberList([]);}}>
                            
                            {width <=768 ? <div className ={`${scheduleTableCSS.date_cell_popup}`}>
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
