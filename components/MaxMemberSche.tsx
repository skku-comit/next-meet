import { useEffect, useState } from "react";
import { language } from '../lib/recoil/language';
import { useRecoilState } from "recoil";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { DaysOfWeek } from "@/template/DaysOfWeek";
import { handleConfirm } from "@/lib/functions/handleConfirm";

interface MyComponentProps {
    index : number;
    week : boolean;
    start_sche : Date;
    end_sche : Date;
    scheduleList : {checked_num:{[key:string]:number}, member:{[key:string]:string[]}};
    sche : string;
    isHost:boolean;
    checked_mem_num : number[];
    totalMem:number;
    prevTotalMem:number;
    week_startDate:Date;
    dateList : string[];
    selectedWeekDay : DaysOfWeek[];
    setFixedSchedule : Function;
    setSelect: Function;
    setConfirm:Function;
    eventID:number;
    setPreFixedSchedule:Function;
    fixedSchedule:{schedule:Date[]};
}

const MaxMemberSche = ({index, week, isHost, start_sche, end_sche, scheduleList,sche, checked_mem_num, totalMem, prevTotalMem, week_startDate, 
        dateList, selectedWeekDay, setFixedSchedule, setSelect, setConfirm, eventID, setPreFixedSchedule, fixedSchedule}:MyComponentProps) =>{
    
    const [lang, setLang] = useRecoilState(language);
    const [showMaxMember, setShowMaxMember] = useState(false);
    
    const WEEKDAY:DaysOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const WEEKDAY2 = ['일', '월', '화', '수', '목', '금', '토'];
    const WEEKDAY3 = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const weekDaySorter:{ [index: string]: number } = { 'Mon':1 , 'Tue':2 , 'Wed':3 , 'Thu':4 , 'Fri':5 , 'Sat':6 ,'Sun':7 , }
    const sortedSelectedWeekDay = selectedWeekDay.sort((a:string,b:string)=>weekDaySorter[a]-weekDaySorter[b])

    const realScheToSelecto = (sche:Date) => {
        let selectoDate:Date = new Date(sche);;
        if(week){
            const scheDay = WEEKDAY[new Date(sche).getDay()];
            console.log("selectoDate day", scheDay, sortedSelectedWeekDay);
            const index = sortedSelectedWeekDay.indexOf(scheDay);
            console.log("selectoDate index", index);
            selectoDate = new Date(sche);
            selectoDate.setMonth(new Date(week_startDate).getMonth())
            selectoDate.setDate(new Date(week_startDate).getDate() + index);
        }
        else{
            let date = new Date(sche);
            date.setHours(0);
            date.setMinutes(0);
            date.setMilliseconds(0);
            // console.log("selectoDate date", date, new Date(date).toISOString(), dateList);
            let index = 0;
            for(let i=0; i< dateList.length ; i++){
                const indexDate = dateList[i].toString().split("T")[0];
                if(new Date(indexDate).getFullYear()==date.getFullYear() && new Date(indexDate).getMonth() == date.getMonth() && new Date(indexDate).getDate()==date.getDate()){
                    index = i;
                }
                // console.log("selectoDate date 2", new Date(indexDate).getFullYear()==date.getFullYear() && new Date(indexDate).getMonth() == date.getMonth() && new Date(indexDate).getDate()==date.getDate());
            }
            // console.log("selectoDate index", date, index);
            selectoDate = new Date(sche);
            selectoDate.setMonth(new Date(dateList[0].toString().split("T")[0]).getMonth())
            selectoDate.setDate(new Date(dateList[0].toString().split("T")[0]).getDate()+index);
        }

        console.log("selectoDate", selectoDate);
        return selectoDate;
    }

    const fixedDateList:Date[]= [];
    for(let i = 0; i < ((end_sche.getTime()-start_sche.getTime())/(30 * 60 * 1000)) ; i++){
        let schedule = new Date(start_sche)
        schedule.setMinutes(schedule.getMinutes()+30*i);
        const selectoDate = realScheToSelecto(schedule);
        console.log("fixedDateList b",schedule, selectoDate, start_sche)
        fixedDateList.push(selectoDate);
    }

    let exist = true;

    console.log("fixedDateList", start_sche, end_sche, fixedDateList);

    fixedDateList.map((date)=>{
        const existed = fixedSchedule.schedule.filter((sche)=>(new Date(sche).getTime() == new Date(date).getTime()))
        if(existed.length <= 0){
            exist = false;
        }
    })

    const [scheConfirm, setScheConfirm] = useState(exist);

    useEffect(()=>{console.log("fixedSchedule",fixedSchedule)}, [fixedSchedule])

    return(
        <li className={`flex flex-col ${showMaxMember ? "gap-2":"gap-0.5"} bg-[lightgray] px-3 pt-3 pb-2 rounded cursor-pointer`}  key={index}>
          <div className={`flex flex-row gap-1`} onClick={()=>{
            //show the member name in row
            showMaxMember ? setShowMaxMember(false) : setShowMaxMember(true)
            }}>
            <div>
                <p className="inline-block">{(week ? "" : start_sche.toLocaleDateString('ko-KR')) + '(' + (lang=="ko" ? WEEKDAY2[start_sche.getDay()] :WEEKDAY3[start_sche.getDay()]) + ')'}</p>
                <p className="inline-block ml-0.5">{start_sche.toLocaleTimeString('ko-KR')}</p>
                <div className="inline-block mx-1"> ~ </div>
                <p className="inline-block">{(week ? "" : start_sche.getUTCDate() == end_sche.getUTCDate() ? "" : (end_sche.toLocaleDateString('ko-KR')) + '(' + (lang=="ko" ? WEEKDAY2[start_sche.getDay()] :WEEKDAY3[start_sche.getDay()]) + ')')}</p>
                <p className="inline-block ml-0.5">{end_sche.toLocaleTimeString('ko-KR')}</p>
                <p className="inline-block ml-2 text-[red] font-bold">{'(' + (Math.max(...checked_mem_num)*prevTotalMem) + '/' + prevTotalMem + ')'}</p>
            </div>
            {showMaxMember ? <FaAngleUp/> : <FaAngleDown/>}
          </div>
          <div>
                {showMaxMember ? <p className="text-gray-600">
                    <hr className="border-black mb-2"/>
                    {lang=="ko" ? "멤버":"Members"} : {scheduleList.member[new Date(sche).toString().replace("대한민국", "한국")]?.toString().replaceAll(",", ", ")}
                </p> :""}
          </div>
          {isHost ? <div>
                {
                    !scheConfirm ?
                     <button className={`w-full pt-1 bg-[darkgray] rounded hover:bg-[gray]`} 
                        onClick={()=>{setScheConfirm((prev)=>(!prev));
                            setFixedSchedule((prev:{schedule:Date[]})=>{
                                let newSche = prev.schedule;
                                fixedDateList.map((date)=>{
                                    const existed = newSche.filter((sche)=>(new Date(sche).getTime() == new Date(date).getTime()))
                                    if(existed.length <= 0){
                                        newSche.push(date);
                                    }
                                })
                                console.log("fixedDateList scheConfirm",newSche);
                                handleConfirm(newSche, week, eventID, setPreFixedSchedule);                
                                return({schedule : newSche})
                            })
                            setSelect(1);
                            setConfirm(2);
                        }}>
                        {lang == "ko" ? "확정" : "Confirm"}
                     </button>
                    :<button className={`w-full pt-1 bg-[darkgray] rounded hover:bg-[gray]`} 
                        onClick={()=>{setScheConfirm((prev)=>(!prev));
                            setFixedSchedule((prev:{schedule:Date[]})=>{
                                let newSche = prev.schedule;
                                fixedDateList.map((date)=>{
                                    newSche = newSche.filter((sche)=>(new Date(sche).getTime() != new Date(date).getTime()))
                                })
                                if(newSche.length <=0){
                                    setSelect(0);
                                    setConfirm(0);
                                }
                                else{
                                    setSelect(1);
                                    setConfirm(2);
                                }
                                console.log("fixedDateList cancel",newSche);
                                handleConfirm(newSche, week, eventID, setPreFixedSchedule);                
                                return({schedule : newSche})})
                            }}>
                        {lang == "ko" ? "확정 취소" : "Confirmed Cancel"}
                     </button>
                }
          </div>: ""}
        </li>
    )
}

export default MaxMemberSche;
