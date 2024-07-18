import { DBConnet } from "@/libs/DBConnect";
import userModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"

export const POST = async (req: NextRequest):Promise<NextResponse> => {
    DBConnet()
    try {
        const { email, password } = await req.json()
        if (!email || !password) {
            return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
        }

        const user = await userModel.findOne({email})
        if(!user) return NextResponse.json({error: "User does not exist"},{status: 400})

        const correctPass = await bcrypt.compare(password, user.password)
        if(!correctPass) return NextResponse.json({error: "Incorrect password"},{status: 400})

        if(!user.isVerified) {
            // send verification mail,
            return NextResponse.json({message: "Please verify your account"},{status: 200})
        }

        return NextResponse.json({message: "Sign-In Success"},{status: 200})

    } catch (error) {
        console.error("Error sign-in: ",error)
        return NextResponse.json({error: "Server error"},{status: 500})
    }
}