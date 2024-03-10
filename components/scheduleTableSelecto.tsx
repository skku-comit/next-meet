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
import { language } from '../lib/recoil/language';
import { useRecoilState } from "recoil";


interface MyComponentProps {
    isLogin:boolean;
    week:boolean|0;
    schedule:{schedule :Date[]};
    name:string;
    setShowMember : Function;
    setShowMemberList : Function;
    setShowDateTime : Function;
    setTotalScheduleList:Function;
    totalMem:number;
    prevTotalMem:number;
    setPrevTotalMem:Function;
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
    wait:boolean;
    setWait2:Function;
}

const ScheduleTableSelecto = React.memo(function ScheduleTableSelecto(
    {eventParti, eventTimeInfo, isLogin, width, week, state, handleChange, 
    schedule, name, setShowMember, setTotalScheduleList, totalMem, eventID,setShowMemberList,
    fixedSchedule, select,confirm, nonMemLogin, loginNonMem, isHost, week_startDate,
    preMySelected, setPreMySelected, setShowDateTime, prevTotalMem, setPrevTotalMem,
    wait, setWait2}:MyComponentProps) {

    const [lang, setLang] = useRecoilState(language);

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
            var newDate = new Date(today);
            dummyDateList.push(newDate);
            today.setDate(today.getDate()+1);
        }
    }


    const dummyTimePeriod = {startTime : "00:00", endTime : "24:00"};

    const [dateList, setDateList]:[Date[], Function] = useState(eventTimeInfo ? eventTimeInfo.dateList.sort((a:Date,b:Date)=>(new Date(a).getTime()- new Date(b).getTime())) : []);
    const [timePeriod, setTimePeriod] = useState(eventTimeInfo ? {startTime: eventTimeInfo.startTime, endTime : eventTimeInfo.endTime} : dummyTimePeriod);
    const startTimeHour:number = parseInt(timePeriod.startTime.split(':')[0])+parseFloat(timePeriod.startTime.split(':')[1]=='30'?'0.5':'0');
    const endTimeHour:number = timePeriod.endTime == "00:00" ? 24 : parseInt(timePeriod.endTime.split(':')[0])+parseFloat(timePeriod.endTime.split(':')[1]=='30'?'0.5':'0');

    // const [prevTotalMem, setPrevTotalMem] = useState(totalMem);
  
    const dummyScheduleList:{checked_num:{[key:string]:number}, member:{[key:string]:string[]}} = {
        checked_num : {"Wed Feb 21 2024 00:00:00 GMT+0900 (한국 표준시)":4/prevTotalMem,
                        "Wed Feb 21 2024 00:30:00 GMT+0900 (한국 표준시)":3/prevTotalMem,
                        "Wed Feb 21 2024 01:00:00 GMT+0900 (한국 표준시)":2/prevTotalMem},
        member : {"Wed Feb 21 2024 00:00:00 GMT+0900 (한국 표준시)":["김명륜", "이율전", "강성대", "송성균"],
        "Wed Feb 21 2024 00:30:00 GMT+0900 (한국 표준시)":["김명륜", "이율전", "송성균"],
        "Wed Feb 21 2024 01:00:00 GMT+0900 (한국 표준시)":["김명륜", "이율전"]}
    }


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

            real_sche.setHours(new Date(sche).getHours());
            real_sche.setMinutes(new Date(sche).getMinutes());
        }
        else{
            real_sche = new Date(dateList[index]);
            real_sche.setHours(new Date(sche).getHours());
            real_sche.setMinutes(new Date(sche).getMinutes());
        }
        const sche_str = new Date(real_sche).toString().replace("대한민국", "한국");
        return sche_str;
    }

    let givenEventScheList:{checked_num:{[key:string]:number}, member:{[key:string]:string[]}} = {checked_num:{}, member:{}};
    if(eventParti) {
        for(let i = 0; i < eventParti.length; i++){
            const time_str = realScheStr(eventParti[i].time);
            givenEventScheList.checked_num[time_str] = prevTotalMem == 0 ? 0 :eventParti[i].user.length / prevTotalMem ;
            givenEventScheList.member[time_str] = []
            for(let j = 0; j < eventParti[i].user.length; j++){
                givenEventScheList.member[time_str].push(eventParti[i].user[j]?.userName)}
        }
    }

    const [scheduleList, setScheduleList] = useState(givenEventScheList);
    useEffect(()=>{
        let revisedScheduleList = scheduleList;
        for(const key in scheduleList.checked_num){
            revisedScheduleList.checked_num[key] = totalMem == 0 ? 0 : scheduleList.checked_num[key] * prevTotalMem / totalMem;
        }
        setScheduleList(revisedScheduleList);
        setPrevTotalMem(totalMem);

        }, [totalMem]);

    useEffect(()=>{
        console.log("wait", wait, totalMem != prevTotalMem, totalMem, prevTotalMem)

        if(wait || totalMem != prevTotalMem){
            return;
        }
        if(isLogin){
            setWait2(true); console.log("wait2 true");
            console.log("update", preMySelected)
            preMySelected?.map((sche:Date)=>{
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
                            [sche_str]: totalMem == 0 ? 0 : (prevSche.checked_num[sche_str]*totalMem-1)/(totalMem)
                        },
                        member:{
                            ...prevSche.member,
                            [sche_str]: new_member
                        }
                    }))   
            });

            setPreMySelected(schedule.schedule);

            console.log("scheduleList schedule", schedule.schedule)

            schedule.schedule.map((sche:Date)=>{
                const sche_str = realScheStr(sche);
                if(Object.keys(scheduleList.checked_num).includes(sche_str)){
                    setScheduleList((prevSche:{checked_num:{[key:string]:number}, member:{[key:string]:string[]}})=>{
                        console.log("totalMem", totalMem, prevTotalMem, (prevSche.checked_num[sche_str]),(totalMem==0 ? 1 : totalMem))
                        return({
                        checked_num:{
                            ...prevSche.checked_num,
                            [sche_str]: totalMem == 0 ? 0 : (prevSche.checked_num[sche_str]*totalMem+1)/(totalMem)
                        },
                        member:{
                            ...prevSche.member,
                            [sche_str]: [...prevSche.member[sche_str], name]
                        }
                    })})
                    
                }
                else{
                    setScheduleList((prevSche:{checked_num:{[key:string]:number}, member:{[key:string]:string[]}})=>{
                        console.log("totalMem n", totalMem, prevTotalMem)
                        return({
                        checked_num:{
                            ...prevSche.checked_num,
                            [sche_str]:totalMem == 0 ? 0 : 1/(totalMem)
                        },
                        member:{
                            ...prevSche.member,
                            [sche_str]: [name]
                        }
                    })})
                }
            console.log("updated scheduleList wait2",scheduleList)
        })
            setWait2(false); console.log("wait2 false");
        }
        else{
            setPreMySelected([]);
        }
    }, [wait, schedule.schedule, prevTotalMem, isLogin])


    useEffect(
        ()=>{setTotalScheduleList(scheduleList)},[scheduleList]
    )

    const [open, setOpen] = useState(true);

    const startDate = week? week_startDate : new Date(dateList[0]);
    const numsDay = week? DayList.length : dateList.length;

    useEffect(()=>{console.log("scheduleList TotalMem state",scheduleList, schedule.schedule, prevTotalMem, state)}, [schedule.schedule, state])


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
                    if(!week){
                        let index = Math.abs(date.getTime() - new Date(dateList[0]).getTime());
                        index = Math.ceil(index / (1000 * 60 * 60 * 24));
                        if(index == 1 && date.getDate() == new Date(dateList[0]).getDate()){
                            index = 0;
                        }
                        return  <div className="w-full h-full" style={{height:'25px', minWidth:"70px"}}>
                        {(new Date(dateList[index]).getMonth()+1)+'/'+new Date(dateList[index]).getDate()}
                        {"("} 
                        {lang=="ko" ? WEEKDAY[new Date(dateList[index]).getDay()] : WEEKDAY2[new Date(dateList[index]).getDay()]}
                        {")"}
                    </div>
                    }
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
                    let cellColor = "#eee";              

                    if(datetimeStr in scheduleList.checked_num){
                        selectedPct = scheduleList.checked_num[datetimeStr];
                    }
                    if(selectedPct == 0){
                        cellColor="#eee";
                    }
                    else if(selectedPct*prevTotalMem == 1){
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
                
                    const fixedScheduleList:Date[] = fixedSchedule.schedule;
        
                    if(select == 1){
                        fixedScheduleList.map((sche:Date)=>{
                            if (new Date(sche).getTime() == new Date(datetime).getTime()){
                                    cellColor = "#63c5da";
                                }
                        })
                    }

                    const memberList = scheduleList.member[datetimeStr];

                    return <div 
                        className={`relative w-full h-full ${scheduleTableCSS.date_cell}`} style={{backgroundColor : cellColor, height:'25px', minWidth:"70px"}}
                        onMouseOver={()=>{setShowMember(true); setShowMemberList(memberList); setShowDateTime(datetimeStr)}}
                        onMouseOut={()=>{setShowMember(false); setShowMemberList([]);}}>
                            
                            {width > 768 && (confirm == 2) || scheduleList.member[datetimeStr]?.length <=0 ? "" :
                            <div className ={`${scheduleTableCSS.date_cell_popup}`}>
                               {scheduleList.member[datetimeStr] ? <ul>
                                {scheduleList.member[datetimeStr].map((member)=>{
                                    return(
                                        <li>{member}</li>
                                    )
                                })}
                                </ul>:""}
                            </div>
                            }
                        </div>
                }}
                //https://codesandbox.io/p/sandbox/react-schedule-selector-bug-on-11-7-forked-d12j5?file=%2Fsrc%2Findex.js
                //https://codesandbox.io/p/sandbox/react-schedule-selector-initialization-example-74l03t?file=%2Findex.tsx
                //https://github.com/bibekg/react-schedule-selector
            />
          
            </div>:""}

        </div> 
  );
});

export default React.memo(ScheduleTableSelecto);
