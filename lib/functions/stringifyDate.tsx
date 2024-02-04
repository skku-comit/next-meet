export function stringifyDate(date:Date) {
    if (!(date instanceof Date)) {
        throw new Error('Input must be a Date object');
    }

    let year:number = date.getFullYear();
    let month:number = date.getMonth() + 1; // getMonth() is zero-based
    let day:number = date.getDate();

    // Adding leading zeros if month or day is less than 10
    month = month < 10 ? +('0' + month.toString()) : month;
    day = day < 10 ? +('0' + day.toString()) : day;

    return `${year}-${month}-${day}`;
}

// Example usage
const now = new Date();
console.log(stringifyDate(now)); // Outputs the current date in YYYY-MM-DD format
