import donationModel from "@/models/donation.model";
import userModel from "@/models/user.model";
import { DBConnet } from "@/libs/DBConnect";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken"


export const DELETE = async (req : NextRequest): Promise<NextResponse> => {
    DBConnet()
    try {
        
        const { donationId } = await req.json()
        const token = req.cookies.get('token')
        if(!token) return NextResponse.json({error: "Token not found"}, {status: 400})
        const decodedToken = jwt.decode(token.value)
        if(!decodedToken) return NextResponse.json({error: "Problem is decoding token"}, {status: 400})
        const id = decodedToken.id
        
        const donation = await donationModel.findByIdAndDelete(donationId)
        if(!donation) return NextResponse.json({error: "error deleting donation"}, {status: 400})
        
        const user = await userModel.findOne({_id: id})
        if(!user) return NextResponse.json({error: "User not found"}, {status: 400})
        
        user.donated = user.donated.filter(id => id.toString() !== donationId);
        await user.save()
        
        return NextResponse.json({message: "Donation deleted"}, {status: 200})

    } catch (error) {
        console.log("error: ", error)
        return NextResponse.json({erro : error}, {status: 500})
    }
}

