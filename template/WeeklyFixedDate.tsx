import { DaysOfWeek } from "./DaysOfWeek"

export type WeeklyFixedDate = {
    day:DaysOfWeek;
    time:string; // ex) '12:30'
}

type time = 
{
    start:          string;
    end:            string;
}