import { DBConnet } from "@/libs/DBConnect";
import userModel from "@/models/user.model";
import donationModel from "@/models/donation.model";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    DBConnet()
    try {
        const {name, description} = await req.json()
        if(!name || !description) return NextResponse.json({error: "Fill details"}, {status: 400})

        const token: any = req.cookies.get("token")
        // console.log(token)
        if(!token) return NextResponse.json({error: "error fetching token"}, {status: 400})

        const decodedToken = jwt.decode(token.value)
        console.log(decodedToken)
        if(!decodedToken) return NextResponse.json({error: "error fetching token"}, {status: 400})

        const id = decodedToken.id

        const user = await userModel.findOne({_id: id})
        if(!user) return NextResponse.json({error: "User not found"}, {status: 400})

        const donation = await donationModel.create({
            name,
            description,
            donor: id
        })
        if(!donation) return NextResponse.json({error: "error registering donation"}, {status: 400})

        const donations = user.donated
        donations.push(donation._id)
        user.donated = donations
        await user.save()


        return NextResponse.json({message: 'Donation Registered', user, donation}, {status: 200})
    } catch (error) {
        console.error("error: ", error)
        return NextResponse.json({error: error}, {status: 500})
    }
}
