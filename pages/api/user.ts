import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb/connectDB";
import getID from "@/lib/functions/getID";
import NextMeetUser from "@/template/schema/user.model";
import { NM_CODE } from "@/lib/msg/errorMessage";
import { checkEnvironment } from "@/lib/functions/checkEnv";
const NEXTAUTH_URL = checkEnvironment();
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  if (req.method === "POST") {
    //check if the user already exist, and add new user otherwise
    const { provider, userName, loginID, email, password } = req.body;
    console.log(`${NEXTAUTH_URL}/api/user/Post`, req.body);
    try {
      // Check if the member is in database
      let checkQuery;
      if(provider === 'credentials'){
        checkQuery = await NextMeetUser.find({ provider:'credentials', loginID: req.body.loginID });
        if (checkQuery.length !== 0) {
          // Member already exist
          return res.status(200).json({ message: NM_CODE.REGISTER_EXISTING_ID, user: null });
        }
      }
      else{
        checkQuery = await NextMeetUser.find({ provider:'google', email: req.body.email }); //google login
        console.log("checkQuery", checkQuery);
        if (checkQuery.length !== 0) {
          // Member already exist
          return res.status(200).json({ message: NM_CODE.REGISTER_EXISTING_ACCOUNT, user:checkQuery[0] });
        }
      }

      // Register new member
      const user = NextMeetUser;
      const userID = getID(1);
      let new_user;
      if(provider === 'credentials'){ //email register
        const hashedPassword = await bcrypt.hash(password, 10);
        new_user = {
          provider: 'credentials',
          loginID,
          password: hashedPassword,
          userID: userID,
          userName,
          email,
        }
      }
      else{ //social register
        new_user = {
          provider: 'google',
          userID,
          userName,
          email,
        }
      }

      console.log("new user", new_user);
      await user.create(new_user);
      console.log(`${userName} registered as user`);

      res.status(200).json({ message: NM_CODE.NO_ERROR, user : new_user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: NM_CODE.INTERNAL_SERVER_ERROR, user : null });
    }
  }

  else if(req.method === "GET"){
    //check if the user already exist, and return user info otherwise
    const { userID, provider, loginID, email } = req.query;
    console.log('req.query:', req.query);
    let existingUser;
    try{
    //find by userID
    // if(userID !== null){ 
    //   existingUser = await NextMeetUser.findOne({ userID: userID }).select("_id");
    //   if(existingUser){
    //     return res.status(400).json({ user: existingUser, message:''});
    //   }
    //   else return res.status(200).json({ user: null, message:''});
    // }
    //find by loginID and Email
    if(provider === 'credentials'){
      existingUser = await NextMeetUser.findOne({ loginID: loginID }).select("_id");
      if(existingUser){
        return res.status(400).json({ user: existingUser, message: NM_CODE.SEARCH_EXISTING_ID });
      }
      else{
        existingUser = await NextMeetUser.findOne({ email: email }).select("_id");
        return res.status(400).json({ user: existingUser, message: NM_CODE.SEARCH_EXISTING_EMAIL });
      }
    }
    else{ //provider == google
      existingUser = await NextMeetUser.findOne({ email: email }).select("_id");
      if(existingUser){
        return res.status(400).json({ user: existingUser, message: NM_CODE.SEARCH_EXISTING_ACCOUNT });
      }
    }
  
    return res.status(200).json({ user: null, message: NM_CODE.NO_ERROR });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ user: null, message: NM_CODE.INTERNAL_SERVER_ERROR }); // Handle internal server errors
  }
}
};

export default handler;
