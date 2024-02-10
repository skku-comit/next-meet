
export type NextMeetUser={
    userId:string;
    userName:string;
    email:string;
    eventIDList:string[]; //이미 참여한 이벤트 or 자신이 호스트인 이벤트
}