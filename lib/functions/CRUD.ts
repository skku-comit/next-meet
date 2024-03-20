import { TimeInfo } from "@/template/TimeInfo";
import { NextMeetUser, User } from "@/template/User";
import { NM_CODE } from "../msg/errorMessage";
import { checkEnvironment } from "./checkEnv";
import { Participate } from "@/template/Participate";
import { FixedDate, WeeklyFixedDate } from "@/template/WeeklyFixedDate";

const NEXTAUTH_URL = checkEnvironment();

export const registerEmail = async (
  userName: string,
  loginID: string,
  email: string,
  password: string
):Promise<NM_CODE> => {
  try {
    const res = await fetch(`${NEXTAUTH_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ provider: 'credentials', userName, loginID, email, password }),
    });

    if(res.ok){
      const { message, user } = await res.json();
      return message;
    }
    else return NM_CODE.ETC;
  } catch (error) {
    console.log('register email failed:', error);
    return NM_CODE.INTERNAL_SERVER_ERROR;
  }
};

export const registerGoogle = async (
  userName: string,
  email: string,
):Promise<NM_CODE> => {
  try {
    const res = await fetch(`${NEXTAUTH_URL}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ provider: 'google', userName, email }),
    });

    if (res.ok) {
      const { message, user } = await res.json();
      console.log(message);
      return message;
    } else {
      console.log("register failed.");
      return NM_CODE.ETC;
    }
  } catch (error) {
    console.log(error);
    return NM_CODE.INTERNAL_SERVER_ERROR;
  }
};


export const createEvent = async (
  eventName: string,
  description: string,
  timeInfo: TimeInfo,
  hostUserInfo: User
):Promise<string|undefined> => {
  console.log('createEvent with');
  console.log(eventName,description,timeInfo,hostUserInfo);
  try {
    const res = await fetch(`${NEXTAUTH_URL}/api/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({      
        eventName,
        description,
        timeInfo,
        hostUserInfo
      }),
    });
    console.log(res);
    const data = await res.json();
    console.log(data);
    const eventID = data.eventID;
    return eventID;

  } catch (error) {
    console.log(error);
  }
};


// export const editEvent = async (
//   eventName: string,
//   description: string,
//   timeInfo: TimeInfo,
//   hostUserInfo:User,
//   participateStatus:Participate[],
//   fixedMeeting:FixedDate[] | WeeklyFixedDate[],
// ):Promise<string|undefined> => {
  
//   try {
//     const res = await fetch("api/event", {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({      
//         eventName,
//         description,
//         timeInfo,
//         participateStatus,
//         fixedMeeting,
//         hostUserInfo
//       }),
//     });
//     console.log(res);
//     const data = await res.json();
//     const eventID = data.eventID;

//     return eventID;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const existingUserCheck = async (provider: 'credentials'|'google', loginID: string, email: string) => {
  const queryParams = new URLSearchParams({
    provider: provider,
    loginID: loginID,
    email: email,
  });
  const res = await fetch(`${NEXTAUTH_URL}/api/user?${queryParams}`, {
    method: "GET",
    // headers: {
    //   "Content-Type": "application/json",
    // },
  });

  const {user, message} = await res.json();
  return message;
};

export const getUserInfoByID = async (userID: number):Promise<NextMeetUser|null> => {
  const queryParams = new URLSearchParams({
    userID: userID.toString(),
  });
  const res = await fetch(`${NEXTAUTH_URL}/api/user?${queryParams}`, {
    method: "GET",
  });

  const {user, message} = await res.json();
  return user;
};

export const getEvent = async (eventID: string|null) => {
  console.log(`${NEXTAUTH_URL}/api/event?id=${eventID}`);
  const res = await fetch(`${NEXTAUTH_URL}/api/event?id=${eventID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { event, message } = await res.json();
  return message === NM_CODE.NO_ERROR ? event : null;
};

export const postUser = async(eventID:string | string[] | undefined, newNonMem:User)=>{
    const res = await fetch(`${NEXTAUTH_URL}/api/postUser?id=${eventID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({      
        eventID, newNonMem
      }),
    });
    console.log("post_user",res);
    const data = await res.json();
    console.log(data);
}

export const addRemoveUserEventID = async (eventID:number, user : User | NextMeetUser | undefined, state : string)=>{
  const res2 = await fetch(`${NEXTAUTH_URL}/api/event`,{
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body : JSON.stringify({      
      eventID, user, state
    })
  });

  console.log("res2", res2)
  return res2;
}

export const editParticiStatus = async (eventID:number, participateStatus:Participate[]|undefined, state:string, schedule:{schedule :Date[]}) => {
  try {
    const res = await fetch(`${NEXTAUTH_URL}/api/event`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({      
        eventID, participateStatus, state
      }),
    });
    console.log(res);
    const data = await res.json();
    console.log("data", data);

  } catch (error) {
    console.log("error",error);
  } 
  console.log("typeof",typeof(schedule.schedule));

}

export const editFixedMeetingInfo = async (eventID:number, fixedMeeting: FixedDate[] | WeeklyFixedDate[], state:string)=>{
  try {
    const res = await fetch(`${NEXTAUTH_URL}/api/event`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventID,
        fixedMeeting,
        state,
      }),
    });
    console.log(res);
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}