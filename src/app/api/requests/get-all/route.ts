import { DBConnet } from "@/libs/DBConnect";
import { NextRequest, NextResponse } from "next/server";
import requestModel from "@/models/requests.model";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    DBConnet()
    try {
        const requests = await requestModel.find({}).select("-__v -createdAt -updatedAt")
        return NextResponse.json({message:"Data sent", requests}, {status:200})
    } catch (error) {
        console.error("error: ", error)
        return NextResponse.json({error: error}, {status: 500})
    }
}