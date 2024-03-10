import { USER_SEARCH_RESPONSE } from "@/pages/api/user";
import { NextMeetEvent } from "@/template/Event";
import { Participate } from "@/template/Participate";
import { TimeInfo } from "@/template/TimeInfo";
import { NextMeetUser, User } from "@/template/User";
import { FixedDate, WeeklyFixedDate } from "@/template/WeeklyFixedDate";
const NEXTAUTH_URL = "http://localhost:3000";


export const registerEmail = async (
  userName: string,
  loginID: string,
  email: string,
  password: string
):Promise<0|1|2|11|99> => {
  try {
    const res = await fetch("api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ provider: 'credentials', userName, loginID, email, password }),
    });

    const { message } = await res.json();

    return message;
    // if (res.status == 200) {
    // } else {
    //   const { message } = await res.json();
    //   console.log("register failed.");
    //   console.log('message:', message);
    // }
  } catch (error) {
    console.log(error);
    return USER_SEARCH_RESPONSE.INTERNAL_SERVER_ERROR;
  }
};

export const registerGoogle = async (
  userName: string,
  email: string,
) => {
  try {
    const res = await fetch("api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ provider: 'google', userName, loginID:'', email, password:'' }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data.message);
    } else {
      console.log("register failed.");
    }
  } catch (error) {
    console.log(error);
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
    const res = await fetch("api/event", {
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
    const eventID = data.eventID;
    return eventID;

  } catch (error) {
    console.log(error);
  }
};


export const editEvent = async (
  eventName: string,
  description: string,
  timeInfo: TimeInfo,
  hostUserInfo:User,
  participateStatus:Participate[],
  fixedMeeting:FixedDate[] | WeeklyFixedDate[],
):Promise<string|undefined> => {
  
  try {
    const res = await fetch("api/event", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({      
        eventName,
        description,
        timeInfo,
        participateStatus,
        fixedMeeting,
        hostUserInfo
      }),
    });
    console.log(res);
    const data = await res.json();
    const eventID = data.eventID;

    return eventID;
  } catch (error) {
    console.log(error);
  }
};

export const existingUserCheck = async (provider: 'credentials'|'google', loginID: string, email: string) => {
  const queryParams = new URLSearchParams({
    userID: "null",
    provider: provider,
    loginID: loginID,
    email: email,
  });
  const res = await fetch(`api/user?userID=${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const {user, message} = await res.json();
  return message;
};

export const getUserInfoByID = async (userID: number):Promise<NextMeetUser|null> => {
  const queryParams = new URLSearchParams({
    userID: userID.toString(),
    provider: "null",
    loginID: "null",
    email: "null"
  });
  const res = await fetch(`https://localhost:3000/api/user?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const {user, message} = await res.json();
  return user;
};

export const getEvent = async (eventID: string|null) => {
  const res = await fetch("api/getEvent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ eventID }),
  });

  const data = await res.json();
  console.log(data?.existingEvent);
  return data?.existingEvent;
};


// export const getEventData = async (context: any) => {

//   try{
//     // const params = useSearchParams();
//     // const eventID = params.get('id');
//     // console.log("eventID",eventID)
//     // const existenceOfEvent = await existingEventCheck(eventID);
//     // console.log("existenceOfEvent",existenceOfEvent);
//     // if(existenceOfEvent != 1){
//     //     redirect(`/404`);
//     // }

//     const { id } = context.params;
//     const res = await fetch('api/form',{
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({      
//                 id
//             }),
//         }
//     );
    
//     if(res.ok){
//         const data: NextMeetEvent = await res.json()
//         console.log("eventName",data.eventName);
//         return data;
//     }
//     else{
//       console.log("Get Event Data failed.");
//     }
//   }catch(error){
//     console.log("event data", error);
//     return null;
//   }
// }

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