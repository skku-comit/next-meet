import { DaysOfWeek } from "./DaysOfWeek";

export interface TimeInfo {
    isWeekly:boolean,
    startHour:string|null,
    endHour:string|null,
    dateList?:Date[],
    dayList?:DaysOfWeek[],
}