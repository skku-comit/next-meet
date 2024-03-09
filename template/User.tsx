export interface User {
  userID: number; //unique id for identification
  userName: string;
  password?: string;  // Password would be null except for the case of "credenetials"
}

export interface NextMeetUser extends User {
  provider: 'credentials'|'google';
  loginID: string;
  email: string;
  eventIDList: string[]; //이미 참여한 이벤트 or 자신이 호스트인 이벤트
}

// export interface NextMeetUserG extends User {
//   password: null;
//   email: string;
//   eventIDList: string[];
// }