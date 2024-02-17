import type { NextApiRequest, NextApiResponse } from "next";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse
)
{
  if (req.method === "POST")
    {
      try{
        const {userID, email, password} = await req.body;
        console.log("userID:",userID);
        console.log("password:",password);

        return res.json({ message: "User registered"});
      } catch(error){
        return res.json({ message: "error "});
      }
    }
}

export default handler;