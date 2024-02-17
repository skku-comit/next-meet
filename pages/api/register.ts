import { connectMongoDB } from "@/lib/mongodb/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { NextMeetUser } from "@/template/User";

export async function handler(
  req: NextApiRequest,
  res: NextApiResponse
)
{
  if (req.method === "POST")
    {
      try{
        const {userName, userID, email, password} = await req.body;
        const hashedPassword = await bcrypt.hash(password,10);

        await connectMongoDB();
        await NextMeetUser.create({userName, userID:userID, loginID:userID, email, password:hashedPassword, eventIDList:[]});

        return res.json({ message: "User registered"});
      } catch(error){
        return res.json({ message: "error "});
      }
    }
}

export default handler;