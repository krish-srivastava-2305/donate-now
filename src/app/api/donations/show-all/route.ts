import donationModel from "@/models/donation.model";
import { DBConnet } from "@/libs/DBConnect";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest): Promise<NextResponse> => {
    DBConnet()
    try {
        const donations = await donationModel.find({}).select("-__v -createdAt -updatedAt")
        return NextResponse.json({message:"Data sent", donations}, {status:200})
    } catch (error) {
        console.error("error: ", error)
        return NextResponse.json({error: error}, {status: 500})
    }
}