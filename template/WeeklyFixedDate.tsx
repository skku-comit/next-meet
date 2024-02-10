import { DaysOfWeek } from "./DaysOfWeek"



export type WeeklyFixedDate = 
{
    day:                DaysOfWeek;
    timeRange:          number;
}

export type FixedDate = 
{
    date:               Date;
    timeRange:          number;    
}

// ex) 12300200 => 2:30-2:00
// export function getTimeRangeString(timeRange: number): string
// {
//     const start = `${~~(timeRange / 1000000)}:${~~(timeRange % 1000000 / 10000)}`;
//     const end = `${~~(timeRange % 10000 / 100)}:${~~(timeRange % 100)}`;

//     return `${start}-${end}`;
// }

// export function getTimeRangeNumber(timeRange: string): number
// {

// }