import { TimeInfo } from "@/template/TimeInfo";
import { User } from "@/template/User";

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
  hostUserInfo:User
):Promise<string|undefined> => {
  
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
