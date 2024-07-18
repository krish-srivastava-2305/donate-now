import userModel from "@/models/user.model";
import { DBConnet } from "@/libs/DBConnect";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        DBConnet();
        const {verifyCode, email} = await req.json()
        if(!email || !verifyCode) return NextResponse.json({error: "fill details"}, {status: 400})

        const user = await userModel.findOne({email})
        if(!user) return NextResponse.json({error: "User not found"}, {status: 400})

        if(user.verifyCode !== parseInt(verifyCode)) return NextResponse.json({error: "Wrong Code"}, {status: 400})
        const dateNow = Date.now()
        if(dateNow > user.verifyCodeExpiry) return NextResponse.json({error: "Code Expired"}, {status: 400})
        
        user.isVerified = true
        await user.save()
        return NextResponse.json({message: "Code Accepted"}, {status: 200})
        
    } catch (error) {
        console.error("some error: ",error)
        return NextResponse.json({error: "server error"}, {status: 500})
    }
}