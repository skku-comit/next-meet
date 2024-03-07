export interface User {
  userID: number; //unique id for identification
  userName: string;
  password: string|null;
}

export interface NextMeetUser extends User {
  password: string;
  loginID: string;
  email: string;
  eventIDList: string[]; //이미 참여한 이벤트 or 자신이 호스트인 이벤트
}

export interface NextMeetUserG extends User {
  password: null;
  email: string;
  eventIDList: string[];
}