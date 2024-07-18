import { DBConnet } from "@/libs/DBConnect";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    DBConnet()
    try {
        const {email, passwordRecoveryCode} = await req.json()
        if(!passwordRecoveryCode) return NextResponse.json({error: "Please write code before requesting"}, {status: 400})    
        const user = await userModel.findOne({email})
        if(user?.passwordRecoveryCode !== passwordRecoveryCode) {
            return NextResponse.json({error: "Incorrect Code"}, {status: 400})
        }
        const dateNow = Date.now()
        if(dateNow > user?.passwordRecoveryCodeExpiry!){
            return NextResponse.json({error: "Code Expired"}, {status: 400})
        }
        return NextResponse.json({message: "Code Correct"}, {status: 200})
        
    } catch (error) {
        console.error("some error occured: ", error)
        return NextResponse.json({error: "server issue"}, {status:500})
    }
}