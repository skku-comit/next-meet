import { DaysOfWeek } from "@/template/DaysOfWeek";
import { FixedDate, WeeklyFixedDate } from "@/template/WeeklyFixedDate";
import { checkEnvironment } from "./checkEnv";
const NEXTAUTH_URL = checkEnvironment();
export const handleConfirm = async (newSchedule:Date[], week:boolean, eventID:number, setPreFixedSchedule:Function) => {

    console.log("handleConfirm", newSchedule)

    const state = "CONFIRM";

    let fixedMeeting:FixedDate[] | WeeklyFixedDate[] = [];
    const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    if(newSchedule.length > 0) {
      newSchedule.map((sche:Date)=>{
        const time = new Date(sche).getHours() + ":" + new Date(sche).getMinutes();

        if(week){
          (fixedMeeting as WeeklyFixedDate[]).push({day : WEEKDAY[new Date(sche).getDay()] as DaysOfWeek, timeRange:[time]})
        }
        else{
          (fixedMeeting as FixedDate[]).push({date : new Date(sche), timeRange:[time]})
        }      
      })
    }

    console.log("FixedMeeting", fixedMeeting, newSchedule.length > 0 ? [...newSchedule]:[])

    try {
      const res = await fetch(`${NEXTAUTH_URL}/api/event`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({      
          eventID, fixedMeeting, state
        }),
      });
      console.log(res);
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    } 

    setPreFixedSchedule({schedule:newSchedule.length > 0 ? [...newSchedule]:[]});
    // console.log(fixedSchedule.schedule);
}