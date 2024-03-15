import { DaysOfWeek } from "./DaysOfWeek"

export type WeeklyFixedDate = 
{
    day:                DaysOfWeek;
    timeRange:          string[]; // ['12:30','13:00','13:30']
}

export type FixedDate = 
{
    date:               Date;
    timeRange:          string[];     
}
