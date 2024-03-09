import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb/connectDB";
import getID from "@/lib/functions/getID";
import NextMeetUser from "@/template/schema/user.model";

export enum USER_SEARCH_RESPONSE { "NO_ERROR" = 0, "EXISTING_LOGINID", "EXISTING_EMAIL", "EXISTING_GOOGLE_ACCOUNT" = 11, "INTERNAL_SERVER_ERROR" = 99 };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();
  if (req.method === "POST") {
    //check if the user already exist, and add new user otherwise
    const { provider, userName, loginID, email, password } = req.body;
    try {
      // Check if the member is in database
      let checkQuery;
      if(provider === 'credentials'){
        checkQuery = await NextMeetUser.find({ provider:'credentials', loginID: req.body.loginID });
        if (checkQuery.length !== 0) {
          // Member already exist
          res.status(400).json({ message: USER_SEARCH_RESPONSE.EXISTING_LOGINID });
          return;
        }
      }
      else{
        checkQuery = await NextMeetUser.find({ provider:'google', email: req.body.email }); //google login
        if (checkQuery.length !== 0) {
          // Member already exist
          res.status(400).json({ message: USER_SEARCH_RESPONSE.EXISTING_GOOGLE_ACCOUNT });
          return;
        }
      }

      // Register new member
      const user = NextMeetUser;
      const hashedPassword = await bcrypt.hash(password, 10);

      await user.create({
        provider:provider,
        loginID,
        password: hashedPassword,
        userID: getID(1),
        userName,
        email,
      });

      console.log(`${userName} registered as user`);
      res.status(200).json({ message: USER_SEARCH_RESPONSE.NO_ERROR });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: USER_SEARCH_RESPONSE.INTERNAL_SERVER_ERROR });
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
        return res.status(400).json({ user: existingUser, message: USER_SEARCH_RESPONSE.EXISTING_LOGINID });
      }
      else{
        existingUser = await NextMeetUser.findOne({ email: email }).select("_id");
        return res.status(400).json({ user: existingUser, message: USER_SEARCH_RESPONSE.EXISTING_EMAIL });
      }
    }
    else{ //provider == google
      existingUser = await NextMeetUser.findOne({ email: email }).select("_id");
      if(existingUser){
        return res.status(400).json({ user: existingUser, message: USER_SEARCH_RESPONSE.EXISTING_GOOGLE_ACCOUNT });
      }
    }
  
    return res.status(200).json({ user: null, message: USER_SEARCH_RESPONSE.NO_ERROR });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ user: null, message: USER_SEARCH_RESPONSE.INTERNAL_SERVER_ERROR }); // Handle internal server errors
  }
}
};

export default handler;
