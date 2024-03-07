export const getDateDiff = (date1:Date, date2:Date) => {
    
    if(new Date(date1).getMonth() == new Date(date2).getMonth()){
      return new Date(date1).getDate() - new Date(date2).getDate();
    }
    else{
      const dayOfMonth = new Date(new Date(date2).getFullYear(), new Date(date2).getMonth(), 0);
      return dayOfMonth.getDate() - new Date(date2).getDate() + new Date(date1).getDate()
    }
    
  }