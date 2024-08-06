import { DBConnect } from "@/libs/DBConnect";
import requestModel from "@/models/requests.model";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    DBConnect();
    try {
        const { name, description } = await req.json();

        if (!name || !description) {
            return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
        }

        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        const decodedToken = jwt.decode(token) as { id: string };
        if (!decodedToken) {
            return NextResponse.json({ error: "Error decoding token" }, { status: 400 });
        }

        const id = decodedToken.id;
        const user = await userModel.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }

        const newRequest = await requestModel.create({
            name,
            description,
            postedBy: user._id,
        });

        const reqId = (newRequest._id) as mongoose.Types.ObjectId

        const allReq = user.requests as Array<mongoose.Types.ObjectId>
        // console.log(allReq)
        allReq.push(reqId)
        console.log(allReq)
        user.requests = allReq
        await user.save();

        return NextResponse.json({ message: "Request added", reqData: newRequest }, { status: 200 });
    } catch (error) {
        console.error("error: ", error);
        return NextResponse.json({ error: "Error adding request" }, { status: 500 });
    }
};
