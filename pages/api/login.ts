import { connectMongoDB } from "@/lib/mongodb/mongodb";
import { NextMeetUser } from "@/template/User";
import bcrypt from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";

export enum LOGIN_FAIL_ERR {
  "NO_ERROR" = 0,
  "NOT_EXISTING_USERID",
  "INCORRECT_PW",
  "ETC",
}

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      connectMongoDB();
    } catch (error) {
      console.log(error);
    }

    const { userID, password } = await req.body;
    const user = await NextMeetUser.findOne({ userID: userID });
    if (user) {
      const passwordCheck = await bcrypt.compare(password, user.password);
      if (passwordCheck) {
        const { password, ...dataWithoutPassword } = user._doc;
        return res.json({
          message: LOGIN_FAIL_ERR.NO_ERROR,
          ...dataWithoutPassword,
        });
      } else {
        return res.json({ message: LOGIN_FAIL_ERR.INCORRECT_PW });
      }
    } else {
      return res.json({ message: LOGIN_FAIL_ERR.NOT_EXISTING_USERID });
    }
  }
}

export default handler;
