import { DBConnect } from "@/libs/DBConnect";
import requestModel from "@/models/requests.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import userModel from "@/models/user.model";

export const GET = async (req: NextRequest) => {
    DBConnect()
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: "Token not found" }, { status: 400 });
        }

        const decodedToken = jwt.decode(token) as {id: string}
        if (!decodedToken) {
            return NextResponse.json({ error: "Problem decoding token" }, { status: 400 });
        }

        const id = decodedToken.id;

        const user = await userModel.findOne({_id: id})
        const userRequests = user?.requests
        if(!userRequests) return NextResponse.json({message: "No donations yet"}, {status: 200})

        const reqData = await Promise.all(
            userRequests.map(async (reqId) => {
                const request = await requestModel.findById(reqId).select('-__v -createdAt -updatedAt -donor');
                return request;
            })
        )

        return NextResponse.json({message: "Data sent", reqData}, {status: 200})
    } catch (error) {
        console.error("error: ", error)
        return NextResponse.json({error: "Error getting data"}, {status: 500})
    }
}