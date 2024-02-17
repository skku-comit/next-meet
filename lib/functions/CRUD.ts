export const registerNextMeetUser = async (userName: string, userID: string, email: string, password: string) => {
  try{
      const res = await fetch('api/register', {
        method:"POST",
        headers:{
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({userName, userID, email, password})
      });
      
      if(res.ok){
        const data = await res.json(); 
        console.log(data.message);
      }
      else{
        console.log("register failed.");
      }
    }catch(error){
      console.log(error);
    }

}

export const login = async () => {

    
}

export const existingUserCheck = async (userID:string, email:string) =>{
  const res = await fetch('api/userExists',{
    method:"POST",
    headers:{
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ userID, email }),
  });

  const data = await res.json();
  return data.message; 
}