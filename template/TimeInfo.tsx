import { DaysOfWeek } from "./DaysOfWeek";

export interface TimeInfo {
    isWeekly:       boolean,
    startTime:      string,
    endTime:        string,
    dateList:       Date[],
    dayList:        DaysOfWeek[],
}