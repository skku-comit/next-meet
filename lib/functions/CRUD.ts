import { NextMeetEvent } from "@/template/Event";
import { Participate } from "@/template/Participate";
import { TimeInfo } from "@/template/TimeInfo";
import { User } from "@/template/User";
import { FixedDate, WeeklyFixedDate } from "@/template/WeeklyFixedDate";
const NEXTAUTH_URL = "http://localhost:3000";


export const registerNextMeetUser = async (
  userName: string,
  loginID: string,
  email: string,
  password: string
) => {
  try {
    const res = await fetch("api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, loginID, email, password }),
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
    const res = await fetch("api/form", {
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
    const res = await fetch("api/form", {
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

export const existingUserCheck = async (loginID: string, email: string) => {
  const res = await fetch("api/userExists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ loginID, email }),
  });

  const data = await res.json();
  return data.message;
};

export const getEvent = async (eventID: string|null) => {
  const res = await fetch("api/getEvent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ eventID }),
  });

  const { existingEvent } = await res.json();
  console.log(existingEvent);
  return existingEvent;
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