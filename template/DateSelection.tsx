import { DaysOfWeek } from "./DaysOfWeek";

export type DateSelection = {isWeekly:true, dateList:DaysOfWeek[]} | {isWeekly:false, dateList:Date[]};