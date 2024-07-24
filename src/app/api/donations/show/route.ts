import { DBConnet } from "@/libs/DBConnect";
import donationModel from "@/models/donation.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import userModel from "@/models/user.model";

export const GET = async (req: NextRequest) => {
    DBConnet()
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
        const userDonations = user?.donated
        if(!userDonations) return NextResponse.json({message: "No donations yet"}, {status: 200})

        const donationData = await Promise.all(
            userDonations.map(async (donationId) => {
                const donation = await donationModel.findById(donationId).select('-__v -createdAt -updatedAt -donor');
                return donation;
            })
        )

        return NextResponse.json({message: "Data sent", donationData}, {status: 200})
    } catch (error) {
        console.error("error: ", error)
        return NextResponse.json({error: "Error getting data"}, {status: 500})
    }
}