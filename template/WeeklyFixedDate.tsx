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

// ex) 12301400 => 12:30-14:00
// export function getTimeRangeString(timeRange: number): string
// {
//     const start = `${~~(timeRange / 1000000)}:${~~(timeRange % 1000000 / 10000)}`;
//     const end = `${~~(timeRange % 10000 / 100)}:${~~(timeRange % 100)}`;

//     return `${start}-${end}`;
// }

// export function getTimeRangeNumber(timeRange: string): number
// {

// }