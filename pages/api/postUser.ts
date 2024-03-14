import connectDB from "@/lib/mongodb/connectDB";
import { User } from "@/template/User";
import type { NextApiRequest, NextApiResponse } from "next";
import Event from "@/template/schema/event.model";
import { NM_CODE } from "@/lib/msg/errorMessage";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method==="POST"){
        console.log("post-user")
        try {
            await connectDB();
            const {id} = req.query;
            const reqBody = req.body;
            console.log("id", id);
            console.log("POST_USER");

            //check input
            // console.log("reqBody", reqBody);
            
            const event = await Event.findOne({ eventID: id });
            const existUser = event && event.userList ? event.userList.filter((user:User)=>{user.userID == reqBody.newNonMem.userID}) : [];
            console.log("existUser", existUser)
            let userList = [];
            if(existUser.length == 0){
                userList = event && event.userList.length>0 ? event.userList: [];
                userList.push(reqBody.newNonMem);
                console.log(userList);
            }

            await Event.findOneAndUpdate({eventID:id}, {$set:{userList: userList}}, { overwrite: true })
            res.status(201).json({ eventID: id, userList:userList });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: NM_CODE.INTERNAL_SERVER_ERROR });
        }
    }
}

export default handler;